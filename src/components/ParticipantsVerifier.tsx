import React, { useEffect } from "react"
import {  useState } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import {ethers} from "ethers"
import { Box, Heading, Input, VStack,  Button, Text, HStack, StackDivider,  Select, Center, Alert, AlertIcon, AlertTitle, AlertDescription, Flex, useColorModeValue, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, Badge, List, ListItem, ListIcon, AlertDialogFooter, chakra } from "@chakra-ui/react"
import { QrReader } from "react-qr-reader"
import { getERC1155Contract, getERC20Contract, getERC721Contract, getProvider } from "../utils/utility"
import { useSelector } from "react-redux"
import { selectEventConfig } from "../appdata/dataSlice/eventConfigSlice"
import { Criteria, EventConfiguration } from "./EventOrganizer"
import { FaCheckCircle } from "react-icons/fa"
import { AiFillCloseCircle } from "react-icons/ai"
import { EventPass } from "./EventPassGenerator"

function ParticipantsVerifier() {
    const [_contractName, setContractName] = useState('')
    const [_scanQrCode,setScanQrCode] = useState(false)
    const [_verificationResult, setVerificationResult] = useState('')

    const _appEventConfigs = useSelector(selectEventConfig)
    const [_selectedEventIndex,setSelectedEventIndex] = useState('')
    const [_selectedEventConfig, setSelectedEventConfig] = useState<EventConfiguration>()
    const [_scannedEventPass, setScannedEventPass] = useState<EventConfiguration>();
    const [_criteriaVerficationResults,setCriteriaVerficationResults] = useState<any>([])
    const _videoRequestRef = React.useRef<HTMLDivElement>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(()=>{
         if(_selectedEventIndex!=null){
            console.log(" When scan is not passed as query data ")
          //  setEventConfig(_appEventConfigs[_selectedEventIndex!])
            
        }
    },[])



    const verifyMessage =(_signature,_ownerAddress,_message) =>{
        try{
            const signerAddress =  ethers.utils.verifyMessage(_message,_signature)
            console.log("SignerAddress : "+signerAddress)
            return signerAddress==_ownerAddress
        }
        catch(e){
            console.log(e)
        }
        return false;

    }

    const getSignerAddress = (_signature,_message) =>{
        try{
            const signerAddress =  ethers.utils.verifyMessage(_message,_signature)
            console.log("SignerAddress : "+signerAddress)
            return signerAddress
        }
        catch(e){
            console.log(e)
        }
        
    }
    const handleQRScannerResult = async (result, error) => {
        if (!!result) {
            console.log(result?.getText());
            const qrCodeData: EventPass = JSON.parse(result?.getText())
            //setScannedDetails(qrCodeData)
            const eventPassConfiguration : EventConfiguration = JSON.parse(qrCodeData.eventConfiguration)
            console.log("Event Pass configuration:"+JSON.stringify(eventPassConfiguration))
            setScanQrCode(false)

            if(_selectedEventConfig?.name == eventPassConfiguration.name 
                && _selectedEventConfig?.location== eventPassConfiguration.location 
                && _selectedEventConfig.date == eventPassConfiguration.date 
                && _selectedEventConfig.criteria.length == eventPassConfiguration.criteria.length ){
                  
                    if(eventPassConfiguration.criteria != null){
                        
                        var criteriaSuccessfull =   await eventPassConfiguration.criteria.map(
                            async (criteria,index) =>{
                                
                                if(criteria.assetType == 'ERC721' 
                                    && criteria.tokenId 
                                    && _selectedEventConfig.criteria[index].contractAddress == criteria.contractAddress
                                    && _selectedEventConfig.criteria[index].assetType == criteria.assetType
                                    && _selectedEventConfig.criteria[index].chainId == criteria.chainId){

                                    const _owner = await getNFTOwner(criteria.contractAddress,criteria.chainId,criteria.tokenId)
                                    const verificationResult = verifyMessage(qrCodeData.signature,_owner,qrCodeData.eventConfiguration)
                                    console.log(`Criteria ${index} : ${verificationResult}`)
                                    return verificationResult
                                }else if(criteria.assetType == 'ERC20' 
                                            && _selectedEventConfig.criteria[index].contractAddress == criteria.contractAddress
                                            && _selectedEventConfig.criteria[index].assetType == criteria.assetType
                                            && _selectedEventConfig.criteria[index].chainId == criteria.chainId){
                                                console.log("Criteria for ERC20")
                                    
                                    const signerAddress = getSignerAddress(qrCodeData.signature,qrCodeData.eventConfiguration)
                                    if(signerAddress){
                                        
                                        const _balance = await getERC20Balance(criteria.contractAddress,criteria.chainId,signerAddress)
                                        console.log("Balance :"+_balance)
                                        const decimal =  await getERC20TokenDecimal(criteria.contractAddress,criteria.chainId)
                                        console.log("Decimal :"+decimal)
                                        if(decimal && _balance){
                                    
                                    
                                        return  (_balance! >= (parseInt(criteria.minTokenQuantity) * (10**decimal!)))
                                    
                                        } 
                                    }
                                }
                                else{
                                    return false
                                }
                            }
                        )
                        Promise.all(criteriaSuccessfull).then(
                            criteriaSuccessfull =>{
                                setCriteriaVerficationResults(criteriaSuccessfull!)
                                console.log(`criteriaSuccessfull  : ${JSON.stringify(criteriaSuccessfull)}`)
                                criteriaSuccessfull = criteriaSuccessfull.filter(c => c)
                                criteriaSuccessfull.length == eventPassConfiguration.criteria.length ?setScannedEventPass(eventPassConfiguration):setScannedEventPass(undefined)
                                criteriaSuccessfull.length == eventPassConfiguration.criteria.length ? setVerificationResult('success'):setVerificationResult('failed')
                            }
                        )
                    
                        
                    }
                   
                }
                else{
                    setVerificationResult('failed')
                }
           
            
            
            
        }

        if (!!error) {
            //console.info(error);
            
        }
    }

    const getNFTOwner =async (_contractAddress, _chainId, tokenId)=> {
        console.log(`Getting Owner of TokenId(${ tokenId}) for ERC721(${_contractAddress}) on chain ${_chainId}`)
        try{
            const provider = getProvider(_chainId)
            console.log(provider)
            const erc721Contract = getERC721Contract(provider,_contractAddress)
            const name = await erc721Contract.name()
            setContractName(name)
            const ownerAddress:string = await erc721Contract.ownerOf(tokenId)
            console.log(`Owner of ${tokenId} is ${ownerAddress} `)
            return ownerAddress
        }
        catch(e){

            console.log(e)
        }

    }

const getERC20Balance = async (_contractAddress: string, _chainId: string, accountAddress: string) => {
    console.log(`Getting Balance of ${accountAddress} for ERC20(${_contractAddress}) on chain ${_chainId}`)
    try{
        const provider = getProvider(_chainId)
        console.log(provider)
        const erc20Contract = getERC20Contract(provider,_contractAddress)
        console.log(erc20Contract)
        const name = await erc20Contract.name()
        setContractName(name)
        const balance:number = await erc20Contract.balanceOf(accountAddress)
        console.log(`Balance of ${accountAddress} address is ${balance} `)
        return balance
    }
    catch(e){
        console.log(e)
    }
    
}

const getERC20TokenDecimal = async (_contractAddress: string, _chainId: string) => {
    console.log(`Getting Decimal for ERC20(${_contractAddress}) Token on chain ${_chainId}`)
    try{
        const provider = getProvider(_chainId)
        console.log(provider)
        const erc20Contract = getERC20Contract(provider,_contractAddress)
        const decimal:number = await erc20Contract.decimals()
        console.log(`Decimals for ${_contractAddress} address is ${decimal} `)
        return decimal
    }
    catch(e){

        console.log(e)
    }
 }
   
   
    return (
        
        <Flex justify='center' align='start' minH='80vh' my={6} bg={useColorModeValue('gray.200', 'gray.800')} mt='20' >
             <VStack w='90%' p='3'm='2'  justify='space-between' align='center' spacing={5}>
                <Heading size='lg'><Center >Participants Verification</Center></Heading>
                {_selectedEventIndex == '' 
                    ?   <>
                            <HStack h='6' spacing='4'>
                                <Text>Select the event </Text>
                                <Select  borderColor={useColorModeValue('gray.800', 'gray.400')} 
                                    variant='flushed' 
                                    width="60" 
                                    value={_selectedEventIndex}
                                    onChange={(e) => {
                                    setSelectedEventIndex(e.target.value)
                                    setSelectedEventConfig(_appEventConfigs[e.target.value!])
                                    // navigate('/eventpassgenerator?eventId='+e.target.value)
                                    }}
                                    >
                                    <option key={0} value="" disabled ></option>
                                    {_appEventConfigs.map((eventconfig,index)=>(
                                    <option key={index+99} value={''+index}>{eventconfig.name}</option>
                                    ))}

                                </Select>
                            
                             </HStack>
                        </> 
                        :   <> 
                                    <HStack w='100%' p='3'm='2'  spacing='10' align='start' justifyContent='space-between' divider={<StackDivider borderColor={useColorModeValue('gray.800', 'gray.200')} />} borderWidth={1} borderColor="gray.500" borderRadius="4px" >
                                        {_selectedEventConfig != undefined
                                            ?
                                            <VStack w='100%' alignItems="start" justify='start' p="6" >
                                                <HStack w='100%' justifyContent='center'>
                                                    <Text >Event Configuration</Text>
                                                </HStack>
                                                <HStack w='100%' justifyContent='space-between'>
                                                    <Badge fontSize='0.8em' colorScheme='green'> <Text >Event Details</Text></Badge>
                                                </HStack>
                                                <HStack w='100%' justifyContent='space-between'>
                                                    <Text>Event Name:</Text>
                                                    <Input
                                                        htmlSize={25}
                                                        variant='flushed'
                                                        width="60"
                                                        borderColor={useColorModeValue('gray.800', 'gray.400')}
                                                        value={_selectedEventConfig?.name}
                                                        isDisabled={true}
                                                    />
                                                </HStack>
                                                <HStack w='100%' justifyContent='space-between'>
                                                    <Text>Event Date:</Text>
                                                    <Input
                                                        htmlSize={25}
                                                        variant='flushed'
                                                        width="60"
                                                        borderColor={useColorModeValue('gray.800', 'gray.400')}
                                                        value={_selectedEventConfig?.date}
                                                        isDisabled={true}
                                                    />
                                                </HStack>
                                                <HStack w='100%' justifyContent='space-between'>
                                                    <Text>Event Location:</Text>
                                                    <Input
                                                        htmlSize={25}
                                                        variant='flushed'
                                                        width="60"
                                                        borderColor={useColorModeValue('gray.800', 'gray.400')}
                                                        value={_selectedEventConfig?.location}
                                                        isDisabled={true}
                                                    />
                                                </HStack>
                                                <HStack w='100%' justifyContent='space-between'>
                                                    <Badge fontSize='0.8em' colorScheme='green'> <Text >Event Criteria</Text></Badge>
                                                </HStack>
                                                {_selectedEventConfig!.criteria.length>0 ?
                                                    <List w='100%' spacing='5' fontSize='sm'>
                                                                {_selectedEventConfig!.criteria.map((criteria,index) => (
                                                                    <ListItem key={index} wordBreak='break-all'>
                                                                            <ListIcon as={FaCheckCircle} />
                                                                            Participant need to have {criteria.minTokenQuantity} {criteria.assetType} of {criteria.tokenName?criteria.tokenName:criteria.contractAddress} on {criteria.chainId} chain.
                                                                    </ListItem>
                                                                ))}
                                                    </List>
                                                    :<Text fontSize='md'>No Criteria, {_selectedEventConfig?.name} open for all</Text>
                                                }
                                                
                                                
                                                
                                            </VStack>
                                            :<></>
                                        }
                                        <VStack w='100%' alignItems="start" >
                                           <VStack w='100%'>
                                            {_scanQrCode
                                                ?<Button colorScheme='red' onClick={()=>{setScanQrCode(false)}}>Stop Scanning</Button>
                                                :<Button colorScheme='green' onClick={onOpen}>Scan Participants EventPass</Button>
                                            }
                                            {_scanQrCode?
                                                <Box w='100%'>
                                                    <QrReader
                                                        onResult={handleQRScannerResult} constraints={{ facingMode: 'user' }}  
                                                        containerStyle={{ width: '100%' }}                           
                                                    />
                                                </Box>
                                            :
                                            <></>
                                            }
                                            {_scannedEventPass != undefined 
                                                ?<>
                                                <VStack w='100%' alignItems="start" justify='start' p="6" >
                                                
                                                <HStack w='100%' justifyContent='space-between'>
                                                    <Badge fontSize='0.8em' colorScheme='green'> <Text >Event Details</Text></Badge>
                                                </HStack>
                                                <HStack w='100%' justifyContent='space-between'>
                                                    <Text>Event Name:</Text>
                                                    <Input
                                                        htmlSize={25}
                                                        variant='flushed'
                                                        width="60"
                                                        borderColor={useColorModeValue('gray.800', 'gray.400')}
                                                        value={_scannedEventPass?.name}
                                                        isDisabled={true}
                                                    />
                                                </HStack>
                                                <HStack w='100%' justifyContent='space-between'>
                                                    <Text>Event Date:</Text>
                                                    <Input
                                                        htmlSize={25}
                                                        variant='flushed'
                                                        width="60"
                                                        borderColor={useColorModeValue('gray.800', 'gray.400')}
                                                        value={_scannedEventPass?.date}
                                                        isDisabled={true}
                                                    />
                                                </HStack>
                                                <HStack w='100%' justifyContent='space-between'>
                                                    <Text>Event Location:</Text>
                                                    <Input
                                                        htmlSize={25}
                                                        variant='flushed'
                                                        width="60"
                                                        borderColor={useColorModeValue('gray.800', 'gray.400')}
                                                        value={_scannedEventPass?.location}
                                                        isDisabled={true}
                                                    />
                                                </HStack>
                                                <HStack w='100%' justifyContent='space-between'>
                                                    <Badge fontSize='0.8em' colorScheme='green'> <Text >Event Criteria</Text></Badge>
                                                </HStack>
                                                {_scannedEventPass!.criteria.length>0 ?
                                                    <List w='100%' spacing='5' fontSize='sm'>
                                                                {_scannedEventPass?.criteria.map((criteria,index) => (
                                                                    <ListItem key={index} wordBreak='break-all'>
                                                                            
                                                                            <ListIcon   as={_criteriaVerficationResults && _criteriaVerficationResults[index]?FaCheckCircle:AiFillCloseCircle} 
                                                                                        color={_criteriaVerficationResults && _criteriaVerficationResults[index]?'green.500':'red.500'} />
                                                                            
                                                                            Participant need to have {criteria.minTokenQuantity} {criteria.assetType} of {criteria.tokenName?criteria.tokenName:criteria.contractAddress} on {criteria.chainId} chain.
                                                                            {criteria.tokenId ?
                                                                            <Input
                                                                                htmlSize={25}
                                                                                mx='2'
                                                                                variant='flushed'
                                                                                width='60'
                                                                                borderColor={useColorModeValue('gray.800', 'gray.400')}
                                                                                value={criteria.tokenId}
                                                                                isDisabled={true}
                                                                            />:<></>}
                                                                    </ListItem>
                                                                ))}
                                                    </List>
                                                    :<Text fontSize='md'>No Criteria, {_scannedEventPass?.name} open for all</Text>
                                                }
                                                
                                                
                                                
                                                </VStack>
                                                </>
                                                :<>
                                                
                                                </>}
                                                {_verificationResult == 'success' ?
                                                    <VStack>
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
                                                    </VStack>
                                                    :<></>
                                                }
                                                 {_verificationResult == 'failed' ?
                                                    <VStack>
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
                                                                    Invalid Event Pass. All criteria's not met.
                                                                </AlertDescription>
                                                        </Alert>
                                                    </VStack>
                                                    :<></>
                                                }

                                            
                                            </VStack>
                                        </VStack>
                                    </HStack>
                                    <AlertDialog
                                        isOpen={isOpen}
                                        leastDestructiveRef={_videoRequestRef}
                                        onClose={onClose}
                                    >
                                        <AlertDialogOverlay>
                                        <AlertDialogContent>
                                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                            Scan QR Code
                                            </AlertDialogHeader>

                                            <AlertDialogBody>
                                            This will need camera access to scan QR Code.
                                            </AlertDialogBody>

                                            <AlertDialogFooter>
                                            <Button mx='2' onClick={onClose} colorScheme='red'>
                                                Cancel
                                            </Button>
                                            <Button mx='2' onClick={() => {
                                                    onClose()
                                                    setScanQrCode(true)
                                                    setScannedEventPass(undefined)
                                                    setVerificationResult('')
                                                }}
                                                colorScheme='green'>
                                                Proceed
                                            </Button>
                                                                
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                        </AlertDialogOverlay>
                                    </AlertDialog>
                               
                            </>}
                
                
                        
                
                <VStack>
                    <Text fontSize='2xs'>Saved Event Config : {_appEventConfigs.length} </Text>
                </VStack>
            </VStack>
            
        </Flex>
          
      
    )
    
}

export default ParticipantsVerifier


