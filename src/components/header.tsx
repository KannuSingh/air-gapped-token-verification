import React from "react"
import { NavLink as RouterLink } from "react-router-dom"
import {
    Button,
    Heading,
    HStack,
   
} from "@chakra-ui/react"


function Header() {

    return (
        <HStack align="center" p={2}>
            <HStack w='50%' alignSelf="center" spacing="2">
                <Heading as="h2">Air-Gapped-Verification</Heading>
            </HStack>

            <HStack alignSelf="center" spacing="5">
            <Button
             as={RouterLink}
            fontSize={'sm'}
            fontWeight={400}
            variant={"link"}
            to={'/'}>
            Home
          </Button>
          <Button
            as={RouterLink}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            to={"/newEventConfiguration"}>
            Create Event Configuration
          </Button>
          <Button
            as={RouterLink}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            to={"/passGenerator"}>
            Generate Event Pass
          </Button>
          <Button
            as={RouterLink}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            to={"/verifyParticipants"}>
            Verify Event Pass
          </Button>
                
               
            </HStack>
        </HStack>
    )
}

export default Header
