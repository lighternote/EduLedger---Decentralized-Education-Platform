// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract EduToken is ERC20, Ownable, Pausable {
    mapping(address => bool) public minters;
    mapping(address => uint256) public stakedAmounts;
    mapping(address => uint256) public stakingTimestamps;
    
    uint256 public constant STAKING_REWARD_RATE = 100; // 1% per month
    uint256 public constant MONTHLY_SECONDS = 30 days;
    
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount, uint256 rewards);
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);

    constructor() ERC20("EduLedger Token", "EDU") {
        _mint(msg.sender, 1000000000 * 10**decimals()); // 1 billion initial supply
    }

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not a minter");
        _;
    }

    function mint(address to, uint256 amount) external onlyMinter whenNotPaused {
        _mint(to, amount);
    }

    function stake(uint256 amount) external whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Claim any pending rewards first
        _claimRewards(msg.sender);
        
        // Update staking records
        stakedAmounts[msg.sender] += amount;
        stakingTimestamps[msg.sender] = block.timestamp;
        
        emit TokensStaked(msg.sender, amount);
    }

    function unstake(uint256 amount) external whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(stakedAmounts[msg.sender] >= amount, "Insufficient staked amount");
        
        // Claim rewards first
        uint256 rewards = _calculateRewards(msg.sender);
        _claimRewards(msg.sender);
        
        // Update staking records
        stakedAmounts[msg.sender] -= amount;
        
        // Transfer back staked tokens
        _transfer(address(this), msg.sender, amount);
        
        emit TokensUnstaked(msg.sender, amount, rewards);
    }

    function claimRewards() external whenNotPaused {
        _claimRewards(msg.sender);
    }

    function _claimRewards(address user) internal {
        uint256 rewards = _calculateRewards(user);
        if (rewards > 0) {
            stakingTimestamps[user] = block.timestamp;
            _mint(address(this), rewards);
            _transfer(address(this), user, rewards);
        }
    }

    function _calculateRewards(address user) internal view returns (uint256) {
        if (stakedAmounts[user] == 0) return 0;
        
        uint256 timeStaked = block.timestamp - stakingTimestamps[user];
        uint256 monthsStaked = timeStaked / MONTHLY_SECONDS;
        
        return (stakedAmounts[user] * monthsStaked * STAKING_REWARD_RATE) / 10000;
    }

    function getStakedAmount(address user) external view returns (uint256) {
        return stakedAmounts[user];
    }

    function getPendingRewards(address user) external view returns (uint256) {
        return _calculateRewards(user);
    }

    function addMinter(address minter) external onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) 
        internal 
        whenNotPaused 
        override 
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
