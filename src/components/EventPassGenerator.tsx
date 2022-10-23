import React from "react"
import { useEffect, useState } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import {ethers} from "ethers"
import { hexlify } from "ethers/lib/utils"
import { Box, Heading, Input, VStack, Link, Button, Text, HStack, StackDivider, List, ListItem, Checkbox, Select, Center, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, OrderedList, ListIcon, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import QRCode from "react-qr-code";
import { QrReader } from "react-qr-reader"
import { getERC1155Contract, getERC20Contract, getERC721Contract, getProvider } from "../utils/utility"
import { accordionAnatomy } from "@chakra-ui/anatomy"
import { MdCheckCircle } from "react-icons/md"

function EventPassGenerator() {
    const [_accounts,setAccounts] = useState<string[]>([])
    const [_metaMaskConnected,setMetaMaskConnected] = useState(false)
    const [_eventName, setEventName] = useState('')
    const [_contractAddress, setContractAddress] = useState('')
    const [_minTokenQuantity, setMinTokenQuantity] = useState('')
    const [_assetType, setAssetType] = useState('')
    const [_chainId, setChainId] = useState('')
    const [_scanQrCode,setScanQrCode] = useState(false)
    const [_scannedDetails,setScannedDetails]= useState('')
    const [_contractName, setContractName] = useState('')
    const [_contractSymbol, setContractSymbol] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [_tokenId,setTokenId] = useState('')
    const [_passValue,setPassValue] = useState('')
    
    
    const handleQRScannerResult = (result, error) => {
        if (!!result) {
            const qrCodeData = JSON.parse(result?.getText())
            setScanQrCode(false)
            setScannedDetails(result?.getText())
            
            setEventName(qrCodeData.name)
            setAssetType(qrCodeData.assetType)
            setChainId(qrCodeData.chain)
            setMinTokenQuantity(qrCodeData.quantity)
            setContractAddress(qrCodeData.contractAddress)
            
            if(qrCodeData.assetType=='ERC721'){
                getNFTDetails(qrCodeData.contractAddress,qrCodeData.chain)
             }else if(qrCodeData.assetType=='ERC1155'){
                 
                
             } else if(qrCodeData.assetType=='ERC20'){
                 
                     
             }
            console.log(qrCodeData);
        }

        if (!!error) {
           // console.info(error);
            
        }
    }

    const getNFTDetails =async (_contractAddress,_chain)=> {
        console.log("Getting ERC721 Details")
        const ethereum = (await detectEthereumProvider()) as any
        try{
            const provider = getProvider(_chain)
            console.log(provider)
            const erc721Contract = getERC721Contract(provider,_contractAddress)
            const name = await erc721Contract.name()
            setContractName(name)
            const symbol = await erc721Contract.symbol()
            setContractSymbol(symbol)
            console.log(`${name} has symbol of ${symbol} `)
        }
        catch(e){

            console.log(e)
        }

    }

    
    const handlePassGeneration = async ()=>{
        try{
            if(_assetType=='ERC721' && _metaMaskConnected && _accounts.length!=0){
                var dataToSign = JSON.parse(_scannedDetails)
                dataToSign.tokenId = _tokenId
                //dataToSign = {...dataToSign, tokenid:_tokenId}
                    
                    
                const ethereum = (await detectEthereumProvider()) as any
                var signature: string = await ethereum.request({
                    method: "personal_sign",
                    params: [JSON.stringify(dataToSign), _accounts[0]]
                })
                var finalPassData={}
                finalPassData['passDetails'] = JSON.stringify(dataToSign)
                finalPassData['signature'] = signature
                   
                setPassValue(JSON.stringify(finalPassData))
                console.log(JSON.stringify(finalPassData))
                onClose()
                
            }
            else if(_assetType=='ERC20' && _metaMaskConnected && _accounts.length!=0){
                //var dataToSign = JSON.parse(_scannedDetails)
               // dataToSign = {...dataToSign, tokenid:_tokenId}
                    
                    
                const ethereum = (await detectEthereumProvider()) as any
                var signature: string = await ethereum.request({
                    method: "personal_sign",
                    params: [_scannedDetails, _accounts[0]]
                })
                const finalPassData={
                    passDetails: _scannedDetails,
                    signature: signature
                }
                setPassValue(JSON.stringify(finalPassData))
                onClose()
                
            }
        }catch(e){
            console.log(e)
        }
        

    }
    const handleWalletConnection = async () =>{
        console.log("handleMetaMaskConnect : " + _chainId)
        const ethereum = (await detectEthereumProvider()) as any
        if (_chainId) {
            try{
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: hexlify(Number(_chainId!)).replace("0x0", "0x")
                    }
                ]
            })
            var accounts: string[] = await ethereum.request({
                method: "eth_requestAccounts"
            })
            console.log("Account :"+accounts[0] )
            setAccounts(accounts)
            setMetaMaskConnected(true)
        }
        catch(e){
            console.log(e)
        }
        }
    }
    const onImageCownload = () => {
        console.log("Downloading")
        const svg = document.getElementById("QRCode");
        const svgData = new XMLSerializer().serializeToString(svg as Node);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width+50;
            canvas.height = img.height+50;
            ctx!.fillStyle = "white";
            ctx!.fillRect(0, 0, canvas.width, canvas.height);
            ctx!.drawImage(img, 20, 20);
            ctx!.fillStyle = "Black";
            ctx!.textAlign = "center";
            ctx!.font = "20px Arial";
            ctx!.fillText(_eventName,canvas.width/2,img.height+40)
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = "QRCode";
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        };
       // img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;// depricated
        img.src = `data:image/svg+xml;base64,${Buffer.from(svgData).toString('base64')}`;
      };

      const handleClear =()=>{
        setEventName('')
        setContractAddress('')
        setMinTokenQuantity('')
        setAssetType('')
        setChainId('')
        setContractName('')
        setContractSymbol('')
        setPassValue('')
        setScannedDetails('')
        setScanQrCode(false)
    }
    
   
   
    return (
        
        <Center my={2}>
             <Box w='90%'>
                <Heading size='lg'><Center >Event Pass Generator</Center></Heading>
                <HStack justifyContent='space-between' align="start" p="6" divider={<StackDivider borderColor='gray.200' />} borderWidth={1} borderColor="gray.500" borderRadius="4px">
                    
                    <VStack w='45%' spacing={1}>
                       {_scannedDetails!='' 
                        ? <>
                            <VStack w='100%' alignItems="start" p="6" borderWidth={1} borderColor="gray.500" borderRadius="4px">
                                <HStack w='100%' justifyContent='space-between'>
                                    <Button onClick={handleClear} colorScheme='blue'>New</Button>
                                    <Button onClick={handleClear} colorScheme='red'>Discard</Button>
                                </HStack>
                                <HStack w='100%' justifyContent='space-between'>
                                    <Text>Enter Event Name:</Text>
                                    <Input
                                        htmlSize={25}
                                        width="auto"
                                        value={_eventName}
                                        isDisabled={true}
                                    />
                                </HStack>
                                <HStack w='100%' justifyContent='space-between'> 
                                    <Text>Accepting Asset Type:</Text>
                                    <Input
                                        htmlSize={25}
                                        width="auto"
                                        value={_assetType}
                                        isDisabled={true}
                                        
                                    />
                                </HStack>
                                <HStack w='100%' justifyContent='space-between'>
                                    <Text>Network Chain</Text>
                                    <Select w='50%' value={_chainId} isDisabled={true}>
                                        <option value=''>Select a network chain</option>
                                        <option value="137">Polygon Mainnet</option>
                                    </Select>
                                </HStack>
                                {_contractAddress != '' ? 
                                    <HStack w='100%' justifyContent='space-between'>
                                        <Text>Contract Address:</Text>
                                        <Input
                                            htmlSize={25}
                                            width="auto"
                                            value={_contractAddress}
                                            isDisabled={true}
                                        />
                                    </HStack>
                                    :<></>
                                }
                                
                                <HStack w='100%' justifyContent='space-between'>
                                <Text>Min Token Quantity:</Text>
                                    <Input
                                        htmlSize={25}
                                        width="auto"
                                        value={_minTokenQuantity}
                                        isDisabled={true}
                                    />
                                </HStack>
                                <HStack w='100%' justifyContent='space-between'>
                            
                                    {_contractName!='' && _contractSymbol!=''?
                                    <VStack>
                                        <Text fontSize='xs'>Contract Details</Text>
                                        <Text fontSize='xs'> Name: {_contractName}</Text>
                                        <Text fontSize='xs'>Symbol: {_contractSymbol}</Text>
                                    </VStack>
                                    :''}
                                    <Button colorScheme='green' onClick={onOpen}>Generate Event Pass</Button>
                                    <Modal size='xl' isOpen={isOpen} onClose={onClose}>
                                        <ModalOverlay />
                                        <ModalContent>
                                        <ModalHeader>Generate Event Pass</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody>
                                            <VStack>
                                                <OrderedList>
                                                    {_metaMaskConnected?
                                                        <ListItem>
                                                            <ListIcon as={MdCheckCircle} color='green.500' />
                                                            Wallet Connected<Text fontSize='2xs'>{_accounts[0]}</Text>
                                                        </ListItem>
                                                    :
                                                    <ListItem>
                                                        <ListIcon as={MdCheckCircle} color='red.500' />
                                                        Please connect your wallet.<Button onClick={handleWalletConnection}>Connect</Button>
                                                    </ListItem>    
                                                    }
                                                    {_assetType=='ERC721' 
                                                    ? 
                                                    <ListItem>
                                                        {_tokenId!=''
                                                            ?<ListIcon as={MdCheckCircle} color='green.500' />
                                                            :<ListIcon as={MdCheckCircle} color='red.500' />
                                                        }
                                                        Event <b>{_eventName}</b> require you to hold <b> {_contractName}</b> {_assetType} token.
                                                        <Input
                                                            htmlSize={25}
                                                            width="auto"
                                                            value={_tokenId}
                                                            onChange={(e) => setTokenId(e.target.value)}
                                                            placeholder='Enter the token Id you hold'
                                                        />
                                                    </ListItem>
                                                    :<></>
                                                    }
                                                    
                                                </OrderedList>
                                               
                                            </VStack>
                                        </ModalBody>

                                        <ModalFooter>
                                            <Button colorScheme='red' mr={3} onClick={onClose}>
                                            Close
                                            </Button>
                                          
                                            {_assetType=='ERC721'
                                                
                                                ?<Button colorScheme='blue' onClick={handlePassGeneration} isDisabled={!_metaMaskConnected ||_accounts.length<0 || _tokenId==''}>Submit 
                                               </Button>
                                               
                                               :<Button colorScheme='blue' onClick={handlePassGeneration} isDisabled={!_metaMaskConnected }>Submit </Button>
                                            }
                                        </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </HStack>
                                
                                
                            </VStack>
                        </> 
                        : <>
                            <HStack w='100%' justifyContent='space-between' align="start" p="6" divider={<StackDivider borderColor='gray.200' />} borderWidth={1} borderColor="gray.500" borderRadius="4px">

                                <Select w='35%'>
                                    <option>select event</option>
                                </Select> 
                                <Text> OR </Text>

                                {_scanQrCode
                                    ?<Button colorScheme='red' onClick={()=>{setScanQrCode(false)}}>Stop Scanning</Button>
                                    :<Button colorScheme='green' onClick={()=>{setScanQrCode(true)}}>Scan event QR code</Button>
                                }
                            </HStack>
                        </>}
                       
                        
                    
                    </VStack>
                    <VStack w='45%' spacing={2}>
                        {
                            _scanQrCode?
                                <Box w='100%'>
                                    <QrReader
                                        onResult={handleQRScannerResult} constraints={{ facingMode: 'user' }}  
                                        containerStyle={{ width: '100%' }}                           
                                    />
                                </Box>
                            :
                                <></>
                        }
                        {
                            _passValue!=''?
                            <>
                                <Alert
                                    status='success'
                                    variant='subtle'
                                    flexDirection='column'
                                    alignItems='center'
                                    justifyContent='center'
                                    textAlign='center'
                                >
                                    <AlertIcon boxSize='20px' mr={0} />
                                    <AlertTitle mt={4} mb={1} fontSize='lg'>
                                        Event Pass Generated!
                                    </AlertTitle>
                                    <AlertDescription maxWidth='sm'>
                                        Thanks for your interest. Our team will love to see you at the event.
                                    </AlertDescription>
                                </Alert>
                                <Text size='lg' >Steps to follow</Text>
                                <OrderedList>
                                    <ListItem><Text fontSize='md'>Download your event pass (QRCode)</Text></ListItem>
                                    <ListItem><Text fontSize='md'>Bring this with you to get access on event date</Text></ListItem>
                                </OrderedList>
                                <Box borderWidth={1} borderColor="gray.500" borderRadius="4px">
                                    <QRCode id="QRCode" viewBox={`0 0 256 256`} value={_passValue}/>
                                </Box>
                                {_passValue!=''?<Button onClick={onImageCownload} >Download Event Pass</Button>:''}
                            </>
                            :
                            <></>
                        }
                    </VStack>
                </HStack>
            </Box>
            
        </Center>
          
      
    )
    
}

export default EventPassGenerator
