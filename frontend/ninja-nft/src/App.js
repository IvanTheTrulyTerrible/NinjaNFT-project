import styled from 'styled-components';
import { NFTCard, NftPhoto } from './Components/NFTCard';
import { useState, useEffect } from "react";
import { NFTModal } from './Components/NFTModal';
import { useContext } from "react";
import { Web3Context } from "./Context/web3-context";
import Navbar from './Components/Navbar';

function App() {

  const { isAdmin, nfts, ownNfts, nftOwnerList } = useContext(Web3Context)

  const [showModal, setShowModal] = useState(false)
  const [selectedNft, setSelectedNft] = useState()
  const [selectedNftOwners, setSelectedNftOwners] = useState()
  const [ownerFilter, setOwnerFilter] = useState(false)

  function toggleModal(i) {
    if (i >= 0) {
      setSelectedNft(nfts[i])
      setSelectedNftOwners(nftOwnerList[nfts[i].tokenCount - 1])
    }
    setShowModal(!showModal)
  }

  function toggleOwnerFilter() {
    setOwnerFilter(!ownerFilter)
  }

  return (
    <div className="App">
      <Navbar />
      <Container>
        <Title> VZ Ninja NFT Collection </Title>
        <Subtitle> Exclusive Membership Rewards for VZ Ninja fighters. </Subtitle>
        <button type='submit' onClick={toggleOwnerFilter}>Toggle Owned Filter</button>
        { !ownerFilter &&
          <Grid>
            {
              nfts.map((nft, i) =>
                <NFTCard nft={nft} key={i} toggleModal={() => toggleModal(i)} />
              )
            }
          </Grid>
        }
        { ownerFilter &&
          <Grid>
            {
              ownNfts.map((nft, i) =>
                <NFTCard nft={nft} key={i} toggleModal={() => toggleModal(i)} />
              )
            }
          </Grid>
        }
      </Container>
      {
        showModal &&
        <NFTModal
          nft={selectedNft}
          nftOwner={selectedNftOwners}
          toggleModal={() => toggleModal()}
        />
      }
    </div>
  );
}

const Title = styled.h1`
  margin: 0;
  text-align: center;
`
const Subtitle = styled.h4`
  color: gray;
  margin-top: 0;
  text-align: center;
`
const Container = styled.div`
  width: 70%;
  max-width: 1200px;
  margin: auto;
  margin-top: 100px;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  row-gap: 40px;
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
const CloseButton = styled.span`
  padding: 20px 25px 0 0;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
`

export default App;