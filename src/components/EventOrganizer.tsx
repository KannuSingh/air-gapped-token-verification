import React from "react"
import {  useState } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import { Box, Heading, Input, VStack,  Button, Text, HStack, StackDivider, ListItem,  Checkbox, Select, OrderedList, Center, useColorModeValue, Icon, Slide, FormControl, FormLabel, FormHelperText, Badge, IconButton, InputGroup, InputRightElement, useDisclosure, List } from "@chakra-ui/react"
import QRCode from "react-qr-code";
import { getERC721Contract, getProvider } from "../utils/utility"
import { FaCheckCircle, FaPlus } from "react-icons/fa"
import ParticipantCriteriaForm from "./ParticipantCriteriaForm"
import { useDispatch, useSelector } from "react-redux";
import { addConfiguration, selectEventConfig } from "../appdata/dataSlice/eventConfigSlice";
import { NavLink } from "react-router-dom";

export interface Criteria{
    contractAddress:string
    assetType:string
    chainId:string
    minTokenQuantity:string
    tokenId?:string
    tokenName? :string
}

export interface EventConfiguration{
    name:string,
    date:string,
    location:string,
    criteria : Criteria[]
}


function EventOrganizer() {
    const _appEventConfigs = useSelector(selectEventConfig)
    
    return (
        
        <Center my={6}
        bg={useColorModeValue('gray.200', 'gray.800')}
        mt='20'
        minH='80vh'
        >
               
            
            <HStack w='90%'align="start"  justify='space-between' >
            <VStack w='100%'  p='3'm='2' spacing='10' >
                <VStack> 
                        <HStack h='6' spacing='4'>
                        <Text>Get Started by creating </Text>
                        
                        <Button  
                            colorScheme='green' 
                            as={NavLink} 
                            to="/neweventconfiguration" 
                            _hover={{
                                cursor: "pointer",
                                fontWeight: "semibold",
                                transform: 'scale(1.5)'
                            }}
                            >   <Text fontSize='2xl'
                                    style={{ textDecoration: 'underline' }}
                                >
                                New
                            </Text>
                            </Button>  
                        
                        <Text> event  </Text>
                        </HStack>
                        <Text>OR</Text>
                        <HStack>
                        <Button 
                            as={NavLink} 
                            colorScheme='blue' 
                            to="/verifyparticipants" 
                            _hover={{
                                cursor: "pointer",
                                fontWeight: "semibold",
                                transform: 'scale(1.5)',
                                }}
                                >
                                <Text 
                                    fontSize='2xl'
                                    style={{ textDecoration: 'underline' }}
                                >
                                Verify 
                            </Text>
                        </Button>
                        <Text>Event Participant</Text>
                        </HStack>
                </VStack>
                
                <VStack>
                    <Text fontSize='2xs'>Saved Event Config : {_appEventConfigs.length} </Text>
                </VStack>
            </VStack>


               
                
            </HStack>
        </Center>
                
          
        
    )
}

export default EventOrganizer


