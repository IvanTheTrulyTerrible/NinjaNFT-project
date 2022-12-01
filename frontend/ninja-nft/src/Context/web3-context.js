import { useEffect, useState, createContext, useCallback } from 'react';
import { ethers } from "ethers";
import abi from "../Abi/NinjaNFT.json";
import contract_json from "../Abi/contract-address.json";
import Swal from 'sweetalert2';
const axios = require('axios');

export const Web3Context = createContext()

export const Web3Provider = ({ children }) => {

    let initialNfts =
    [
      { name: "VZ Ninja 2022", copies: 5, tokenCount: 1, image: "https://via.placeholder.com/150" },
      { name: "VZ Ninja 2023", copies: 10, tokenCount: 2, image: "https://via.placeholder.com/150" },
      { name: "VZ Silver Ninja 2022", copies: 5, tokenCount: 3, image: "https://via.placeholder.com/150" },
      { name: "VZ Silver Ninja 2023", copies: 1, tokenCount: 4, image: "https://via.placeholder.com/150" },
      { name: "VZ Gold Ninja 2022", copies: 2, tokenCount: 5, image: "https://via.placeholder.com/150" },
      { name: "VZ Gold Ninja 2023", copies: 1, tokenCount: 6, image: "https://via.placeholder.com/150" },
      { name: "VZ Diamond Ninja 2022", copies: 1, tokenCount: 7, image: "https://via.placeholder.com/150" },
      { name: "VZ Diamond Ninja 2023", copies: 1, tokenCount: 8, image: "https://via.placeholder.com/150" }
    ]

    let initialOwnNfts =
    [
      { name: "VZ Ninja 2022", copies: 5, tokenCount: 1, image: "https://via.placeholder.com/150" },
      { name: "VZ Ninja 2023", copies: 10, tokenCount: 2, image: "https://via.placeholder.com/150" }
    ]

    let initialAdmins =
    [
      { addr: "0x04c1e3a36C4b8eB4B2F485Aa534E133Ff6eF8281", name: "RJue" },
      { addr: "0x721a14e621C3D3b53B2ef32bCe774B8ccD16410c", name: "RSlo" }
    ]

    let initialNinjas =
    [
      { addr: "0x03a2fB9F90ceF00981D2852e869b907ca0eBB577", name: "CZb" },
      { addr: "0xF50FF42e671fAC83251914bbbcAc3044a2fFc2b4", name: "CKr" }
    ]

    let initialOwnedNfts =
    [
        [
            { name: "CZb", quantity: 2 }, { name: "CKr", quantity: 5 }
        ],
        [
            { name: "CZb", quantity: 1 }, { name: "CKr", quantity: 1 }
        ]
    ]

    const [isMobile, setIsMobile] = useState(false);
    const [isMetamaskBrowser, setIsMetamaskBrowser] = useState(false);
    const [metamaskDeeplink, setMetamaskDeeplink] = useState("");
    const [isBraveBrowser, setIsBraveBrowser] = useState(false);
    const [braveDeeplink, setBraveDeeplink] = useState("");

    const [nftOwnerList, setNFTOwnerList] = useState([]);

    const [chainId, setChainId] = useState("");
    const [currentAccount, setCurrentAccount] = useState("");
    const [currentShortName, setCurrentShortName] = useState("");
    const [ninjaNFTContract, setNinjaNFTContract] = useState("");
    const [ethersProvider, setEthersProvider] = useState("");
    const [maticBalance, setMaticBalance] = useState("");
    const [maticContractBalance, setMaticContractBalance] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isNinja, setIsNinja] = useState(false);
    const [nfts, setNfts] = useState(initialNfts);
    const [ownNfts, setOwnNfts] = useState(initialOwnNfts);

    const [adminList, setAdminList] = useState([]);
    const [ninjaList, setNinjaList] = useState([]);

    const [tokenID, setTokenID] = useState(-1);

    const contractAddress = contract_json.NinjaNFT
    const contractABI = abi.abi;
    const { ethereum } = window;

    useEffect(() => {
        if (!ethereum || !ninjaNFTContract || !currentAccount) {
            getInitialNFTs();
            getInitialNFTOwners();
        }

        return () => {
            // ethereum.removeListener('accountsChanged');
        }
    }, [ethereum, ninjaNFTContract, currentAccount])

    useEffect(() => {
        console.log(isMobile, isMetamaskBrowser, metamaskDeeplink, isBraveBrowser, braveDeeplink)

        return () => {
            // ethereum.removeListener('accountsChanged');
        }
    }, [isMobile, isMetamaskBrowser, metamaskDeeplink, isBraveBrowser, braveDeeplink])

    useEffect(() => {
        const getContract = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(ethereum);
                setEthersProvider(provider);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, contractABI, signer);
                
                console.log("contract found at ", contractAddress);
                await setNinjaNFTContract(contract);
            } catch (error) {
                console.log("no contract found");
            }
        }

        const checkMobile = async () => {
            const metamaskAppDeepLink = "//metamask.app.link/dapp/" + `${process.env.REACT_APP_DAPP_URL}`;
            await setMetamaskDeeplink(metamaskAppDeepLink);
            const braveAppDeepLink = "brave://open-url?url=" + `${process.env.REACT_APP_DAPP_URL}`;
            await setBraveDeeplink(braveAppDeepLink);
            //console.log("metamaskDeeplink", metamaskDeeplink)

            const isMobile = window.matchMedia("only screen and (max-width: 760px)");
            const isMobile2 = /(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android|iemobile|w3c|acs\-|alav|alca|amoi|audi|avan|benq|bird|blac|blaz|brew|cell|cldc|cmd\-|dang|doco|eric|hipt|inno|ipaq|java|jigs|kddi|keji|leno|lg\-c|lg\-d|lg\-g|lge\-|maui|maxo|midp|mits|mmef|mobi|mot\-|moto|mwbp|nec\-|newt|noki|palm|pana|pant|phil|play|port|prox|qwap|sage|sams|sany|sch\-|sec\-|send|seri|sgh\-|shar|sie\-|siem|smal|smar|sony|sph\-|symb|t\-mo|teli|tim\-|tosh|tsm\-|upg1|upsi|vk\-v|voda|wap\-|wapa|wapi|wapp|wapr|webc|winw|winw|xda|xda\-) /i.test(navigator.userAgent);
            if (isMobile.matches || isMobile2) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }

            const metamaskIsInstalled = navigator.userAgent.indexOf("MetaMaskMobile") > -1;
            if (metamaskIsInstalled) {
                setIsMetamaskBrowser(true);
            } else {
                setIsMetamaskBrowser(false);
            }

            const braveIsInstalled = navigator.userAgent.indexOf("brave") > -1;
            if (braveIsInstalled) {
                setIsBraveBrowser(true);
            } else {
                setIsBraveBrowser(false);
            }
        }

        if (ethereum) 
            getContract();
            checkMobile();
        if (ninjaNFTContract) 
            getAdmins();
            getNinjas();
    }, [ethereum, contractABI])

    useEffect(() => {
        const checkIfAdmin = async () => {
            try {
                await chainId;
                console.log("got here here here", chainId, "haha here", `${process.env.REACT_APP_DEPLOYED_CHAIN_ID}`);
                if (window.ethereum && ninjaNFTContract && currentAccount && chainId === `${process.env.REACT_APP_DEPLOYED_CHAIN_ID}`) {
                    console.log("got here here here", chainId, `${process.env.REACT_APP_DEPLOYED_CHAIN_ID}`);
                    let adm = await ninjaNFTContract.isAdmin(currentAccount);
                    setIsAdmin(adm);
                    let nin = await ninjaNFTContract.isNinja(currentAccount);
                    setIsNinja(nin);
                    let shortName;
                    if (adm) {
                        shortName = await ninjaNFTContract.admins(currentAccount);
                    } else if (nin) {
                        shortName = await ninjaNFTContract.ninjas(currentAccount);
                    }
                    setCurrentShortName(shortName);
                } else {
                    console.log("no metamask wallet")};
            } catch (error) {
                console.log(error);
            }
        }

        if (currentAccount) {
            checkIfAdmin();
            getNfts();
            getOwnNfts();
            getMaticBalance();
            //getAdmins();
            //getNinjas();
        }
    }, [ninjaNFTContract, currentAccount, chainId])

    useEffect(() => {
        if (ethereum) {
            ethereum.on("accountsChanged", (accounts) => {
                setCurrentAccount(accounts[0]);
                getMaticBalance();
            })
        } else {
            console.log("No metamask!");
        }

        return () => {
            // ethereum.removeListener('accountsChanged');
        }
    }, [ethereum])

    useEffect(() => {
        if (ninjaNFTContract) {
            getAdmins();
            getNinjas();
            getNFTOwners();
        }
    }, [ninjaNFTContract])

    /*
    useEffect(() => {
        const provider = new ethers.providers.WebSocketProvider(`${process.env.REACT_APP_ALCHEMY_MUMBAI_WS}`, 80001);
        //const provider = new ethers.providers.WebSocketProvider(`${process.env.REACT_APP_ALCHEMY_POLYGON_WS}`, 137);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        if (contract) {
            // listening to events
            contract.on("CreateNFT", (count, uri, name, symbol, event) => {
                console.log("event: ", (count).toNumber, uri, name, symbol, event);
                setTimeout(() => {
                    getNfts();
                    getOwnNfts();
                    getMaticBalance();
                }, 5000)
            });
            contract.on("ChangeAdmin", (address, admin, event) => {
                console.log("event: ", address, admin, event);
                setTimeout(() => {getAdmins();}, 5000)
            });
            contract.on("ChangeNinja", (address, ninja, event) => {
                console.log("event: ", address, ninja, event);
                setTimeout(() => {getNinjas();}, 5000)
            });
            contract.on("TransferSingle", (from, to, value, event) => {
                console.log("event: ", event);
                setTimeout(() => {
                    getNfts();
                    getOwnNfts();
                    getMaticBalance();
                }, 5000)
            });
            contract.on("TransferBatch", (from, to, value, event) => {
                console.log("event: ", event);
                setTimeout(() => {
                    getNfts();
                    getOwnNfts();
                    getMaticBalance();
                }, 5000)
            });
        } else {
            console.log("No contract!")
        }
        console.log("contract listener count:", contract.listenerCount())

        return () => {
            // contract.removeAllListeners();
        }
    }, [ninjaNFTContract])*/

    useEffect(() => {
        const checkIfWalletIsConnected = async () => {
            try {
                if (!ethereum) {
                    console.log("Metamask not found")
                    /*Swal.fire({
                        title: 'Metamask',
                        text: 'No Metamask found, please install Metamask!',
                        icon: 'error',
                        showCancelButton: true
                    })*/
                    return;
                } else {
                    console.log("we have etherium object")
                }

                const accounts = await ethereum.request({ method: "eth_accounts" });  //check if there are accounts connected to the site

                if (accounts.length !== 0) {
                    const account = accounts[0];
                    console.log("Found an authorized account:", account);
                    setCurrentAccount(account);
                    if (ethersProvider !== "") {
                        getMaticBalance(account)
                    }
                } else {
                    setCurrentAccount("")
                    console.log("No authorized accounts found!");
                }

                const curr_chainId = await ethereum.request({ method: 'eth_chainId' });
                setChainId(curr_chainId)

                ethereum.on('chainChanged', handleChainChanged);
                // Reload the page when they change networks
                function handleChainChanged(_chainId) {
                    window.location.reload();
                }

            } catch (error) {
                console.log(error);
            }
        }

        checkIfWalletIsConnected();
    }, [currentAccount, contractABI, ethereum])

    const connectWallet = async () => {
        try {
            if (!ethereum) {
                Swal.fire({
                    title: 'Metamask',
                    text: 'No Metamask found, please install Metamask!',
                    icon: 'error',
                    showCancelButton: false
                })
                return;
            } else {
                const accounts = await ethereum.request({ method: "eth_requestAccounts" }); // request connection with accounts
                console.log("Connected", accounts[0]);
                setCurrentAccount(accounts[0]);
                getMaticBalance(accounts[0]);
                // const chainId = await ethereum.request({ method: 'eth_chainId' });
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    const switchNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `${process.env.REACT_APP_DEPLOYED_CHAIN_ID}` }], // Check networks.js for hexadecimal network ids
            });

        } catch (error) {
            console.log(error);
        }
    }

    const getMetadataFromIpfs = async (tokenURI) => {
        let metadata = await axios.get(tokenURI)
        return metadata.data
    }

    const getInitialNFTs = async () => {
        let backend_url = `${process.env.REACT_APP_BACKEND_URL}` + "initialNfts.json"
        let nftData = await axios.get(backend_url)
        const loadedNfts = []
        for (const key in nftData.data) {
            loadedNfts.push({
                description: nftData.data[key].description,
                image: nftData.data[key].image,
                name: nftData.data[key].name,
                attributes: nftData.data[key].attributes,
                tokenCount: nftData.data[key].tokenCount,
                quantity: nftData.data[key].quantity,
                copies: nftData.data[key].copies
            });
        }
        setNfts(loadedNfts);
        setOwnNfts([]);
    }

    const getInitialNFTOwners = async () => {
        let backend_url = `${process.env.REACT_APP_BACKEND_URL}` + "initialNftOwners.json"
        let nftData = await axios.get(backend_url)
        const loadedNftOwners = []
        for (const key in nftData.data) {
            var dataObject = nftData.data[key].tempArray
            break
        }
        for (let i = 0; i < dataObject.length; i++) {
            loadedNftOwners.push(dataObject[i])
        }
        setNFTOwnerList(loadedNftOwners)
    }

    const getNfts = async () => {
        try {
            let numberOfNfts = (await ninjaNFTContract.tokenCount()).toNumber()
            if (numberOfNfts === 0) {
                setNfts(initialNfts)
            } else {
                let accounts = Array(numberOfNfts).fill(currentAccount)
                let ids = Array.from({length: numberOfNfts}, (_, i) => i + 1)
                let copies = await ninjaNFTContract.balanceOfBatch(accounts, ids)

                let tempArray = []
            
                for (let i = 1; i <= numberOfNfts; i++) {
                    let tokenURI = await ninjaNFTContract.uri(i)
                    let metadata = await getMetadataFromIpfs(tokenURI)
                    let nftStruct = await ninjaNFTContract.tokenCountToTokenInfo(i)
                    metadata.copies = copies[i - 1]
                    metadata.tokenCount = (nftStruct.id).toNumber()
                    metadata.quantity = (nftStruct.quantity).toNumber()
                    tempArray.push(metadata)
                }
                setNfts(tempArray)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getOwnNfts = async () => {
        try {
            let numberOfNfts = (await ninjaNFTContract.tokenCount()).toNumber()
            if (numberOfNfts === 0) {
                setNfts(initialNfts)
            } else {
                let accounts = Array(numberOfNfts).fill(currentAccount)
                let ids = Array.from({length: numberOfNfts}, (_, i) => i + 1)
                let copies = await ninjaNFTContract.balanceOfBatch(accounts, ids)

                let tempArray = []
            
                for (let i = 1; i <= numberOfNfts; i++) {
                    if (copies[i - 1] > 0) {
                        let tokenURI = await ninjaNFTContract.uri(i)
                        let metadata = await getMetadataFromIpfs(tokenURI)
                        let nftStruct = await ninjaNFTContract.tokenCountToTokenInfo(i)
                        metadata.copies = copies[i - 1]
                        metadata.tokenCount = (nftStruct.id).toNumber()
                        metadata.quantity = (nftStruct.quantity).toNumber()
                        tempArray.push(metadata)
                    }
                }
                setOwnNfts(tempArray)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getMaticBalance = async (account) => {
        if (ethersProvider) {
            if (account) {
                try {
                    const balance = ethers.utils.formatEther(await ethersProvider.getBalance(account))
                    setMaticBalance(balance);
                } catch (error) {
                    console.log(error);
                }
            }
            if (ninjaNFTContract) {
                try {
                    const contractBalance = ethers.utils.formatEther(await ethersProvider.getBalance(contractAddress))
                    setMaticContractBalance(contractBalance);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    const getAdmins = async () => {
        try {
            let numberOfAdmins = (await ninjaNFTContract.getAdminArrayLength()).toNumber()
            console.log("numberOfAdmins", numberOfAdmins)
            let tempArray = []
            let metadata = {}
            for (let i = 0; i < numberOfAdmins; i++) {
                metadata = {}
                let adminAddr = await ninjaNFTContract.adminAddr(i)
                let adminName = await ninjaNFTContract.admins(adminAddr)
                metadata.addr = adminAddr
                metadata.name = adminName
                tempArray.push(metadata)
            }
            setAdminList(tempArray)
        } catch (error) {
            console.log(error);
        }
    }

    const getNinjas = async () => {
        if (ninjaNFTContract) {
            try {
                //let numberOfAdmins = (await ninjaNFTContract.getAdminArrayLength()).toNumber()
                let numberOfNinjas = (await ninjaNFTContract.getNinjaArrayLength()).toNumber()
                console.log("numberOfNinjas", numberOfNinjas)
                let tempArray = []
                let metadata = {}
                for (let i = 0; i < numberOfNinjas; i++) {
                    metadata = {}
                    let ninjaAddr = await ninjaNFTContract.ninjaAddr(i)
                    let ninjaName = await ninjaNFTContract.ninjas(ninjaAddr)
                    metadata.addr = ninjaAddr
                    metadata.name = ninjaName
                    tempArray.push(metadata)
                }
                setNinjaList(tempArray)
            } catch (error) {
                console.log(error);
            }
        }
    }

    const getNFTOwners = async () => {
        if (ninjaNFTContract) {
            try {
                let numberOfNinjas = (await ninjaNFTContract.getNinjaArrayLength()).toNumber()
                let ninjaArray = []
                let tempArray = []
                let tempSecondArray = []
                let metadata = {}

                for (let i = 0; i < numberOfNinjas; i++) {
                    let currentNinjaAddress = await ninjaNFTContract.ninjaAddr(i)
                    ninjaArray.push(currentNinjaAddress)
                }

                let numberOfNfts = (await ninjaNFTContract.tokenCount()).toNumber()
                if (numberOfNfts === 0) {
                    setNFTOwnerList(initialOwnedNfts)
                } else {
                    for (let i = 0; i < numberOfNfts; i++) {
                        tempSecondArray = []
                        let nftId = Array(numberOfNinjas).fill(i + 1)
                        let copies = await ninjaNFTContract.balanceOfBatch(ninjaArray, nftId)
                        for (let j = 0; j < numberOfNinjas; j++) {
                            metadata = {}
                            let ninjaName = await ninjaNFTContract.ninjas(ninjaArray[j])
                            metadata.name = ninjaName
                            metadata.quantity = (copies[j]).toNumber()
                            tempSecondArray.push(metadata)
                        }
                        tempArray.push(tempSecondArray)
                    }
                }
                setNFTOwnerList(tempArray)
                
                try {
                    const responseDel = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}` + "initialNftOwners.json");
                    const responsePost = await axios.post(`${process.env.REACT_APP_BACKEND_URL}` + "initialNftOwners.json", {
                        tempArray
                    });
                  } catch (error) {
                    console.log("JSON to Firebase:", error)
                  }

            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <Web3Context.Provider
            value={{
                chainId, currentAccount, ninjaNFTContract, isAdmin, isNinja, nfts, ownNfts, setNfts, switchNetwork, connectWallet,
                tokenID, setTokenID, contractAddress, currentShortName, maticBalance, maticContractBalance, adminList, ninjaList,
                getAdmins, getNinjas, getNfts, getOwnNfts, getMaticBalance, isMobile, isMetamaskBrowser, metamaskDeeplink, nftOwnerList,
                isBraveBrowser, braveDeeplink
            }}
        >
            {children}
        </Web3Context.Provider>
    )
}