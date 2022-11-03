import React from "react"
import {  useState } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import { hexlify } from "ethers/lib/utils"
import { Box, Heading, Input, VStack,  Button, Text, HStack, StackDivider, ListItem,  Checkbox, Select, OrderedList, Center, useColorModeValue, Icon, Slide, FormControl, FormLabel, FormHelperText, Badge, IconButton, InputGroup, InputRightElement, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, RadioGroup, Stack, Radio } from "@chakra-ui/react"
import { getERC20Contract, getERC721Contract, getProvider } from "../utils/utility"
import { Criteria } from "./EventOrganizer"

interface ParticipantCriteriaFormProps{
    criteriaList : Criteria[]
    isOpen:boolean
    onClose():void
}

function ParticipantCriteriaForm({criteriaList, isOpen, onClose }:ParticipantCriteriaFormProps) {
   const [_contractAddress, setContractAddress] = useState('')
   const [_minTokenQuantity, setMinTokenQuantity] = useState('1')
   const [_assetType, setAssetType] = useState('ERC721')
   const [_chainId, setChainId] = useState('137')
   const [_configurationData,setConfigurationData] = useState('')
   const [_contractName, setContractName] = useState('')
   const [_contractSymbol, setContractSymbol] = useState('')

   

    const handleClear =()=>{
        setContractAddress('')
        setMinTokenQuantity('1')
        setAssetType('ERC721')
        setChainId('137')
        setContractName('')
        setContractSymbol('')
        setConfigurationData('')
    }

    const getContractDetails =async (_contractAddress)=> {
        console.log("Getting Contract Details")
        const ethereum = (await detectEthereumProvider()) as any
        try{
            const provider = getProvider(_chainId)
            console.log(provider)
            if(_assetType=='ERC721'){
                const erc721Contract = getERC721Contract(provider,_contractAddress)
                const name = await erc721Contract.name()
                setContractName(name)
                const symbol = await erc721Contract.symbol()
                setContractSymbol(symbol)
                console.log(`${name} has symbol of ${symbol} `)
            }else if(_assetType=='ERC20'){
                const erc20Contract = getERC20Contract(provider,_contractAddress)
                const name = await erc20Contract.name()
                setContractName(name)
                const symbol = await erc20Contract.symbol()
                setContractSymbol(symbol)
                console.log(`${name} has symbol of ${symbol} `)
            }
            
            
        }
        catch(e){

            console.log(e)
        }

    }

    const handleAddCriteria =() =>{
        const _criteria :Criteria = {
            contractAddress: _contractAddress,
            assetType: _assetType,
            chainId: _chainId,
            minTokenQuantity: _minTokenQuantity
        } 
        criteriaList.push(_criteria)
        handleClear()
        onClose();
    }
  
    return (
        
        <Modal size='xl' isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent  fontSize="xl" fontFamily="monospace"  bg={useColorModeValue('gray.200', 'gray.800')} >
                <ModalHeader>Criteria</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <HStack w='100%' justifyContent='space-between'> 
                        <Text>Asset Type</Text>
                        <RadioGroup onChange={setAssetType} value={_assetType}>
                            <Stack direction='row'>
                                <Radio borderColor={useColorModeValue('gray.800', 'gray.400')} value="ERC721">ERC721</Radio>
                                <Radio borderColor={useColorModeValue('gray.800', 'gray.400')} value='ERC20'>ERC20</Radio>
                            </Stack>
                        </RadioGroup>
                        
                    </HStack>
                                    <HStack w='100%' justifyContent='space-between'>
                                        <Text>Network Chain</Text>
                                        <Select  borderColor={useColorModeValue('gray.800', 'gray.400')} variant='flushed' width="60" value={_chainId} placeholder='Select a network chain' onChange={(e) => setChainId(e.target.value)}>
                                            <option value="137">Polygon Mainnet</option>
                                            <option value="5">Goerli Testnet</option>
                                        </Select>
                                    </HStack>
                                    <HStack w='100%' justifyContent='space-between'>
                                    <Text>Contract Address</Text>
                                    <InputGroup size='md' width="60">
                                        <Input
                                            htmlSize={50}
                                            //pr={_chainId!=''?'4.5rem':''}
                                            variant='flushed'
                                            borderColor={useColorModeValue('gray.800', 'gray.400')}
                                            placeholder="Contract Address"
                                            value={_contractAddress}
                                            onChange={(e) => {
                                                setContractAddress(e.target.value)
                                            }}
                                        
                                        />
                                        {/*_chainId!=''
                                        ?<>
                                            <InputRightElement width='4.5rem'>
                                                <Button size='xs' onClick={getContractDetails}>
                                                    validate
                                                </Button>
                                            </InputRightElement>
                                        </>:<></>*/}
                                        
                                    </InputGroup>
                                        
                                    </HStack>
                                    <HStack w='100%' justifyContent='space-between'>
                                    <Text>Min Token Quantity</Text>
                                        <Input
                                            htmlSize={25}
                                            textAlign='end'
                                            variant='flushed'
                                            borderColor={useColorModeValue('gray.800', 'gray.400')}
                                            width="60"
                                            placeholder="Min Quantity Of Token To Hold"
                                            value={_minTokenQuantity}
                                            type='number'
                                            onChange={(e) => setMinTokenQuantity(e.target.value)}
                                        />
                                    </HStack>
                                    
                </ModalBody>

                <ModalFooter >
                    <Button mx={2} onClick={handleClear}>Clear</Button>
                    <Button mx={2} variant='outline' colorScheme='green' onClick={handleAddCriteria}>Add</Button>
                </ModalFooter>
            </ModalContent>
                                
        </Modal>
                        
                
          
        
    )
}

export default ParticipantCriteriaForm


