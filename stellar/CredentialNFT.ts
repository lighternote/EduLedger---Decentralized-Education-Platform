import * as StellarSDK from '@stellar/stellar-sdk';

// Credential types
const enum CredentialType { 
  DEGREE = 'DEGREE', 
  CERTIFICATE = 'CERTIFICATE', 
  BADGE = 'BADGE', 
  SKILL = 'SKILL' 
}

// Stellar doesn't have NFTs like Ethereum, so we'll use unique assets and metadata
export class CredentialNFT {
  private server: StellarSDK.Horizon.Server;
  private networkPassphrase: string;
  private issuerKeypair: StellarSDK.Keypair;

  constructor(issuerSecret: string, isTestnet: boolean = true) {
    this.issuerKeypair = StellarSDK.Keypair.fromSecret(issuerSecret);
    this.server = isTestnet ? 
      new StellarSDK.Horizon.Server('https://horizon-testnet.stellar.org') :
      new StellarSDK.Horizon.Server('https://horizon.stellar.org');
    this.networkPassphrase = isTestnet ? 
      StellarSDK.Networks.TESTNET : 
      StellarSDK.Networks.PUBLIC;
  }

  // Issue a credential as a unique asset
  async issueCredential(
    recipientPublicKey: string,
    institutionName: string,
    courseName: string,
    credentialType: CredentialType,
    expiryDate: number,
    ipfsHash: string,
    metadata: any
  ): Promise<string> {
    try {
      // Create unique asset code for this credential
      const assetCode = this.generateAssetCode(institutionName, courseName, credentialType);
      const credentialAsset = new StellarSDK.Asset(assetCode, this.issuerKeypair.publicKey());
      
      // Ensure recipient account exists
      await this.ensureAccountExists(recipientPublicKey);
      
      // Create trustline for the credential asset
      const recipientAccount = await this.server.loadAccount(recipientPublicKey);
      
      const trustlineTransaction = new StellarSDK.TransactionBuilder(recipientAccount, {
        networkPassphrase: this.networkPassphrase,
        fee: StellarSDK.BASE_FEE
      })
        .addOperation(StellarSDK.Operation.changeTrust({
          asset: credentialAsset,
          limit: '1' // Only 1 unit for uniqueness (NFT-like)
        }))
        .setTimeout(30)
        .build();

      // Sign with recipient's key (in production, this would be done by the recipient)
      // For demo purposes, we'll assume we have access to recipient's key
      // trustlineTransaction.sign(recipientKeypair);
      // await this.server.submitTransaction(trustlineTransaction);
      
      // Issue the credential (mint 1 unit)
      const issuerAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
      
      const issueTransaction = new StellarSDK.TransactionBuilder(issuerAccount, {
        networkPassphrase: this.networkPassphrase,
        fee: StellarSDK.BASE_FEE
      })
        .addOperation(StellarSDK.Operation.payment({
          destination: recipientPublicKey,
          asset: credentialAsset,
          amount: '1'
        }))
        .addOperation(StellarSDK.Operation.manageData({
          name: `credential_${assetCode}`,
          value: JSON.stringify({
            institutionName,
            courseName,
            credentialType,
            issueDate: Math.floor(Date.now() / 1000),
            expiryDate,
            ipfsHash,
            metadata,
            verified: true
          })
        }))
        .setTimeout(30)
        .build();

      issueTransaction.sign(this.issuerKeypair);
      const result = await this.server.submitTransaction(issueTransaction);
      
      console.log(`Credential issued: ${assetCode}`);
      return assetCode;
    } catch (error) {
      console.error('Error issuing credential:', error);
      throw error;
    }
  }

  // Verify credential
  async verifyCredential(assetCode: string): Promise<boolean> {
    try {
      const issuerAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
      const dataEntry = issuerAccount.data_attr.find(data => 
        data.name === `credential_${assetCode}`
      );
      
      if (!dataEntry) {
        return false;
      }
      
      const credentialData = JSON.parse(dataEntry.value.toString('utf8'));
      
      // Check if credential is expired
      if (credentialData.expiryDate > 0 && Math.floor(Date.now() / 1000) > credentialData.expiryDate) {
        return false;
      }
      
      return credentialData.verified === true;
    } catch (error) {
      console.error('Error verifying credential:', error);
      return false;
    }
  }

  // Get credential details
  async getCredential(assetCode: string): Promise<any> {
    try {
      const issuerAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
      const dataEntry = issuerAccount.data_attr.find(data => 
        data.name === `credential_${assetCode}`
      );
      
      if (!dataEntry) {
        throw new Error('Credential not found');
      }
      
      return JSON.parse(dataEntry.value.toString('utf8'));
    } catch (error) {
      console.error('Error getting credential:', error);
      throw error;
    }
  }

  // Get all credentials for a user
  async getUserCredentials(userPublicKey: string): Promise<string[]> {
    try {
      const userAccount = await this.server.loadAccount(userPublicKey);
      const credentials: string[] = [];
      
      // Check all balances for credential assets (assets issued by this issuer)
      userAccount.balances.forEach(balance => {
        if (balance.asset_type === 'credit_alphanum4' || balance.asset_type === 'credit_alphanum12') {
          const asset = balance as any;
          if (asset.asset_issuer === this.issuerKeypair.publicKey() && parseFloat(balance.balance) > 0) {
            credentials.push(asset.asset_code);
          }
        }
      });
      
      return credentials;
    } catch (error) {
      console.error('Error getting user credentials:', error);
      return [];
    }
  }

  // Revoke credential
  async revokeCredential(assetCode: string, userPublicKey: string): Promise<void> {
    try {
      const credentialAsset = new StellarSDK.Asset(assetCode, this.issuerKeypair.publicKey());
      
      // Burn the credential by sending it back to issuer
      const userAccount = await this.server.loadAccount(userPublicKey);
      
      const burnTransaction = new StellarSDK.TransactionBuilder(userAccount, {
        networkPassphrase: this.networkPassphrase,
        fee: StellarSDK.BASE_FEE
      })
        .addOperation(StellarSDK.Operation.payment({
          destination: this.issuerKeypair.publicKey(),
          asset: credentialAsset,
          amount: '1'
        }))
        .setTimeout(30)
        .build();

      // Sign with user's key (in production, this would be done by the user)
      // burnTransaction.sign(userKeypair);
      // await this.server.submitTransaction(burnTransaction);
      
      // Mark credential as revoked in data
      const issuerAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
      
      const revokeTransaction = new StellarSDK.TransactionBuilder(issuerAccount, {
        networkPassphrase: this.networkPassphrase,
        fee: StellarSDK.BASE_FEE
      })
        .addOperation(StellarSDK.Operation.manageData({
          name: `revoked_${assetCode}`,
          value: Math.floor(Date.now() / 1000).toString()
        }))
        .setTimeout(30)
        .build();

      revokeTransaction.sign(this.issuerKeypair);
      await this.server.submitTransaction(revokeTransaction);
      
      console.log(`Credential revoked: ${assetCode}`);
    } catch (error) {
      console.error('Error revoking credential:', error);
      throw error;
    }
  }

  // Generate unique asset code
  private generateAssetCode(institutionName: string, courseName: string, credentialType: CredentialType): string {
    // Create a unique but readable asset code (max 12 characters for alphanum4)
    const timestamp = Math.floor(Date.now() / 1000).toString(36);
    const institutionAbbr = institutionName.substring(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const courseAbbr = courseName.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const typeAbbr = credentialType.substring(0, 2);
    
    return `${institutionAbbr}${courseAbbr}${typeAbbr}${timestamp}`.substring(0, 12);
  }

  // Ensure account exists
  private async ensureAccountExists(publicKey: string): Promise<void> {
    try {
      await this.server.loadAccount(publicKey);
    } catch (error) {
      // For testnet, use friendbot to create account
      if (this.networkPassphrase === StellarSDK.Networks.TESTNET) {
        await this.server.friendbot(publicKey);
      } else {
        throw new Error('Account does not exist and cannot be created on mainnet');
      }
    }
  }

  // Add authorized issuer (multisig approach)
  async addAuthorizedIssuer(newIssuerPublicKey: string): Promise<void> {
    try {
      const issuerAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
      
      const transaction = new StellarSDK.TransactionBuilder(issuerAccount, {
        networkPassphrase: this.networkPassphrase,
        fee: StellarSDK.BASE_FEE
      })
        .addOperation(StellarSDK.Operation.setOptions({
          signer: {
            ed25519PublicKey: newIssuerPublicKey,
            weight: 1
          }
        }))
        .setTimeout(30)
        .build();

      transaction.sign(this.issuerKeypair);
      await this.server.submitTransaction(transaction);
      
      console.log(`Added authorized issuer: ${newIssuerPublicKey}`);
    } catch (error) {
      console.error('Error adding authorized issuer:', error);
      throw error;
    }
  }

  // Create credential metadata for IPFS
  createCredentialMetadata(
    institutionName: string,
    courseName: string,
    credentialType: CredentialType,
    description: string,
    skills: string[],
    duration: string
  ): any {
    return {
      name: `${institutionName} - ${courseName}`,
      description,
      image: `ipfs://QmHashForCredentialImage`, // Would be actual IPFS hash
      attributes: [
        {
          trait_type: "Institution",
          value: institutionName
        },
        {
          trait_type: "Course",
          value: courseName
        },
        {
          trait_type: "Type",
          value: credentialType
        },
        {
          trait_type: "Skills",
          value: skills
        },
        {
          trait_type: "Duration",
          value: duration
        },
        {
          trait_type: "Issue Date",
          value: new Date().toISOString()
        }
      ],
      external_url: "https://educhain.io",
      issued_by: this.issuerKeypair.publicKey()
    };
  }
}

// Credential Marketplace using Stellar DEX
export class CredentialMarketplace {
  private server: StellarSDK.Horizon.Server;
  private networkPassphrase: string;
  private marketplaceKeypair: StellarSDK.Keypair;

  constructor(marketplaceSecret: string, isTestnet: boolean = true) {
    this.marketplaceKeypair = StellarSDK.Keypair.fromSecret(marketplaceSecret);
    this.server = isTestnet ? 
      new StellarSDK.Horizon.Server('https://horizon-testnet.stellar.org') :
      new StellarSDK.Horizon.Server('https://horizon.stellar.org');
    this.networkPassphrase = isTestnet ? 
      StellarSDK.Networks.TESTNET : 
      StellarSDK.Networks.PUBLIC;
  }

  // Create marketplace for credential verification services
  async createMarketplace(): Promise<void> {
    try {
      // Ensure marketplace account exists
      try {
        await this.server.loadAccount(this.marketplaceKeypair.publicKey());
      } catch (error) {
        if (this.networkPassphrase === StellarSDK.Networks.TESTNET) {
          await this.server.friendbot(this.marketplaceKeypair.publicKey());
        } else {
          throw new Error('Cannot create marketplace account on mainnet');
        }
      }

      console.log('Credential marketplace created');
    } catch (error) {
      console.error('Error creating marketplace:', error);
      throw error;
    }
  }

  // Create offer for credential verification
  async createVerificationOffer(
    credentialAsset: StellarSDK.Asset,
    price: string,
    verifierPublicKey: string
  ): Promise<string> {
    try {
      const marketplaceAccount = await this.server.loadAccount(this.marketplaceKeypair.publicKey());
      
      const transaction = new StellarSDK.TransactionBuilder(marketplaceAccount, {
        networkPassphrase: this.networkPassphrase,
        fee: StellarSDK.BASE_FEE
      })
        .addOperation(StellarSDK.Operation.manageSellOffer({
          selling: new StellarSDK.Asset.native(), // XLM
          buying: credentialAsset,
          amount: price,
          price: '1' // 1:1 ratio for verification
        }))
        .setTimeout(30)
        .build();

      transaction.sign(this.marketplaceKeypair);
      const result = await this.server.submitTransaction(transaction);
      
      console.log('Verification offer created');
      return result.hash;
    } catch (error) {
      console.error('Error creating verification offer:', error);
      throw error;
    }
  }
}
