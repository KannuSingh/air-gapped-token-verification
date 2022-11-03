import React from "react"
import { useEffect, useState } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import { Box, Heading, Input, VStack, Link, Button, Text, HStack, StackDivider, List, ListItem, Checkbox, Select, Center, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, OrderedList, ListIcon, Alert, AlertIcon, AlertTitle, AlertDescription, Flex, useColorModeValue, Badge, Switch, Divider } from "@chakra-ui/react"
import { Link as RouterLink, useLocation, useParams } from "react-router-dom"
import QRCode from "react-qr-code";
import { QrReader } from "react-qr-reader"
import { getERC1155Contract, getERC20Contract, getERC721Contract, getProvider } from "../utils/utility"
import { Criteria, EventConfiguration } from "./EventOrganizer"
import { FaCheckCircle } from "react-icons/fa"
import CriteriaCheckList from "./CriteriaCheckList"
import { useSelector } from "react-redux"
import { selectEventConfig } from "../appdata/dataSlice/eventConfigSlice"

const useQuery = () => new URLSearchParams(useLocation().search);

enum Permission{
    GRANTED, NOTGRANTED, WAITING
}

export interface EventPass{
    eventConfiguration: string
    signature:string
}

function EventPassGenerator() {
    const _appEventConfigs = useSelector(selectEventConfig)
    let query = useQuery();
    let scan = query.get('scan')
    let _eventIndex = query.get('eventId')
    const [_accounts,setAccounts] = useState<string[]>([])
    const [_metaMaskConnected,setMetaMaskConnected] = useState(false)
    const [_eventConfig, setEventConfig] = useState<EventConfiguration>()
    const [_scanQrCode,setScanQrCode] = useState<boolean>(false)
    const [_cameraPermissionStatus,setCameraPermissionStatus]  = useState<Permission>(Permission.WAITING)
    const [_scannedDetails,setScannedDetails]= useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [_passValue,setPassValue] = useState('')
    
   useEffect(()=>{
        if (scan && _eventIndex==null && 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            try{
                var cameraPermission = navigator.mediaDevices.getUserMedia({video: true})
                cameraPermission
                    .then(()=> {
                        setCameraPermissionStatus(Permission.GRANTED)
                        setScanQrCode(true)
                    })
                    .catch((e)=>{
                    setCameraPermissionStatus(Permission.NOTGRANTED)
                })

            }catch(e){
                //Permission for camera not granted
                
                
            }
        }else if(_eventIndex!=null){
            console.log(" When scan is not passed as query data ")
            setEventConfig(_appEventConfigs[_eventIndex!])
            
        }
   },[_cameraPermissionStatus])
    
    const handleQRScannerResult = (result, error) => {
        if (!!result) {
            const qrCodeData :EventConfiguration= JSON.parse(result?.getText())
            setScanQrCode(false)
            setEventConfig(qrCodeData)
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
           // setContractName(name)
            const symbol = await erc721Contract.symbol()
           // setContractSymbol(symbol)
            console.log(`${name} has symbol of ${symbol} `)
        }
        catch(e){

            console.log(e)
        }

    }

    
    const handlePassGeneration = async (eventConfig:EventConfiguration)=>{
            try{
                console.log(`final event config : ${JSON.stringify(eventConfig)}`)
                const ethereum = (await detectEthereumProvider()) as any
                var signature: string = await ethereum.request({
                    method: "personal_sign",
                    params: [JSON.stringify(eventConfig), _accounts[0]]
                })
                var finalPassData:EventPass={
                    eventConfiguration:JSON.stringify(eventConfig),
                    signature:signature
                }
                   
                setPassValue(JSON.stringify(finalPassData))
                console.log(`final pass : ${JSON.stringify(finalPassData)}`)
                console.log(JSON.stringify(finalPassData).length)
                onClose()
            }catch(e){
                console.log(e)
            }
        

    }
    const handleWalletConnection = async () =>{
        //console.log("handleMetaMaskConnect : " + _chainId)
        const ethereum = (await detectEthereumProvider()) as any
        if (ethereum) {
            try{
            /*await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: hexlify(Number(_chainId!)).replace("0x0", "0x")
                    }
                ]
            })*/
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
            ctx!.fillText(_eventConfig!.name,canvas.width/2,img.height+40)
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
        setPassValue('')
       // setScannedDetails('')
        setEventConfig(undefined)
        setScanQrCode(true)
    }
    
   
   
    return (
        
        <Flex justify='center' align='start' minH='80vh' my={6} bg={useColorModeValue('gray.200', 'gray.800')} mt='20' >
             <VStack w='90%' p='3'm='2'  justify='space-between' spacing={5}>
            {_cameraPermissionStatus == Permission.WAITING && _eventIndex==null
                ? <>
                    <Center>
                    <Button 
                        disabled
                        variant='ghost'
                        isLoading
                        loadingText="Waiting for camera access"
                        >
                    </Button>
                    </Center>
                </> 
            
            : <>
                {_cameraPermissionStatus == Permission.NOTGRANTED && _eventIndex==null
                    ? <>
                        <Alert status='error'>
                            <AlertIcon />
                            <AlertTitle>Camera Access Blocked.</AlertTitle>
                            <AlertDescription>Will not be able to scan QRCode.</AlertDescription>
                        </Alert>

                    </>

                    :<>
                        <Heading size='lg'><Center >Event Pass Generator</Center></Heading>
                        <HStack justifyContent='space-between' spacing={6} align="start" p="3" borderWidth={1} borderColor="gray.500" borderRadius="4px">
                           
                            {_eventConfig != undefined
                                ? <>
                                    <VStack w='100%' alignItems="start" p="6" >
                                        <HStack w='100%' justifyContent='end'>
                                            <Button mx={2} onClick={handleClear} colorScheme='blue'>New</Button>
                                            <Button mx={2} onClick={handleClear} colorScheme='red'>Discard</Button>
                                            {_passValue==''?
                                                <Button mx={2} colorScheme='green' onClick={onOpen}>Generate Event Pass</Button>
                                            :<></>
                                            }   
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
                                                value={_eventConfig?.name}
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
                                                value={_eventConfig?.date}
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
                                                value={_eventConfig?.location}
                                                isDisabled={true}
                                            />
                                        </HStack>
                                        <HStack w='100%' justifyContent='space-between'>
                                            <Badge fontSize='0.8em' colorScheme='green'> <Text >Event Criteria</Text></Badge>
                                        </HStack>
                                        {_eventConfig!.criteria.length>0 ?
                                            <List w='100%' spacing='5' fontSize='sm'>
                                                        {_eventConfig!.criteria.map((criteria,index) => (
                                                            <ListItem key={index} wordBreak='break-all'>
                                                                    <ListIcon as={FaCheckCircle} />
                                                                    Participant need to have {criteria.minTokenQuantity} {criteria.assetType} of {criteria.tokenName?criteria.tokenName:criteria.contractAddress} on {criteria.chainId} chain.
                                                            </ListItem>
                                                        ))}
                                            </List>
                                            :<Text fontSize='md'>No Criteria, {_eventConfig?.name} open for all</Text>
                                        }
                                        
                                        <HStack w='100%' justifyContent='space-between' spacing={3}>
                                            <CriteriaCheckList generatePass={handlePassGeneration} eventConfig={_eventConfig!} isOpen={isOpen} onClose={onClose} metaMaskConnected={_metaMaskConnected} accounts={_accounts} handleWalletConnection={handleWalletConnection} />
                                            
                                        </HStack>
                                        
                                        
                                    </VStack>
                                </> 
                                : <></>
                            }
                            
                            
                            
                                {
                                    _scanQrCode?
                                        <VStack w='100%'>
                                            <Box w='70vh'>
                                                <QrReader
                                                    onResult={handleQRScannerResult} constraints={{ facingMode: 'user' }}  
                                                    containerStyle={{ width: '100%' }}                           
                                                />
                                            </Box>
                                        </VStack>
                                    :
                                    <></>
                                }
                            
                            
                                
                                {
                                    _passValue!=''?
                                    <>
                                    <VStack w='100%' spacing={2}>
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
                                        <Box p='3' borderWidth={1} borderColor="gray.500" bg='white' borderRadius="4px">
                                            <QRCode id="QRCode" viewBox={`0 0 256 256`} value={_passValue}/>
                                        </Box>
                                        {_passValue!=''?<Button onClick={onImageCownload} >Download Event Pass</Button>:''}
                                        </VStack>
                                    </>
                                    :
                                    <></>
                                }
                            
                        </HStack>
                    
                    </>}
            
            </>}
            
                
            </VStack>
            
        </Flex>
          
      
    )
    
}

export default EventPassGenerator
