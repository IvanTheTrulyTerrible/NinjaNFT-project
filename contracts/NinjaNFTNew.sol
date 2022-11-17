// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract NinjaNFTNew is ERC1155 {

    //admin stuff
    address public creator;
    mapping(address => string) public admins;
    address[] public adminAddr;
    mapping(address => string) public ninjas;
    mapping(string => address) public ninjasToAddress;
    address[] public ninjaAddr;

    string constant internal baseUri = "https://gateway.pinata.cloud/ipfs/";
    string public name;
    string public symbol;
    uint public tokenCount;
    mapping(uint => string) public tokenCountToUri;
    mapping(string => uint) public uriToTokenCount;
    mapping(uint => TokenInfo) public tokenCountToTokenInfo;

    struct TokenInfo{
        uint id;            // token index in array
        string name;        // token name
        string uri;         // token metadata uri
        uint quantity;      // number minted token
    }

    constructor(string memory _name, string memory _symbol, address _creator, string memory _creatorName) ERC1155(baseUri) {
        name = _name;
        symbol = _symbol;
        creator = _creator;
        admins[creator] = _creatorName;
        adminAddr.push(_creator);
        tokenCount = 0;
    }

    modifier onlyAdmin() {
        require(bytes(admins[msg.sender]).length != 0, "Caller is not admin");
        _;
    }

    event CreateNFT(uint indexed count, string uri, string name);
    event ChangeAdmin(address indexed admin, string indexed adminName);
    event ChangeNinja(address indexed admin, string indexed adminName);

    function createAndMintNFT(string memory _uri, string memory _name, uint _amount) public onlyAdmin {
        require(uriToTokenCount[_uri] == 0, "Uri already in use");
        tokenCount += 1;
        tokenCountToUri[tokenCount] = _uri;
        uriToTokenCount[_uri] = tokenCount;
        tokenCountToTokenInfo[tokenCount].id = tokenCount;
        tokenCountToTokenInfo[tokenCount].name = _name;
        tokenCountToTokenInfo[tokenCount].uri = _uri;
        tokenCountToTokenInfo[tokenCount].quantity = _amount;
        console.log(
            "Creating and minting NFT %s with Uri %s for %s token",
            tokenCount,
            tokenCountToTokenInfo[tokenCount].uri,
            tokenCountToTokenInfo[tokenCount].quantity
        );   //hardhat testing
        emit CreateNFT(tokenCount, _uri, _name);
        _mint(msg.sender, tokenCount, _amount, "");
    }

    function mintNFT(uint _count, uint _amount) public onlyAdmin {
        require(keccak256(abi.encode(tokenCountToUri[_count])) != keccak256(abi.encode("")), "Token id not in use");
        //require(keccak256(abi.encodePacked(tokenCountToUri[_count])) != keccak256(abi.encodePacked("")), "Token id not in use");
        tokenCountToTokenInfo[_count].quantity += _amount;
        console.log(
            "Minting NFT %s with Uri %s for %s token",
            _count,
            tokenCountToTokenInfo[_count].uri,
            _amount
        );   //hardhat testing
        _mint(msg.sender, _count, _amount, "");
    }

    function batchDistributeNFTs(
        uint count,
        uint[] memory amounts,
        string[] memory ninjaNames
    ) public onlyAdmin {
        require(amounts.length == ninjaNames.length, "Amounts and ninja length mismatch");
        console.log(
            "Distributing NFT %s",
            count
        );   //hardhat testing
        for (uint i = 0; i < amounts.length; ++i) {
            require(ninjasToAddress[ninjaNames[i]] != address(0), "Ninja unknown");
            _safeTransferFrom(msg.sender, ninjasToAddress[ninjaNames[i]], count, amounts[i], "");
        }
    }

    function uri(uint256 _count) public override view returns(string memory) {
        console.log(
            "Calling Uri function for uri %s",
            tokenCountToTokenInfo[_count].uri
        );   //hardhat testing
        return tokenCountToTokenInfo[_count].uri;
    }

    /* Override isApprovedForAll to auto-approve OS's proxy contract*/
    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns(bool isOperator) {
            // for Polygon Mainnet: OpenSea proxy Contract Address
       if (_operator == address(0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101)) {
            return true;
        } else if (_operator == address(0x53d791f18155C211FF8b58671d0f7E9b50E596ad)) {
            // Polygon Mumbai testnet: OpenSea proxy Contract Address
            return true;
        } else {
            return ERC1155.isApprovedForAll(_owner, _operator);
        }
    }

    function changeAdmin(address admin, string memory adminName) public onlyAdmin {
        require(admin != creator, "Creator is not removable");
        require(admin != address(0), "Address 0 not allowed");
        require(keccak256(abi.encode(admins[admin])) != keccak256(abi.encode(adminName)), "Data unchanged");
        if (keccak256(abi.encode(admins[admin])) != keccak256(abi.encode(""))) {
            _removeAdmin(admin);
            admins[admin] = adminName;
        } else {
            admins[admin] = adminName;
            adminAddr.push(admin);
        }
        console.log(
            "Change Admin function for address %s and name %s",
            admin,
            admins[admin]
        );   //hardhat testing
        emit ChangeAdmin(admin, adminName);
    }

    function _removeAdmin(address adminOld) internal {
        uint toDelete;
        for (uint i = 0; i < adminAddr.length; i++){
            if(adminAddr[i] == adminOld) {
                toDelete = i;
                break;
            }
        }
        address lastIndex = adminAddr[adminAddr.length-1];
        adminAddr[toDelete] = lastIndex;
        adminAddr.pop();
    }

    function isAdmin(address admin) public view returns(bool) {
        if (keccak256(abi.encodePacked(admins[admin])) == keccak256(abi.encodePacked(""))) {
            return false;
        } else {
            return true;
        }
    }

    function getAdminArrayLength() external view returns(uint) {
        return adminAddr.length;
    }

    function changeNinja(address ninja, string memory ninjaName) public onlyAdmin {
        require(ninja != address(0), "Address 0 not allowed");
        require(keccak256(abi.encode(ninjas[ninja])) != keccak256(abi.encode(ninjaName)), "Data unchanged");
        if (keccak256(abi.encode(ninjas[ninja])) != keccak256(abi.encode(""))) {
            _removeNinja(ninja);
            ninjas[ninja] = ninjaName;
            ninjasToAddress[ninjaName] = ninja;
        } else {
            ninjas[ninja] = ninjaName;
            ninjasToAddress[ninjaName] = ninja;
            ninjaAddr.push(ninja);
        }
        emit ChangeNinja(ninja, ninjaName);
    }

    function _removeNinja(address ninjaOld) internal {
        uint toDelete;
        for (uint i = 0; i < ninjaAddr.length; i++){
            if(ninjaAddr[i] == ninjaOld) {
                toDelete = i;
                break;
            }
        }
        address lastIndex = ninjaAddr[ninjaAddr.length-1];
        ninjaAddr[toDelete] = lastIndex;
        ninjaAddr.pop();
    }

    function isNinja(address ninja) public view returns(bool) {
        if (keccak256(abi.encodePacked(ninjas[ninja])) == keccak256(abi.encodePacked(""))) {
            return false;
        } else {
            return true;
        }
    }

    function getNinjaArrayLength() external view returns(uint) {
        return ninjaAddr.length;
    }

    function changeCreator(address newCreator, string memory newCreatorName) public {
        require(newCreator != address(0), "Address 0 not allowed");
        require(creator == msg.sender, "Caller is not creator");
        creator = newCreator;
        admins[creator] = newCreatorName;
    }
}