const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NinjaNFTNew", function () {
    let owner, addr1, addr2, addr3

  beforeEach(async() => {
    const ADMIN_NAME = "RJue";
    const NinjaNFTNew = await ethers.getContractFactory("NinjaNFTNew");
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    ninjaNFT = await NinjaNFTNew.deploy(owner.address, ADMIN_NAME);
    await ninjaNFT.deployed();
  });

  describe("Constructor", () => {
  // constructor testing
    it('should have correct main admin', async () => {
      const _mainAdmin = await ninjaNFT.creator();
      const _mainAdminName = await ninjaNFT.admins(owner.address);
      expect(_mainAdmin === owner.address);
      expect(_mainAdminName === "RJue");
      expect(ninjaNFT.adminAddr().length === 1);
      expect(ninjaNFT.adminAddr(0) === owner.address);
    });
  });

  describe("Admin, Ninja and Creator", () => {
  // admin and ninja stuff testing
    it('should add and change admins', async () => {
      await ninjaNFT.changeAdmin(addr1.address, "AVla");
      expect((await ninjaNFT.admins(addr1.address)) === "AVla");
      expect((await ninjaNFT.getAdminArrayLength()).toNumber() === 2);
      expect((await ninjaNFT.adminAddr(1)) === addr1.address);
      await ninjaNFT.changeAdmin(addr2.address, "CZb");
      expect((await ninjaNFT.admins(addr2.address)) === "CZb");
      expect((await ninjaNFT.getAdminArrayLength()).toNumber() === 3);
      expect((await ninjaNFT.adminAddr(2)) === addr2.address);
      await ninjaNFT.changeAdmin(addr2.address, "");
      expect((await ninjaNFT.admins(addr2.address)) === "");
      expect((await ninjaNFT.getAdminArrayLength()).toNumber() === 2);
      expect((await ninjaNFT.adminAddr(1)) === addr1.address);
      await expect(ninjaNFT.changeAdmin(owner.address, "RJue")).to.be.revertedWith("Creator is not removable");
    });

    it('should add and change ninjas', async () => {
      await ninjaNFT.changeNinja(addr3.address, "CKr");
      expect((await ninjaNFT.ninjas(addr3.address)) === "CKr");
      expect((await ninjaNFT.getNinjaArrayLength()).toNumber() === 1);
      expect((await ninjaNFT.ninjaAddr(0)) === addr1.address);
      await ninjaNFT.changeNinja(addr3.address, "");
      expect((await ninjaNFT.ninjas(addr3.address)) === "");
      expect((await ninjaNFT.getNinjaArrayLength()).toNumber() === 0);
    });

    it('should not change admins and ninjas', async () => {
      await expect(ninjaNFT.changeAdmin(ethers.constants.AddressZero, "CZb")).to.be.revertedWith("Address 0 not allowed");
      await expect(ninjaNFT.changeNinja(ethers.constants.AddressZero, "CZb")).to.be.revertedWith("Address 0 not allowed");
      await expect(ninjaNFT.connect(addr3).changeAdmin(addr2.address, "CZb")).to.be.revertedWith("Caller is not admin");
      await expect(ninjaNFT.connect(addr3).changeNinja(addr2.address, "CZb")).to.be.revertedWith("Caller is not admin");
    });

    it('length getters should give correct values', async () => {
      expect((await ninjaNFT.getAdminArrayLength()).toNumber() === 2);
      expect((await ninjaNFT.getNinjaArrayLength()).toNumber() === 0);
    });

    it('should change creator', async () => {
      await ninjaNFT.changeCreator(addr3.address, "CKr");
      expect(ninjaNFT.creator() === addr3.address);
      expect(ninjaNFT.admins(addr3.address) === "CKr");
    });

    it('should not change creator', async () => {
      await expect(ninjaNFT.changeCreator(ethers.constants.AddressZero, "CZb")).to.be.revertedWith("Address 0 not allowed");
      await expect(ninjaNFT.connect(addr3).changeCreator(addr2.address, "CZb")).to.be.revertedWith("Caller is not creator");
    });
  });

  describe("Uri", () => {
  // uri function testing
    it('should return correct uri', async () => {
      await ninjaNFT.createAndMintNFT("uri_token1", "name_token1", "symbol_token1", 50);
      await ninjaNFT.createAndMintNFT("uri_token2", "name_token2", "symbol_token2", 100);
      expect(ninjaNFT.uri(1) === "uri_token1");
      expect(ninjaNFT.uri(2) === "uri_token2");
    });
  });

  describe("Creation", () => {
  // testing of creating
    it('should not create NFT', async () => {
      console.log(await ninjaNFT.tokenCountToUri(3));
      await ninjaNFT.createAndMintNFT("uri_token3", "name_token3", "symbol_token3", 50);
      await expect(ninjaNFT.createAndMintNFT("uri_token3", "name_token3", "symbol_token3", 50)).to.be.revertedWith("Uri already in use");
    });

    it('should create NFT', async () => {
      await ninjaNFT.createAndMintNFT("uri_token4", "name_token4", "symbol_token4", 50);
      expect(ninjaNFT.tokenCountToUri(4) === "uri_token4");
      expect(ninjaNFT.uriToTokenCount("uri_token4") === 4);
      expect(ninjaNFT.tokenCountToTokenInfo(4).id === 4);
      expect(ninjaNFT.tokenCountToTokenInfo(4).name === "name_token4");
      expect(ninjaNFT.tokenCountToTokenInfo(4).symbol === "symbol_token4");
      expect(ninjaNFT.tokenCountToTokenInfo(4).uri === "uri_token4");
      expect(ninjaNFT.tokenCountToTokenInfo(4).quantity === 50);
      expect(ninjaNFT.balanceOf(owner.address, 4) === 50);
    });
  });

  describe("Minting", () => {
  // testing of minting
    it('should not mint NFT', async () => {
      console.log(await ninjaNFT.tokenCountToUri(5));
      await expect(ninjaNFT.mintNFT(5, 25)).to.be.revertedWith("Token id not in use");
    });

    it('should mint NFT', async () => {
      await ninjaNFT.createAndMintNFT("uri_token5", "name_token5", "symbol_token5", 50);
      await ninjaNFT.mintNFT(1, 100);
      expect(ninjaNFT.balanceOf(owner.address, 1) === 150);
    });
  });

  describe("Distributing", () => {
  // testing distributing NFTs
    it('should not distribute NFTs', async () => {
      await ninjaNFT.createAndMintNFT("uri_token1", "name_token1", "symbol_token1", 100);
      await ninjaNFT.changeNinja(addr3.address, "CKr");
      await ninjaNFT.changeNinja(addr4.address, "RSlo");
      await ninjaNFT.changeNinja(addr5.address, "MLr");
      let amounts = [5, 10];
      let accounts = ["CKr", "RSlo", "MLr"];
      await expect(ninjaNFT.batchDistributeNFTs(1, amounts, accounts)).to.be.revertedWith("Amounts and ninja length mismatch");
      accounts = ["CKr", "RPf"];
      await expect(ninjaNFT.batchDistributeNFTs(1, amounts, accounts)).to.be.revertedWith("Ninja unknown");
    });

    it('should distribute NFTs', async () => {
      await ninjaNFT.createAndMintNFT("uri_token1", "name_token1", "symbol_token1", 100);
      await ninjaNFT.changeNinja(addr4.address, "RSlo");
      await ninjaNFT.changeNinja(addr5.address, "MLr");
      let amounts = [5, 10];
      let accounts = ["RSlo", "MLr"];
      await ninjaNFT.batchDistributeNFTs(1, amounts, accounts);
      expect(ninjaNFT.balanceOf(addr4.address, 1) === 5);
      expect(ninjaNFT.balanceOf(addr5.address, 1) === 10);
    });
  });
});