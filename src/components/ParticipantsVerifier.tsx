import React from "react"
import {  useState } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import {ethers} from "ethers"
import { Box, Heading, Input, VStack,  Button, Text, HStack, StackDivider,  Select, Center, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react"
import { QrReader } from "react-qr-reader"
import { getERC1155Contract, getERC20Contract, getERC721Contract, getProvider } from "../utils/utility"

function ParticipantsVerifier() {
    const [_eventName, setEventName] = useState('')
    const [_contractAddress, setContractAddress] = useState('')
    const [_contractName, setContractName] = useState('')
    const [_contractSymbol, setContractSymbol] = useState('')
    const [_minTokenQuantity, setMinTokenQuantity] = useState('')
    const [_assetType, setAssetType] = useState('')
    const [_chainId, setChainId] = useState('')
    const [_scanQrCode,setScanQrCode] = useState(false)
    const [_scannedDetails,setScannedDetails]= useState('')
    const [_verificationResult, setVerificationResult] = useState('')
    const [_tokenId,setTokenId] = useState('')
    const [_tokenOwnerAddress,setTokenOwnerAddress] = useState('')

   

    const verifyMessage =async (_signature,_signerAddress,_message) =>{
        try{
            const signerAddress = await ethers.utils.verifyMessage(_message,_signature)
            console.log("SignerAddress : "+signerAddress)
            return signerAddress==_signerAddress
        }
        catch(e){
            console.log(e)
        }
        return false;

    }
    const handleQRScannerResult = async (result, error) => {
        if (!!result) {
            console.log(result?.getText());
            const qrCodeData = JSON.parse(result?.getText())
            setScannedDetails(qrCodeData)
            setScanQrCode(false)
            console.log(qrCodeData);
            const passDetails = JSON.parse(qrCodeData.passDetails)
            console.log(passDetails)
            setEventName(passDetails.name)
            setAssetType(passDetails.assetType)
            setChainId(passDetails.chain)
            setMinTokenQuantity(passDetails.quantity)
            setContractAddress(passDetails.contractAddress)
            

            if(passDetails.assetType=='ERC721'){
                console.log(passDetails.tokenId)
                setTokenId(passDetails.tokenId)
                await getNFTDetails(passDetails.contractAddress,passDetails.chain,passDetails.tokenId)
                console.log("OwnerAddress : "+_tokenOwnerAddress)
                const verificationResult = await verifyMessage(qrCodeData.signature,_tokenOwnerAddress,qrCodeData.passDetails)
                console.log(verificationResult)
                verificationResult?setVerificationResult('success'):setVerificationResult('failed')
                
             }else if(passDetails.assetType=='ERC1155'){
                 
                
             } else if(passDetails.assetType=='ERC20'){
                 
                     
             }
        }

        if (!!error) {
            //console.info(error);
            
        }
    }

    const getNFTDetails =async (_contractAddress,_chain,tokenId)=> {
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
            const ownerAddress = await erc721Contract.ownerOf(tokenId)
            console.log(`Owner of ${tokenId} is ${ownerAddress} `)
            setTokenOwnerAddress(ownerAddress)
        }
        catch(e){

            console.log(e)
        }

    }
const handleVerifyEventPass = ()=>{

}

    const handleClear =()=>{
        setEventName('')
        setContractAddress('')
        setMinTokenQuantity('')
        setAssetType('')
        setChainId('')
        setContractName('')
        setContractSymbol('')
        setScannedDetails('')
        setScanQrCode(false)
        setVerificationResult('')
        setTokenId('')
        setTokenOwnerAddress('')
    }
   
    return (
        
        <Center my={2}>
            <Box w='90%'>
                <Heading size='lg'><Center >Participants Verification</Center></Heading>
                <HStack  justifyContent='space-between' align="start" p="6" divider={<StackDivider borderColor='gray.200' />} borderWidth={1} borderColor="gray.500" borderRadius="4px">
                    
                    <VStack w='45%' spacing={5}>
                        {_scanQrCode
                            ?<Button colorScheme='red' onClick={()=>{setScanQrCode(false)}}>Stop Scanning</Button>
                            :<Button colorScheme='green' onClick={()=>{setScanQrCode(true)}}>Scan EventPass QRCode</Button>
                        }

                        <Box justifyItems="center" py="6">
                            
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
                                        {_tokenId!=''?<Text fontSize='xs'>TokenId:{_tokenId}</Text>:<></>}
                                    </VStack>
                                    :''}
                                   
                                   
                                </HStack>
                                
                                
                            </VStack>
                            </>:<></>
                        }
                        </Box>
                    </VStack>
                <VStack w='45%'  spacing={5}>
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
                        _verificationResult=='success'
                            ?<>
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
                                        Verification Successful
                                    </AlertTitle>
                                    <AlertDescription maxWidth='sm'>
                                        Thanks for your interest. Enjoy the event.
                                    </AlertDescription>
                            </Alert>
                                
                               
                            </>

                            :<>{_verificationResult=='failed'
                                    ?<>
                                    <Alert
                                        status='error'
                                        variant='subtle'
                                        flexDirection='column'
                                        alignItems='center'
                                        justifyContent='center'
                                        textAlign='center'
                                    >
                                        <AlertIcon boxSize='20px' mr={0} />
                                        <AlertTitle mt={4} mb={1} fontSize='lg'>
                                            Verification Failed
                                        </AlertTitle>
                                        <AlertDescription maxWidth='sm'>
                                            Invalid Event Pass. 
                                        </AlertDescription>
                                    </Alert>
                                    </>:
                                    <></>}
                                
                            </>
                    }
                   
                </VStack>
            </HStack>
            
            </Box>
        </Center>
          
      
    )
    
}

export default ParticipantsVerifier
