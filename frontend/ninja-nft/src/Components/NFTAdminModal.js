import React, { useEffect, useState, useCallback, useContext, useRef } from 'react'
import styled from "styled-components"
import Dropzone from "./Dropzone";
import { Web3Context } from '../Context/web3-context';
const axios = require("axios");

const NFTAdminModal = (props) => {

    const { ninjaNFTContract, currentAccount, adminList, ninjaList, getAdmins, getNinjas, getNfts, getOwnNfts, getMaticBalance } = useContext(Web3Context)

    const prevAdminListRef = useRef();
    const prevNinjaListRef = useRef();

    const [fileImg, setFileImg] = useState(null);
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [amount, setAmount] = useState("")
    const [formFields, setFormFields] = useState([{ display_type: '', trait_type: '', value: '' , max_value: ''}])
    
    const [adminName, setAdminName] = useState("")
    const [adminAddress, setAdminAddress] = useState("")

    const [ninjaName, setNinjaName] = useState("")
    const [ninjaAddress, setNinjaAddress] = useState("")

    const [tokenNumber, setTokenNumber] = useState("")
    const [transferNumbers, setTransferNumbers] = useState("")
    const [transferNames, setTransferNames] = useState("")

    const [createForm, setCreateForm] = useState("")
    const [adminForm, setAdminForm] = useState("")
    const [ninjaForm, setNinjaForm] = useState("")
    const [batchForm, setBatchForm] = useState("")

    const sendFileToIPFS = async (e) => {
      e.preventDefault();
      if (fileImg) {
        try {
          const formData = new FormData();
          formData.append("file", fileImg);

          const resFile = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data: formData,
            headers: {
              'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
              'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
              "Content-Type": "multipart/form-data"
            },
          });
          
          const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
          console.log(resFile.data.IpfsHash);
          console.log(ImgHash);
          sendJSONtoIPFS(ImgHash)
        } catch (error) {
          console.log("File to IPFS: ");
          console.log(error)
        }
      }
    }

    const sendJSONtoIPFS = async (ImgHash) => {
      var cleanArray = [];
      const  CLEANER_VALUES = [null, undefined, '']
      
      const objectCleaner = (_object, _CLEANER_VALUES = CLEANER_VALUES) =>{
        const cleanedObj = {..._object};
        Object.keys(cleanedObj).forEach(key => {
        if (_CLEANER_VALUES.includes(cleanedObj[key])) {
          delete cleanedObj[key];
        }});
        return cleanedObj;
      }

      for(var i = 0; i < formFields.length; i++){
        const _cleandedObject = objectCleaner(formFields[i], CLEANER_VALUES);
        cleanArray.push(_cleandedObject);
      }
      
      try {
        const resJSON = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
          data: {
            "description": desc,
            "image": ImgHash,
            "name": name,
            "attributes": cleanArray
          },
          headers: {
            'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
            'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`
          },
        });

        console.log("final ", `https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`)
        const tokenURI = `https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`;
        console.log("Token URI", tokenURI);
        mintNFT(tokenURI, currentAccount, desc, ImgHash, name, cleanArray)
      } catch (error) {
        console.log("JSON to IPFS: ")
        console.log(error);
      }
    }

    const mintNFT = async (tokenURI, currentAccount, desc, ImgHash, name, cleanArray) => {
      try {
        let response = await ninjaNFTContract.createAndMintNFT(tokenURI, currentAccount, amount)

        setFileImg("");
        setName("");
        setDesc("");
        setFormFields([{ display_type: '', trait_type: '', value: '' , max_value: ''}]);

        let receipt = await response.wait()
        let eve = receipt.events[0]
        console.log(await eve.getTransactionReceipt());
        let val = (await ninjaNFTContract.uriToTokenCount(tokenURI)).toNumber();
        console.log("NFT number:", val)
        getNfts();
        getOwnNfts();
        getMaticBalance();

        try {
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}` + "initialNfts.json", {
              "description": desc,
              "image": ImgHash,
              "name": name,
              "attributes": cleanArray,
              "tokenCount": val,
              "quantity": amount,
              "copies": 0
          });
          console.log("response", response)
        } catch (error) {
          console.log("JSON to Firebase:", error)
        }
        props.toggleAdminModal();

      } catch (error) {
        console.log("Error while minting NFT with contract")
        console.log(error);
      }
    }

    const onDrop = useCallback((acceptedFiles) => {
      var file = acceptedFiles[0];
      var reader = new FileReader();
      if (file && file.type.match('image.*')) {
        reader.readAsDataURL(file);
      }
      reader.onloadend = function (e) {
        setFileImg(file);
      }
      //sendFileToIPFS(file)
    }, []);

    useEffect(() => {
        console.log(fileImg)
    }, [fileImg])

    const sendAdminInfo = async (e) => {
      e.preventDefault();
      try {
        let response = await ninjaNFTContract.changeAdmin(adminAddress, adminName)

        let val = await ninjaNFTContract.isAdmin(adminAddress);
        console.log(val);

        setAdminName("");
        setAdminAddress("");

        let receipt = await response.wait()
        let eve = receipt.events[0]
        console.log(await eve.getTransactionReceipt());
        getAdmins();

        props.toggleAdminModal();

      } catch (error) {
        console.log("Error while setting Admin")
        console.log(error);
      }
    }

    const sendNinjaInfo = async (e) => {
      e.preventDefault();
      try {
        let response = await ninjaNFTContract.changeNinja(ninjaAddress, ninjaName)

        let val = await ninjaNFTContract.isNinja(ninjaAddress);
        console.log(val)

        setNinjaName("");
        setNinjaAddress("");

        let receipt = await response.wait()
        let eve = receipt.events[0]
        console.log(await eve.getTransactionReceipt());
        getNinjas();

        props.toggleAdminModal();

      } catch (error) {
        console.log("Error while setting Ninja")
        console.log(error);
      }
    }

    const sendBatchTransfer = async (e) => {
      e.preventDefault();
      try {
        let transferNumbersArray = JSON.parse(transferNumbers)
        let transferNamesArray = JSON.parse(transferNames)
        if (transferNumbersArray.length != transferNamesArray.length) {
          console.log("Arrays not the same length, transaction not initiated!")
        } else {
          let response = await ninjaNFTContract.batchDistributeNFTs(tokenNumber, transferNumbersArray, transferNamesArray)

          setTokenNumber("");
          setTransferNumbers("");
          setTransferNames("");

          let receipt = await response.wait()
          let eve = receipt.events[0]
          console.log(await eve.getTransactionReceipt());
          getNfts();
          getOwnNfts();
          getMaticBalance();

          props.toggleAdminModal();
        }
      } catch (error) {
        console.log("Error while sending batch transfer")
        console.log(error);
      }
    }
  
    const handleFormChange = (event, index) => {
      let data = [...formFields];
      data[index][event.target.name] = event.target.value;
      setFormFields(data);
    }

    const addFields = () => {
      let object = {
        display_type: '',
        trait_type: '',
        value: '',
        max_value: ''
      }

      setFormFields([...formFields, object])
    }
  
    const removeFields = (index) => {
      let data = [...formFields];
      data.splice(index, 1)
      setFormFields(data)
    }

    useEffect(() => {
      if (fileImg && name && desc && amount) {
        setCreateForm(true);
      } else {
        setCreateForm(false);
      }
    }, [fileImg, name, desc, amount])

    useEffect(() => {
      getAdmins();
      getNinjas();
    }, [adminList.length, ninjaList.length])

    useEffect(() => {
      if (adminAddress && adminAddress.length === 42) {
        setAdminForm(true);
      } else {
        setAdminForm(false);
      }
    }, [adminName, adminAddress])

    useEffect(() => {
      if (ninjaAddress && ninjaAddress.length === 42) {
        setNinjaForm(true);
      } else {
        setNinjaForm(false);
      }
    }, [ninjaName, ninjaAddress])

    useEffect(() => {
      if (tokenNumber && transferNumbers && transferNames) {
        setBatchForm(true);
      } else {
        setBatchForm(false);
      }
    }, [tokenNumber, transferNumbers, transferNames])

    return (
      <Modal>
        <ModalContent>
          <ModalTitle>Admin Functionality</ModalTitle>
          <ModalGrid>
            <div>
              <SectionText>Create new Ninja NFTs</SectionText>
              <Dropzone onDropAccepted={onDrop}/>
              <SectionText>Metadata Attributes</SectionText>
              <form onSubmit={sendFileToIPFS}>
                <div><input type="text" onChange={(e) => setName(e.target.value)} placeholder='NFT name' required value={name} /></div>
                <div><input type="text" onChange={(e) => setDesc(e.target.value)} placeholder='NFT description' required value={desc} /></div>
                <div><input type="number" onChange={(e) => setAmount(e.target.value)} placeholder='Minted amount' required value={amount} /></div>
                {formFields.map((form, index) => {
                  return (
                    <div key={index}>
                      <input
                        name='display_type'
                        type='text'
                        placeholder='display_type'
                        onChange={event => handleFormChange(event, index)}
                        value={form.display_type}
                      />
                      <input
                        name='trait_type'
                        type='text'
                        placeholder='trait_type'
                        onChange={event => handleFormChange(event, index)}
                        value={form.trait_type}
                      />
                      <input
                        name='value'
                        type='default'
                        placeholder='value'
                        onChange={event => handleFormChange(event, index)}
                        value={form.value}
                      />
                      <input
                        name='max_value'
                        type='default'
                        placeholder='max_value'
                        onChange={event => handleFormChange(event, index)}
                        value={form.max_value}
                      />
                      <button onClick={() => removeFields(index)}>Remove</button>
                    </div>
                  )
                })}
              </form>
              <button onClick={addFields}>Add Attributes</button>
              <br />
              <button type='submit' onClick={sendFileToIPFS} disabled={!createForm}>Mint new NFT</button>
            </div>
            <div>
              <SectionText>Handle Admins and Ninjas</SectionText>
              <form onSubmit={sendAdminInfo}>
                <div><input type="text" onChange={(e) => setAdminName(e.target.value)} placeholder='name: leave empty to remove' value={adminName} /></div>
                <div><input type="text" onChange={(e) => setAdminAddress(e.target.value)} placeholder="addr" required value={adminAddress} /></div>
                <br />
                <button type='submit' disabled={!adminForm}>Add/Change Admin</button>
              </form>
              <br />
              <form onSubmit={sendNinjaInfo}>
                <div><input type="text" onChange={(e) => setNinjaName(e.target.value)} placeholder='name: leave empty to remove' value={ninjaName} /></div>
                <div><input type="text" onChange={(e) => setNinjaAddress(e.target.value)} placeholder="addr" required value={ninjaAddress} /></div>
                <br />
                <button type='submit' disabled={!ninjaForm}>Add/Change Ninja</button>
              </form>
              <br />
              <SectionText>Batch transfer NFTs</SectionText>
              <form onSubmit={sendBatchTransfer}>
                <div><input type="number" onChange={(e) => setTokenNumber(e.target.value)} placeholder='token number' required value={tokenNumber} /></div>
                <div><input type="default" onChange={(e) => setTransferNumbers(e.target.value)} placeholder='array of amounts, e.g. [1, 2]' required value={transferNumbers} /></div>
                <div><input type="default" onChange={(e) => setTransferNames(e.target.value)} placeholder='array of names, e.g. ["RSlo", "MLr"]' required value={transferNames} /></div>
                <br />
                <button type='submit' disabled={!batchForm}>Batch transfer of NFTs</button>
              </form>
            </div>
            <div>
              <SectionText>List of all Admins</SectionText>
              {
                adminList.map((admin, i) =>
                  <Text key={i}>{admin.name}: {admin.addr}</Text>
                )
              }
            </div>
            <div>
              <SectionText>List of all Ninjas</SectionText>
              {
                ninjaList.map((ninja, i) =>
                  <Text key={i}>{ninja.name}: {ninja.addr}</Text>
                )
              }
            </div>
          </ModalGrid>
          <CloseButton onClick={() => props.toggleAdminModal()} >
            &times;
          </CloseButton>
        </ModalContent>
      </Modal>
    )
}
  
  const AttributeText = styled.h4`
    color: gray;
    margin: 0;
    display: inline;
  `
  
  const CloseButton = styled.span`
    position: absolute;
    right: 0;
    top: 0;
    padding: 20px 25px 0 0;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
  `
  
  const ModalTitle = styled.h1`
    margin: 0;
  `
  const Paragraph = styled.p`
    margin: 0 0 15px 0;
  `
  const SectionText = styled.h3`
    margin: 5px 0 5px 0;
  `
  const Text = styled.h5`
    margin: 1px 0 1px 0;
    font-weight: normal;
`
  const ModalGrid = styled.div`
    display: inline-grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 40px;
    @media(max-width: 1200px) {
      grid-template-columns: 1fr 1fr;
    }
    @media(max-width: 600px) {
      grid-template-columns: 1fr;
    }
  `
  const Modal = styled.div`
    position: fixed;
    display: flex;
    align-items: center;
    z-index: 100px; // Stays on top of everything else
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto; // Enable scroll if needed
    background-color: rgba(0,0,0, 0.5);
  `
  
  const ModalContent = styled.div`
    position: relative;
    width: 900px;
    margin: auto;
    background-color: white;
    border-radius: 20px;
    padding: 20px;
  `
  export { NFTAdminModal }