import React from "react"
import { NavLink as RouterLink, useLocation } from "react-router-dom"
import {
    Button,
    Heading,
    HStack,
    Link,
    Text,
    useColorModeValue,
    VStack,
   
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"


function Header() {
  const location = useLocation();
  const path = location.pathname
  
    return (
        <HStack 
          w='full'
          align="center" 
          justify='space-between'
          py='4'
          px='8'
          h='20'
          bg={useColorModeValue('white', 'gray.900')}
          pos='fixed'
          zIndex={999}
          >
            <HStack >
              <VStack align='center' spacing='1'>
                  <Heading as="h2">3ET</Heading>
                  <Text fontSize='2xs'>WEB3 EVENT TICKET</Text>
              </VStack>
            </HStack>

            <HStack   spacing="5">
            <Button
             as={RouterLink}
            fontSize={'sm'}
            fontWeight={400}
            variant={"link"}
            to={'/'}>
            Home
          </Button>
          
            <Button
                as={Link}
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
                href={"https://github.com/KannuSingh/air-gapped-token-verification"}>
                Guide
              </Button>
         
         
          <ColorModeSwitcher alignSelf="center" />     
               
            </HStack>
        </HStack>
    )
}

export default Header
