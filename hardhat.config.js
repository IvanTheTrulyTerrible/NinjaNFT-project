require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  settings: {
    optimizer: {
        enabled: true,
        runs: 1000000,
    },
  },
  mocha: {
    timeout: 90000
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    	  chainId: 1337
    },
    mumbai: {
        url: process.env.MUMBAI_PROJECT_ID,
        chainId: 80001,
        accounts: [`0x` + process.env.PRIVATE_KEY_MUMBAI],
        gasPrice: 8000000000
    },
    polygon: {
        url: process.env.POLYGON_PROJECT_ID,
        chainId: 137,
        accounts: [`0x` + process.env.PRIVATE_KEY_POLYGON],
        gasPrice: 8000000000
    }
  }
};