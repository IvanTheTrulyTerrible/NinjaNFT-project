import React, { useContext, useState, useEffect } from 'react';
import { Web3Context } from '../Context/web3-context';
import styled from "styled-components";
import { NFTAdminModal } from './NFTAdminModal';

function Navbar({ user }) {

    const [showAdminModal, setShowAdminModal] = useState(false)

    const { chainId, currentAccount, ninjaNFTContract, isAdmin, isNinja, nfts, setNfts, errorPage, switchNetwork, connectWallet,
      tokenID, setTokenID, contractAddress, currentShortName, maticBalance, maticContractBalance, isMobile, isMetamaskBrowser, metamaskDeeplink, isBraveBrowser, braveDeeplink } = useContext(Web3Context)

    useEffect(() => {
      console.log(isMobile, isMetamaskBrowser, metamaskDeeplink, isBraveBrowser, braveDeeplink)
    }, [isMobile, isMetamaskBrowser, metamaskDeeplink, isBraveBrowser, braveDeeplink])

    function toggleAdminModal() {
      if (isAdmin) {
          setShowAdminModal(!showAdminModal)
      }
    }

    const openAppInMetamaskBrowser = async () => {
      window.open(metamaskDeeplink);
    }

    const openAppInBraveBrowser = async () => {
      window.open(braveDeeplink);
    }

    return (
        <div>
            <ModalGrid>
                <div>
                    <h2>VZ Ninja NFT</h2>
                </div>
                <div>
                    {currentShortName && <h3>Welcome dear {currentShortName}</h3>
                    }
                    {isAdmin && <h3>worthy Admin</h3>
                    }
                    {isNinja && <h3>worthy Ninja</h3>
                    }
                    {isNinja && <h5>Admire your rightful and prestitious NFT badges</h5>
                    }
                </div>
                <div>
                    {/*}
                    {chainId !== "" && <h3>Chain ID: {chainId}</h3>
                    }
                    {contractAddress !== "" && <h3>Contract Address: {contractAddress}</h3>
                    }*/}
                    {currentAccount !== "" && currentAccount && <h5>Account address: {currentAccount.substring(0, 4) + "..." + currentAccount.substring(currentAccount.length-4, currentAccount.length)}</h5>
                    }
                    {maticBalance && <h5>MATIC balance: {Math.round(maticBalance*10000)/10000}</h5>
                    }
                    {/*
                    {contractAddress !== "" && <h5>Smart Contract address: {contractAddress.substring(0, 4) + "..." + contractAddress.substring(contractAddress.length-4, contractAddress.length)}</h5>
                    }
                    {maticContractBalance && <h5>MATIC balance Contract: {Math.round(maticContractBalance*10000)/10000}</h5>
                    }
                    */}
                    {isAdmin && currentAccount !== "" && currentAccount && <ModalButton onClick={() => toggleAdminModal()} >Admin View</ModalButton>
                    }
                    {currentAccount === "" && isMetamaskBrowser && isMobile && <ConnectButton onClick={connectWallet}>Connect</ConnectButton>
                    }
                    {currentAccount === "" && isBraveBrowser && isMobile && <ConnectButton onClick={connectWallet}>Connect</ConnectButton>
                    }
                    {currentAccount === "" && isMobile === false && <ConnectButton onClick={connectWallet}>Connect</ConnectButton>
                    }
                    {currentAccount === "" && isMobile && isMetamaskBrowser === false && <ConnectButton onClick={openAppInMetamaskBrowser}>Open App in Metamask Browser</ConnectButton>
                    }
                    {currentAccount === "" && isMobile && isBraveBrowser === false && <ConnectButton onClick={openAppInBraveBrowser}>Open App in Brave Browser</ConnectButton>
                    }
                </div>
            </ModalGrid>
            {
                showAdminModal &&
                <NFTAdminModal
                    toggleAdminModal={() => toggleAdminModal()}
                />
            }
        </div>
    )
}

const ModalGrid = styled.div`
  display: inline-grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 40px;
  @media(max-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media(max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media(max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const ModalButton = styled.span`
  background-color: Blue;  
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
`

const ConnectButton = styled.span`
  background-color: Red;  
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
`

export default Navbar