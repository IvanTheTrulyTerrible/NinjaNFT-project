//const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const TEST_MODE = false;
  const ADMIN_NAME = "RJue";
  const signers = await ethers.getSigners();
  signer = signers[0].address;

  const NinjaNFTNew = await ethers.getContractFactory("NinjaNFTNew");
  const ninjaNFT = await NinjaNFTNew.deploy(signer, ADMIN_NAME);
  await ninjaNFT.deployed();
  
  console.log("Contract address:", ninjaNFT.address);

  // test stuff
  if (TEST_MODE) {
    console.log("test mode");
    createMockData(ninjaNFT, signers);
  }

  saveFrontendFiles(ninjaNFT);
}

function saveFrontendFiles(contract) {
  try {
    const dir = __dirname + "/../frontend/ninja-nft/src/Abi/";
    console.log("Directory:", dir);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.writeFileSync(
      dir + "/contract-address.json",
      JSON.stringify({ NinjaNFT: contract.address }, undefined, 2)
    );

    const NinjaArtifact = hre.artifacts.readArtifactSync("NinjaNFTNew");

    fs.writeFileSync(
      dir + "/NinjaNFT.json",
      JSON.stringify(NinjaArtifact, null, 2))
  } catch (e) {
    console.log(`e`, e)
  }
}

async function createMockData(contract, accounts) {
  console.log("function createMockData");
  // get some admins and ninjas
  await Promise.all([
    contract.changeAdmin(accounts[1].address, "CKr"),
    contract.changeAdmin(accounts[2].address, "MLr"),
    contract.changeNinja(accounts[3].address, "CZb"),
    contract.changeNinja(accounts[4].address, "NFlu"),
    contract.changeNinja(accounts[5].address, "AVla"),
    contract.changeNinja(accounts[6].address, "SMet")
  ]);

  // get some nfts
  await Promise.all([
    contract.createAndMintNFT("https://gateway.pinata.cloud/ipfs/QmZiHQmofVbnw1yT99fqkz2mAc7F8Y9pPU7wkYe53Tu67M", "aaa", "sss", 50),
    contract.mintNFT(1, 100)
  ]);

  let amounts1 = [5, 25];
  let amounts2 = [1, 5];
  let accounts1 = ["CZb", "NFlu"];
  let accounts2 = [accounts[5].address, accounts[6].address];

  await Promise.all([
    contract.batchDistributeNFTs(1, amounts1, accounts1),
    //contract.mintNFT(2, amounts2, accounts2)
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});