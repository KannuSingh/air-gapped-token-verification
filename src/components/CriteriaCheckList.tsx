import React from "react"
import {  useState } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import { hexlify } from "ethers/lib/utils"
import { Box, Heading, Input, VStack,  Button, Text, HStack, StackDivider, ListItem,  Checkbox, Select, OrderedList, Center, useColorModeValue, Icon, Slide, FormControl, FormLabel, FormHelperText, Badge, IconButton, InputGroup, InputRightElement, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, RadioGroup, Stack, Radio, List, ListIcon } from "@chakra-ui/react"
import { getERC721Contract, getProvider } from "../utils/utility"
import { Criteria, EventConfiguration } from "./EventOrganizer"
import { MdCheckCircle } from "react-icons/md"

interface CriteriaCheckList{
    eventConfig: EventConfiguration
    metaMaskConnected:boolean
    accounts:string[]
    isOpen:boolean
    generatePass(updatedEventConfig:EventConfiguration):void
    handleWalletConnection():void
    onClose():void
}

    function CriteriaCheckList({eventConfig,metaMaskConnected,accounts,isOpen,handleWalletConnection, generatePass, onClose }:CriteriaCheckList) {
    const [_tokenIds,setTokenIds] = useState<string[]>([...Array(eventConfig.criteria.length).fill('')])

   

    const handleTokenIdValue =(index,value)=>{
        var tempIdsValue = [..._tokenIds]
        tempIdsValue[index] = value
        setTokenIds(tempIdsValue)
    }

    const isCheckListCompleted = () =>{
        
       return  eventConfig.criteria.filter((criteria,index) =>{
                criteria.assetType=='ERC721' && _tokenIds[index]==''
        }).length == 0
    }
   
    const handlePassGeneration =() =>{
        if(isCheckListCompleted()){
            var updatedEventConfig = eventConfig
            var updatedCriterias = updatedEventConfig.criteria.map((criteria,index) =>{
                if(criteria.assetType=='ERC721' && _tokenIds[index]!=''){
                    var updatedcriteria :Criteria ={
                            ...criteria,
                            tokenId:_tokenIds[index]
                    }
                    console.log("Updated : "+JSON.stringify(updatedcriteria))
                    return updatedcriteria
                }
                else{
                  return criteria
                }
            
        })
        console.log("All Criteria's after update: "+JSON.stringify(updatedCriterias))
        updatedEventConfig = {...updatedEventConfig , criteria:updatedCriterias}
        console.log(updatedEventConfig)
        generatePass(updatedEventConfig) 
        }

    }
   
  
    return (
        
        <Modal size='2xl' isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent  fontFamily="monospace"  bg={useColorModeValue('gray.200', 'gray.800')}>
            <ModalHeader>Complete Event Pass Checklist</ModalHeader>
            <ModalCloseButton />
            <ModalBody fontSize="sm">
                <VStack>
                    <List spacing={4}>
                        {metaMaskConnected?
                            <ListItem key='0' wordBreak='break-all'> 
                                <ListIcon as={MdCheckCircle} color='green.500' />
                                Wallet Connected : <b>{accounts[0]}</b> 
                            </ListItem>
                            :
                            <ListItem key='0' wordBreak='break-all'>
                                <ListIcon as={MdCheckCircle} color='red.500' />
                                Please connect your wallet.<Button colorScheme='blue' onClick={handleWalletConnection}>Connect</Button>
                            </ListItem>    
                        }

                        {eventConfig.criteria.map((criteria,index) => (
                            
                            <ListItem key={index} wordBreak='break-all' display={criteria.assetType=='ERC721'?'list-item':'none'}>
                                
                                {_tokenIds[index]!=''
                                    ?<ListIcon as={MdCheckCircle} color='green.500' />
                                    :<ListIcon as={MdCheckCircle} color='red.500' />
                                }
                                Event <b>{eventConfig.name}</b> require you to hold total {criteria.minTokenQuantity} token of <b> {criteria.contractAddress}</b> {criteria.assetType}.
                                <Input
                                    htmlSize={25}
                                    mx='2'
                                    variant='flushed'
                                    width='60'
                                    borderColor={useColorModeValue('gray.800', 'gray.400')}
                                    value={_tokenIds[index]}
                                    onChange={(e) => handleTokenIdValue(index,e.target.value)}
                                    placeholder='Token Id you hold'
                                />
                                
                            </ListItem>
                        ))}
                        
                                                            
                    </List>
                   
                                                    
                </VStack>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button colorScheme='blue' onClick={handlePassGeneration} isDisabled={!metaMaskConnected || accounts.length<0 || !isCheckListCompleted()}>Submit 
                </Button>
                                               
                 
            </ModalFooter>
            </ModalContent>
            </Modal>
                        
                
          
        
    )
}

export default CriteriaCheckList


