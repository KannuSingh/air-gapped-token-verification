import React from "react"
import {
    Button,
    Center,
    Flex,
    HStack,
    Link,
    Text,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react"
import { NavLink, useNavigate } from "react-router-dom"


function Main() {
    const navigate= useNavigate()


    const handleEventOrganizerSelection = () =>{
        navigate('/eventorganizer')
    }
    return (
        <Center 
            bg={useColorModeValue('gray.200', 'gray.800')}
            mt='20'
            minH='80vh'
            >
            <Flex w='90%' h='100%' p='3'm='2' align='center' justify='center' >
                <Text>{/*borderWidth={1} borderColor="gray.500" borderRadius="4px"*/}</Text>
                <VStack>
                <VStack> 
                    <HStack h='6' spacing='4'>
                    <Text>Use as </Text>
                    
                     <Button  
                        bg={useColorModeValue('gray.200', 'gray.800')} 
                        variant='ghost' 
                        onClick={handleEventOrganizerSelection}
                        _hover={{
                            cursor: "pointer",
                            fontWeight: "semibold",
                            transform: 'scale(1.5)'
                        }}
                        >   <Text fontSize='2xl'
                                style={{ textDecoration: 'underline' }}
                            >
                            Event Organiser
                        </Text>
                        </Button>  
                    
                    <Text> or  </Text>
                    <Button as={NavLink} 
                        to="/eventparticipant" 
                        bg={useColorModeValue('gray.200', 'gray.800')} 
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
                                Event Participant
                        </Text>
                         
                    </Button>
                    </HStack>
                </VStack>
                
                
                    <VStack  align="center"  p={2}>
                        <HStack m='5'>
                            <Text fontSize='md'>check  </Text>
                            <Link as={NavLink} to='/guide' style={{ textDecoration: 'underline' }}><Text>guide</Text></Link>
                        
                            <Text>    to learn more</Text>
                        </HStack>
                    </VStack>
                    
                </VStack>
                
            </Flex>
        </Center>
    )
}

export default Main
