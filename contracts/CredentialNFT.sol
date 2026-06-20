// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CredentialNFT is ERC721, ERC721URIStorage, Ownable, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Credential types
    enum CredentialType { DEGREE, CERTIFICATE, BADGE, SKILL }
    
    // Credential structure
    struct Credential {
        uint256 tokenId;
        string institutionName;
        string courseName;
        CredentialType credentialType;
        uint256 issueDate;
        uint256 expiryDate;
        string ipfsHash;
        bool verified;
        address issuer;
        address recipient;
    }
    
    // Mappings
    mapping(uint256 => Credential) public credentials;
    mapping(address => uint256[]) public userCredentials;
    mapping(address => bool) public authorizedIssuers;
    mapping(string => bool) public usedCertificateHashes;
    
    // Events
    event CredentialIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        address indexed issuer,
        CredentialType credentialType,
        string institutionName
    );
    
    event CredentialVerified(uint256 indexed tokenId, bool verified);
    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);

    constructor() ERC721("EduLedger Credential", "EDU-CRED") {
        _tokenIds.increment();
    }

    modifier onlyAuthorizedIssuer() {
        require(
            authorizedIssuers[msg.sender] || msg.sender == owner(),
            "Not authorized to issue credentials"
        );
        _;
    }

    function issueCredential(
        address recipient,
        string memory institutionName,
        string memory courseName,
        CredentialType credentialType,
        uint256 expiryDate,
        string memory ipfsHash,
        string memory certificateHash
    ) external onlyAuthorizedIssuer whenNotPaused returns (uint256) {
        require(recipient != address(0), "Invalid recipient address");
        require(!usedCertificateHashes[certificateHash], "Certificate hash already used");
        require(bytes(institutionName).length > 0, "Institution name required");
        require(bytes(courseName).length > 0, "Course name required");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        
        uint256 tokenId = _tokenIds.current();
        
        // Create credential
        Credential memory credential = Credential({
            tokenId: tokenId,
            institutionName: institutionName,
            courseName: courseName,
            credentialType: credentialType,
            issueDate: block.timestamp,
            expiryDate: expiryDate,
            ipfsHash: ipfsHash,
            verified: false,
            issuer: msg.sender,
            recipient: recipient
        });
        
        credentials[tokenId] = credential;
        usedCertificateHashes[certificateHash] = true;
        
        // Mint NFT (soul-bound - non-transferable)
        _safeMint(recipient, tokenId);
        
        // Add to user's credentials
        userCredentials[recipient].push(tokenId);
        
        // Auto-verify for authorized issuers
        if (authorizedIssuers[msg.sender]) {
            credentials[tokenId].verified = true;
            emit CredentialVerified(tokenId, true);
        }
        
        emit CredentialIssued(
            tokenId,
            recipient,
            msg.sender,
            credentialType,
            institutionName
        );
        
        _tokenIds.increment();
        return tokenId;
    }

    function verifyCredential(uint256 tokenId) external onlyOwner {
        require(_exists(tokenId), "Credential does not exist");
        credentials[tokenId].verified = true;
        emit CredentialVerified(tokenId, true);
    }

    function revokeCredential(uint256 tokenId) external onlyOwner {
        require(_exists(tokenId), "Credential does not exist");
        _burn(tokenId);
    }

    function getUserCredentials(address user) external view returns (uint256[] memory) {
        return userCredentials[user];
    }

    function getCredential(uint256 tokenId) external view returns (Credential memory) {
        require(_exists(tokenId), "Credential does not exist");
        return credentials[tokenId];
    }

    function isCredentialValid(uint256 tokenId) external view returns (bool) {
        if (!_exists(tokenId)) return false;
        
        Credential memory credential = credentials[tokenId];
        
        // Check if expired
        if (credential.expiryDate > 0 && block.timestamp > credential.expiryDate) {
            return false;
        }
        
        return credential.verified;
    }

    function addAuthorizedIssuer(address issuer) external onlyOwner {
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }

    function removeAuthorizedIssuer(address issuer) external onlyOwner {
        authorizedIssuers[issuer] = false;
        emit IssuerRevoked(issuer);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Override transfer functions to make NFT soul-bound
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("Soul-bound: Transfer not allowed");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("Soul-bound: Transfer not allowed");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override {
        revert("Soul-bound: Transfer not allowed");
    }

    // Required overrides
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) 
        internal 
        whenNotPaused 
        override 
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}
