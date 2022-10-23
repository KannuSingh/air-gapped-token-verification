import React from "react"
import {  useState } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import { hexlify } from "ethers/lib/utils"
import { Box, Heading, Input, VStack,  Button, Text, HStack, StackDivider, ListItem,  Checkbox, Select, OrderedList, Center } from "@chakra-ui/react"
import QRCode from "react-qr-code";
import { getERC721Contract, getProvider } from "../utils/utility"

function NewEventConfiguration() {
   const [_eventName, setEventName] = useState('')
   const [_nftContractAddress, setNftContractAddress] = useState('')
   const [_tokenContractAddress, setTokenContractAddress] = useState('')
   const [_minTokenQuantity, setMinTokenQuantity] = useState('1')
   const [_assetType, setAssetType] = useState('')
   const [_chainId, setChainId] = useState('137')
   const [_configurationData,setConfigurationData] = useState('')
   const [_contractName, setContractName] = useState('')
   const [_contractSymbol, setContractSymbol] = useState('')
   

    const handleClear =()=>{
        setEventName('')
        setNftContractAddress('')
        setTokenContractAddress('')
        setMinTokenQuantity('')
        setAssetType('')
        setChainId('')
        setContractName('')
        setContractSymbol('')
        setConfigurationData('')
    }

    const getNFTDetails =async (_contractAddress)=> {
        console.log("Getting ERC721 Details")
        const ethereum = (await detectEthereumProvider()) as any
        try{
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: hexlify(Number(_chainId!)).replace("0x0", "0x")
                    }
                ]
            })
            setChainId(_chainId);

        
            const provider = getProvider(_chainId)
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
    const handleCreateConfiguration =async ()=> {
        console.log("Creating configuration")
        const _contractAddress = (_assetType=="ERC721")?_nftContractAddress:(_assetType=="ERC20"?_tokenContractAddress:'')
        const configurationJson = {
            name:_eventName,
            assetType:_assetType,
            chain:_chainId,
            contractAddress:_contractAddress,
            quantity:_minTokenQuantity
        }
        console.log(JSON.stringify(configurationJson))
        setConfigurationData(JSON.stringify(configurationJson))


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
        
        <Center my={6}>
            <HStack w='90%'  align="start" p="2" divider={<StackDivider borderColor='gray.200' />} borderWidth={1} borderColor="gray.500" borderRadius="4px">
                <VStack w='45%' spacing={5}>
                    <Heading size='lg' >New Event Configuration</Heading>
                        
                            <VStack alignItems="start" p="5" borderWidth={1} borderColor="gray.500" borderRadius="4px">
                                <HStack w='100%' justifyContent='space-between'>
                                    <Text>Enter Event Name:</Text>
                                    <Input
                                        htmlSize={25}
                                        width="auto"
                                        placeholder="Event Name"
                                        value={_eventName}
                                        onChange={(e) => setEventName(e.target.value)}
                                    />
                                </HStack>
                                <HStack w='100%' justifyContent='space-between'> 
                                    <Text>Accepting Asset Type:</Text>
                                    <HStack>
                                        <Checkbox value="ERC721" colorScheme='green' isChecked={_assetType=="ERC721"?true:false} onChange={(e) => setAssetType(e.target.value)}> 
                                            ERC721
                                        </Checkbox>
                                        <Checkbox value='ERC20' colorScheme='green' isChecked={_assetType=="ERC20"?true:false} onChange={(e) => setAssetType(e.target.value)}>
                                            ERC20
                                        </Checkbox>
                                    </HStack>
                                </HStack>
                                <HStack w='100%' justifyContent='space-between'>
                                    <Text>Network Chain</Text>
                                    <Select w='50%' value={_chainId} onChange={(e) => setChainId(e.target.value)}>
                                        <option value=''>Select a network chain</option>
                                        <option value="137">Polygon Mainnet</option>
                                    </Select>
                                </HStack>
                                <HStack w='100%' justifyContent='space-between'>
                                    <Text>Token Contract Address:</Text>
                                    <Input
                                        htmlSize={25}
                                        width="auto"
                                        placeholder="Token Contract Address"
                                        value={_tokenContractAddress}
                                        onChange={(e) => setTokenContractAddress(e.target.value)}
                                        isDisabled={_assetType!="ERC20"}
                                    />
                                </HStack>
                                <HStack w='100%' justifyContent='space-between'>
                                <Text>Min Token Quantity:</Text>
                                    <Input
                                        htmlSize={25}
                                        width="auto"
                                        placeholder="Min Quantity Of Token To Hold"
                                        value={_minTokenQuantity}
                                        onChange={(e) => setMinTokenQuantity(e.target.value)}
                                        isDisabled={_assetType!="ERC20"}
                                    />
                                </HStack>
                                <HStack w='100%' justifyContent='space-between'>
                                <Text>Enter NFT Contract Address:</Text>
                                    <Input
                                        htmlSize={25}
                                        width="auto"
                                        placeholder="NFT Contract Address"
                                        value={_nftContractAddress}
                                        onChange={(e) => {
                                            setNftContractAddress(e.target.value)
                                            if(e.target.value.length==42){
                                                getNFTDetails(e.target.value)
                                            }
                                        }}
                                        isDisabled={_assetType!="ERC721"}
                                    />
                                </HStack>
                                <HStack w='100%' justifyContent='end'>
                                    <Button onClick={handleClear}>Clear</Button>
                                    <Button onClick={handleCreateConfiguration} colorScheme="green">Create</Button>
                                </HStack>
                                
                            </VStack>
                        <Box py="2">
                            
                                {_contractName!='' && _contractSymbol!=''?
                                <VStack>
                                    <Text>Contract Details</Text>
                                    <Text>Name: {_contractName}</Text>
                                    <Text>Symbol: {_contractSymbol}</Text>
                                </VStack>
                                :''}
                            
                        </Box>
                    
                </VStack>
                <VStack  w='45%'  alignItems="center" justify='center' spacing={5} >
                    <Heading size='lg' >Steps to follow</Heading>
                    
                    <OrderedList>
                        <ListItem>Download the event QRCode</ListItem>
                        
                    </OrderedList>
                    <Box borderWidth={1} borderColor="gray.500" borderRadius="4px">
                        <QRCode id="QRCode" viewBox={`0 0 256 256`} value={_configurationData}/>
                    </Box>
                    {_configurationData!=''?<Button onClick={onImageCownload} >Download QR</Button>:''}
                </VStack>
            </HStack>
        </Center>
        
    )
}

export default NewEventConfiguration


