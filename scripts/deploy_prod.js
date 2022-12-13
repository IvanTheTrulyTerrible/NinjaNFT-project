//const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const COLLECTION_NAME = "VZ NFT Collection";
  const COLLECTION_SYMBOL = "VZNFT";
  const ADMIN_NAME = "Adm_RJue";
  const signers = await ethers.getSigners();
  const signer = signers[0].address;

  const NinjaNFTNew = await ethers.getContractFactory("NinjaNFTNew");
  const ninjaNFT = await NinjaNFTNew.deploy(COLLECTION_NAME, COLLECTION_SYMBOL, signer, ADMIN_NAME);
  await ninjaNFT.deployed();
  
  console.log("Contract address:", ninjaNFT.address);

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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
