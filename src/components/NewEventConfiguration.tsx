import React, { useRef } from "react"
import {  useState } from "react"
import { Box, Heading, Input, VStack,  Button, Text, HStack, StackDivider, ListItem,  Checkbox, Select, OrderedList, Center, Badge, useColorModeValue, IconButton, List, useDisclosure, Flex, Divider, FormControl, FormLabel, Switch } from "@chakra-ui/react"
import QRCode from "react-qr-code";
import { FaCheckCircle, FaPlus } from "react-icons/fa"
import ParticipantCriteriaForm from "./ParticipantCriteriaForm"
import { useDispatch, useSelector } from "react-redux"
import { addConfiguration, selectEventConfig } from "../appdata/dataSlice/eventConfigSlice"
import { Criteria, EventConfiguration } from "./EventOrganizer"

function NewEventConfiguration() {
    const [_criteriaList,setCriteriaList] = useState<Criteria[]>([])
    const [_eventName, setEventName] = useState('')
    const [_eventDate, setEventDate] = useState('')
    const [_eventLocation, setEventLocation] = useState('')
    const [_configurationData,setConfigurationData] = useState<EventConfiguration>()
    const refToQRCodeElement = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch()
    const { isOpen, onOpen, onClose } = useDisclosure()
   

    const handleClear =()=>{
        setEventName('')
        setEventDate('')
        setEventLocation('')
        setCriteriaList([])
        setConfigurationData(undefined)
    }

   
    const handleCreateConfiguration =()=> {
        console.log("Creating configuration")
        const configurationJson : EventConfiguration = {
            name:_eventName,
            date:_eventDate,
            location:_eventLocation,
            criteria : _criteriaList
        }
        console.log(JSON.stringify(configurationJson))
        console.log(JSON.stringify(configurationJson).length)
        setConfigurationData(configurationJson)
        refToQRCodeElement.current?.scrollIntoView({behavior: 'smooth'});

    }
    const handleSaveConfiguration =async ()=> {
        console.log("Saving configuration")
        if(_configurationData ){
            dispatch(addConfiguration(_configurationData)) 

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

    
    return (
        
        <Flex justify='center' align='start' minH='80vh' my={6} bg={useColorModeValue('gray.200', 'gray.800')} mt='20' >
            <VStack w='90%' p='3'm='2'  justify='space-between' spacing={5}>
                    <VStack w='50%' spacing={5} align='start'p={4} borderWidth={1} borderColor="gray.500" borderRadius="4px">
                        <Heading size='lg' >New Event Configuration</Heading>
                        <HStack w='100%' justifyContent='start'>
                            <Button onClick={handleClear}>Clear</Button>
                            <Button onClick={handleCreateConfiguration} colorScheme="green">Create</Button>
                            <Button onClick={handleSaveConfiguration} colorScheme="blue">Save</Button>
                        </HStack>
                                
                        <VStack w='70%'>
                            <HStack w='100%' justifyContent='space-between'>
                                <Badge fontSize='0.8em' colorScheme='green'> <Text >Event Details</Text></Badge>
                            </HStack>
                            <HStack w='100%' justifyContent='space-between'>
                                <Text>Name</Text>
                                <Input
                                    htmlSize={25}
                                    variant='flushed'
                                    width="60"
                                    placeholder="Event Name"
                                    value={_eventName}
                                    borderColor={useColorModeValue('gray.800', 'gray.400')}
                                    onChange={(e) => setEventName(e.target.value)}
                                    />  
                            </HStack>
                            <HStack w='100%' justifyContent='space-between'>
                                <Text>Date</Text>
                                <Input
                                    htmlSize={25}
                                    variant='flushed'
                                    width="60"
                                    type='datetime-local'
                                    value={_eventDate}
                                    borderColor={useColorModeValue('gray.800', 'gray.400')}
                                    onChange={(e) => setEventDate(e.target.value)}
                                    />  
                            </HStack>
                            <HStack w='100%' justifyContent='space-between'>
                                <Text>Location</Text>
                                <Input
                                    htmlSize={25}
                                    variant='flushed'
                                    width="60"
                                    placeholder="Event Location"
                                    value={_eventLocation}
                                    borderColor={useColorModeValue('gray.800', 'gray.400')}
                                    onChange={(e) => setEventLocation(e.target.value)}
                                />  
                            </HStack>
                        </VStack>
                        
                        <VStack>    
                            <HStack w='100%' spacing='5'>
                                <Badge fontSize='0.8em' colorScheme='green'> <Text >Participants Criteria</Text></Badge>
                                <IconButton icon={<FaPlus />} aria-label={"add-criteria"} onClick={onOpen}></IconButton>
                            </HStack>
                            
                            {_criteriaList.length>0 ?
                            <List w='100%' >
                                        {_criteriaList.map((criteria,index) => (
                                            <ListItem key={index} >
                                                <HStack>
                                                    <FaCheckCircle/>
                                                    <Text fontSize='md'>Participant need to have {criteria.minTokenQuantity} {criteria.assetType} of {criteria.tokenName?criteria.tokenName:criteria.contractAddress} on {criteria.chainId} chain.</Text>
                                                </HStack>
                                            </ListItem>
                                        ))}
                            </List>
                            :<Text fontSize='md'>No Criteria, {_eventName} open for all</Text>
                            }

                            <ParticipantCriteriaForm criteriaList={_criteriaList} isOpen={isOpen} onClose={onClose}/>
                        </VStack>
                    </VStack>
                
                <VStack ref={refToQRCodeElement}  w='50%'  align="center" justify='center'  spacing={5}>
                {_configurationData?
                    <Center display={_configurationData!=undefined?'block':'none'}>
                        <VStack>
                        <Text fontSize='0.8em' >Download the event QRCode</Text>
                        <Box p='3' borderWidth={1} borderColor="gray.500" bg='white' borderRadius="4px">
                            <QRCode id="QRCode" viewBox={`0 0 256 256`} value={JSON.stringify(_configurationData)}/>
                        </Box>
                        {_configurationData?<Button onClick={onImageCownload} >Download QR</Button>:''}
                        </VStack>
                    </Center>
                    :<></>
                }     
                </VStack>
            </VStack>
        </Flex>
        
    )
}

export default NewEventConfiguration


