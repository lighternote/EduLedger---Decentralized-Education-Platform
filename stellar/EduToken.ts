import * as StellarSDK from '@stellar/stellar-sdk';

// Stellar Network Configuration
const server = new StellarSDK.Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = StellarSDK.Networks.TESTNET;

// EduToken Asset on Stellar
export class EduToken {
  private asset: StellarSDK.Asset;
  private issuingKeypair: StellarSDK.Keypair;
  private distributionKeypair: StellarSDK.Keypair;

  constructor(issuerSecret: string, distributionSecret: string) {
    this.issuingKeypair = StellarSDK.Keypair.fromSecret(issuerSecret);
    this.distributionKeypair = StellarSDK.Keypair.fromSecret(distributionSecret);
    this.asset = new StellarSDK.Asset('EDU', this.issuingKeypair.publicKey());
  }

  // Create EduToken asset
  async createAsset(): Promise<void> {
    try {
      // Create issuing account if it doesn't exist
      await this.ensureAccountExists(this.issuingKeypair);
      
      // Create distribution account
      await this.ensureAccountExists(this.distributionKeypair);
      
      // Set trustline from distribution account
      const trustTransaction = new StellarSDK.TransactionBuilder(
        await server.loadAccount(this.distributionKeypair.publicKey()),
        { networkPassphrase, fee: StellarSDK.BASE_FEE }
      )
        .addOperation(StellarSDK.Operation.changeTrust({
          asset: this.asset,
          limit: '10000000000' // 10 billion tokens
        }))
        .setTimeout(30)
        .build();

      trustTransaction.sign(this.distributionKeypair);
      await server.submitTransaction(trustTransaction);

      // Mint initial supply
      await this.mint(this.distributionKeypair.publicKey(), '1000000000');
      
      console.log('EduToken created successfully');
    } catch (error) {
      console.error('Error creating EduToken:', error);
      throw error;
    }
  }

  // Mint tokens (create payment from issuing account)
  async mint(destination: string, amount: string): Promise<void> {
    try {
      const issuingAccount = await server.loadAccount(this.issuingKeypair.publicKey());
      
      const transaction = new StellarSDK.TransactionBuilder(issuingAccount, {
        networkPassphrase,
        fee: StellarSDK.BASE_FEE
      })
        .addOperation(StellarSDK.Operation.payment({
          destination,
          asset: this.asset,
          amount
        }))
        .setTimeout(30)
        .build();

      transaction.sign(this.issuingKeypair);
      await server.submitTransaction(transaction);
      
      console.log(`Minted ${amount} EDU to ${destination}`);
    } catch (error) {
      console.error('Error minting tokens:', error);
      throw error;
    }
  }

  // Staking mechanism using Stellar multisig and time-locked escrow
  async stake(userKeypair: StellarSDK.Keypair, amount: string, lockPeriod: number): Promise<string> {
    try {
      // Create escrow account for staking
      const escrowKeypair = StellarSDK.Keypair.random();
      
      // Fund escrow account
      await server.friendbot(escrowKeypair.publicKey());
      
      // Set up multisig with time lock
      const escrowAccount = await server.loadAccount(escrowKeypair.publicKey());
      
      const unlockTime = Math.floor(Date.now() / 1000) + lockPeriod;
      
      const transaction = new StellarSDK.TransactionBuilder(escrowAccount, {
        networkPassphrase,
        fee: StellarSDK.BASE_FEE,
        timebounds: { minTime: unlockTime, maxTime: 0 }
      })
        .addOperation(StellarSDK.Operation.setOptions({
          masterWeight: 0,
          lowThreshold: 1,
          mediumThreshold: 1,
          highThreshold: 1,
          signer: {
            ed25519PublicKey: userKeypair.publicKey(),
            weight: 1
          }
        }))
        .addOperation(StellarSDK.Operation.payment({
          destination: escrowKeypair.publicKey(),
          asset: this.asset,
          amount
        }))
        .setTimeout(30)
        .build();

      transaction.sign(this.issuingKeypair, userKeypair, escrowKeypair);
      const result = await server.submitTransaction(transaction);
      
      console.log(`Staked ${amount} EDU for ${lockPeriod} seconds`);
      return escrowKeypair.publicKey();
    } catch (error) {
      console.error('Error staking tokens:', error);
      throw error;
    }
  }

  // Unstake tokens
  async unstake(escrowPublicKey: string, userKeypair: StellarSDK.Keypair): Promise<void> {
    try {
      const escrowAccount = await server.loadAccount(escrowPublicKey);
      
      // Calculate rewards (1% per month)
      const balance = escrowAccount.balances.find(b => 
        b.asset_type === 'credit_alphanum4' && 
        b.asset_code === 'EDU'
      );
      
      if (!balance) {
        throw new Error('No staked tokens found');
      }
      
      const stakedAmount = parseFloat(balance.balance);
      const rewards = stakedAmount * 0.01; // 1% reward
      
      // Transfer staked amount + rewards back to user
      const transaction = new StellarSDK.TransactionBuilder(escrowAccount, {
        networkPassphrase,
        fee: StellarSDK.BASE_FEE
      })
        .addOperation(StellarSDK.Operation.payment({
          destination: userKeypair.publicKey(),
          asset: this.asset,
          amount: (stakedAmount + rewards).toString()
        }))
        .setTimeout(30)
        .build();

      transaction.sign(userKeypair);
      await server.submitTransaction(transaction);
      
      console.log(`Unstaked ${stakedAmount} EDU with ${rewards} EDU rewards`);
    } catch (error) {
      console.error('Error unstaking tokens:', error);
      throw error;
    }
  }

  // Get balance
  async getBalance(accountId: string): Promise<string> {
    try {
      const account = await server.loadAccount(accountId);
      const balance = account.balances.find(b => 
        b.asset_type === 'credit_alphanum4' && 
        b.asset_code === 'EDU'
      );
      
      return balance ? balance.balance : '0';
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  // Ensure account exists (fund with friendbot for testnet)
  private async ensureAccountExists(keypair: StellarSDK.Keypair): Promise<void> {
    try {
      await server.loadAccount(keypair.publicKey());
    } catch (error) {
      // Account doesn't exist, create it
      await server.friendbot(keypair.publicKey());
    }
  }

  // Get asset info
  getAsset(): StellarSDK.Asset {
    return this.asset;
  }

  // Get issuing account
  getIssuingAccount(): string {
    return this.issuingKeypair.publicKey();
  }
}

// Staking Pool Contract using Stellar Smart Contracts
export class StakingPool {
  private poolKeypair: StellarSDK.Keypair;
  private eduToken: EduToken;

  constructor(poolSecret: string, eduToken: EduToken) {
    this.poolKeypair = StellarSDK.Keypair.fromSecret(poolSecret);
    this.eduToken = eduToken;
  }

  // Create staking pool
  async createPool(): Promise<void> {
    try {
      // Ensure pool account exists
      const server = new StellarSDK.Horizon.Server('https://horizon-testnet.stellar.org');
      
      try {
        await server.loadAccount(this.poolKeypair.publicKey());
      } catch (error) {
        await server.friendbot(this.poolKeypair.publicKey());
      }

      // Set trustline for EDU tokens
      const poolAccount = await server.loadAccount(this.poolKeypair.publicKey());
      
      const transaction = new StellarSDK.TransactionBuilder(poolAccount, {
        networkPassphrase: StellarSDK.Networks.TESTNET,
        fee: StellarSDK.BASE_FEE
      })
        .addOperation(StellarSDK.Operation.changeTrust({
          asset: this.eduToken.getAsset(),
          limit: '1000000000'
        }))
        .setTimeout(30)
        .build();

      transaction.sign(this.poolKeypair);
      await server.submitTransaction(transaction);
      
      console.log('Staking pool created successfully');
    } catch (error) {
      console.error('Error creating staking pool:', error);
      throw error;
    }
  }

  // Get pool stats
  async getPoolStats(): Promise<{totalStaked: string, stakers: number}> {
    try {
      const server = new StellarSDK.Horizon.Server('https://horizon-testnet.stellar.org');
      const poolAccount = await server.loadAccount(this.poolKeypair.publicKey());
      
      const balance = poolAccount.balances.find(b => 
        b.asset_type === 'credit_alphanum4' && 
        b.asset_code === 'EDU'
      );
      
      return {
        totalStaked: balance ? balance.balance : '0',
        stakers: 0 // Would need to track stakers separately
      };
    } catch (error) {
      console.error('Error getting pool stats:', error);
      return { totalStaked: '0', stakers: 0 };
    }
  }
}
