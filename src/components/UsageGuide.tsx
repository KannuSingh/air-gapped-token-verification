import React from "react"
import {
    Box,
    Center,
    Code,
    Heading,
    HStack,
    Link,
    ListItem,
    OrderedList,
    Text,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react"


function UsageGuide() {

    return (
        <Center 
            bg={useColorModeValue('gray.200', 'gray.550')}
            mt='20'
            >
            <Box w='90%' p='3'm='2' borderWidth={1} borderColor="gray.500" borderRadius="4px">
               
                
                <VStack  align="center" p={2}>
                    <Heading as='h3'>Usage Guide</Heading>
                    <Text>
                    The application is divided into three sections
                    <OrderedList>
                        <ListItem>Creating Event Configuration</ListItem>
                        <ListItem>Generating Event Pass</ListItem>
                        <ListItem>Verifying the generated Event Pass</ListItem>
                    </OrderedList>
                    <br/> 
                    <Heading as='h2'>Creating the Event Configuration</Heading>
                    <Text fontSize='lg'>
                    This will be mainly used by someone who is an organized of any event and create some requirement for the event participants.
        A sample event configuration looks like this for example, Devcon VI require participant to have an NFT(ERC721) of Buildspace contract on polygon mainnet(chain id :137). Similarly you can create configuraion for requirement of holding some 'x' amount or tokens(ERC20).

                    </Text>
                    <Code children='{
                        "name": "DevconVI",
                        "assetType": "ERC721",
                        "chain": "137",
                        "contractAddress": "0x3CD266509D127d0Eac42f4474F57D0526804b44e",
                        "quantity": "1"
                        }' />
                        <Text fontSize='lg'>
                        On the platform under create tab you will find a sample event configuration form.<br/>
                        Once event organizer create a event configuration by clicking create button, QRCode will get generated and available to download. The event organizer can use this QRCode in their website or any other promotional platform. These details can also be aggregated by third party website which can easily provide it to user by searching event by event name or other filters.
                        </Text> 
                        <br/> 

                        <Heading>Generating Event Pass</Heading>

                        <Text fontSize='lg'>
                        Any interested participant who wants to join/attend the can take the screenshot of Event QRcode and generate Event Pass for themselves if they want to attend and think they fulfill the event requirements. On the platform under Generate tab you will find a sample event pass generator. User can search event in dropdown(currently not implemented) or by scanning the Event QRCode(implemented).<br/><br/>
                        After scanning QR Code details for event will be shown and user will have the option for generating the Event Pass.<br/>
                        When user click on generate pass, if the event requires an NFT (ERC721) then user will have to enter the NFT Token Id to generate the Event Pass and then sign the data with the wallet account that have the required NFT. This is completely offline process and user private key will not be exposed.<br/>
                        After signing the data user's event pass will be get generated and ready to be downloaded. User just need to bring this Event Pass QRCode with them on event day.
                        
                        </Text>
                        <br/> 
        <Heading>Verifying the generated Event Pass</Heading>
        <Text fontSize='lg'>On scanning the event pass the verifier will show the result of verification. It is under verify tab </Text>

                    
                    </Text>
                </VStack>
                
            </Box>
        </Center>
    )
}

export default UsageGuide
