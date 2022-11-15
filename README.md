# Ninja-NFT
NFT minter for VZ Ninja programm

The repository contains two parts, the first is a Hardhat project, the second a linked webapp.

Smart Contract address on Mumbai testnet:   0xa7e74aB6FD7C827cE3BCfE031C3A820fd5a513aF
Webapp address:                             https://vz-ninja-nft.web.app
Github repositary:                          https://github.com/IvanTheTrulyTerrible/NinjaNFT-project

Installation instructions:
- CD in Hardhat root folder and npm install all dependencies
- Add here a .env file containing polygon and mumbai private keys as well as alchemy endpoints, both for test and mainnet, the file should look as follows:
PRIVATE_KEY_MUMBAI=xxxx
MUMBAI_PROJECT_ID=yyyy
PRIVATE_KEY_POLYGON=zzzz
POLYGON_PROJECT_ID=uuuuu
=> now the usual hardhat options are at your disposal

- CD in frontend root folder and npm install all dependencies as well
- Add here a .env file containing pinata api keys and some other variables, the file should look as follows:
REACT_APP_PINATA_API_KEY=rrr
REACT_APP_PINATA_API_SECRET=ttt
REACT_APP_DEPLOYED_CHAIN_ID=0x13881
REACT_APP_DEPLOYED_CHAIN_ID_TEST=0x539
REACT_APP_DAPP_URL=vz-ninja-nft.web.app
REACT_APP_BACKEND_URL=https://vz-ninja-nft-default-rtdb.europe-west1.firebasedatabase.app/
=> now the frontend can be used with the usual npm options

Hardhat:
This constitutes a basic hardhat project containing a Smart Contract as well as test and deploy scripts. The targeted blockchain is Polygon, which is why the hardhat config file contains network information for Polygon mainnet and Mumbai testnet.
The Smart Contract is an extended ERC1155 contract. The idea is to create new NFT collections but containing only a single NFT per collection. The reason ERC1155 was used is the flexibility in creating multiple copies for NFTs, which ERC721 does not provide. The NFTs and corresponding metadata should correspond to current OpenSea metadata standards such that every user should be able to visualize his NFTs on the OpenSea webpage (and could theoretically sell his NFTs as well, no limitations intended in that regard), an Opensea weblink is even provided.
The Smart Contract also includes a role model. There is a creator as a backup which cannot be removed. Then there are admins who are allowed to create and mint NFTs. Further there are the "ninjas" which are only eligible to receive NFTs.
The test script adequately tests all happy and unhappy paths which are present in the Smart Contract. Basic Open Zeppelin functionality of the base ERC1155 contract from which is inherited is not tested again.
The deploy script automatically saves the contract address and Abi to a folder inside the Webapp for further use.

Webapp:
The Webapp is linked to the Smart Contract by Alchemy web endpoints. The role of the user (information provided by the Smart Contract and hence unhackable) allows for additional rights in the Webapp. Admins may open the Admin Modal which contains creating and minting functionality as well as user role management functions. The NFT image can comfortably be added via the provided drag and drop functionality. Whereas the additional Metadata attributes can be set via the provided input fields.
All Users irrespective of their role will see the mainpage which lists all NFTs of the contract.
Offline (in the sense of web3, i.e. logged out of Metamask/Brave) modus has been added by providing access to a firebase real-time database, which contains the basic information of all minted NFTs. The NFT data is saved in the database at the time of minting. The ownership information is deleted and stored again each time the page is loaded. The idea being that the page shows most of its information even when not logged on to Metamask. The main concern here is that quite a few Webapp viewers will refrain from opening their own Metamask wallet, those users would not be able to see any NFTs available.
Support for mobile versions of metamask or brave browser has been added. If a mobile device is detected, a jump via deeplink directly into Metamas mobile browser or Brave browser becomes available. This further improves user experience of the Webapp.