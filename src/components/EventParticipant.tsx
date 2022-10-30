import React from "react"
import {  useState } from "react"
import { Box, Heading, Input, VStack,  Button, Text, HStack, StackDivider, ListItem,  Checkbox, Select, OrderedList, Center, useColorModeValue, Icon, Slide, FormControl, FormLabel, FormHelperText, Badge, IconButton, InputGroup, InputRightElement, useDisclosure, List, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux";
import { addConfiguration, selectEventConfig } from "../appdata/dataSlice/eventConfigSlice";
import { NavLink, useNavigate } from "react-router-dom";



function EventParticipant() {
    const _appEventConfigs = useSelector(selectEventConfig)
    const [_selectedEventIndex,setSelectedEventIndex] =useState('')
    const [_scanQrCode,setScanQrCode] = useState(false)
    const navigate = useNavigate()


    const { isOpen, onOpen, onClose } = useDisclosure()
    const _videoRequestRef = React.useRef<HTMLDivElement>(null)
    
    
    const handleSelectEvent = () =>{

    }
 
    return (
        
        <Center my={6}
            bg={useColorModeValue('gray.200', 'gray.800')}
            mt='20'
            minH='80vh'
        >
            <HStack w='90%'align="start"  justify='space-between' >
                
                <VStack w='100%'  p='3'm='2' spacing='10' >
                    <VStack spacing='4'> 
                            <HStack h='6' spacing='4'>
                            <Text>Select the event </Text>
                            <Select  borderColor={useColorModeValue('gray.800', 'gray.400')} 
                                variant='flushed' 
                                width="60" 
                                value={_selectedEventIndex}
                                onChange={(e) => {
                                  setSelectedEventIndex(e.target.value)
                                  navigate('/eventpassgenerator?eventId='+e.target.value)
                                }}
                                >
                                <option key={0} value="" disabled ></option>
                                {_appEventConfigs.map((eventconfig,index)=>(
                                  <option key={index+99} value={''+index}>{eventconfig.name}</option>
                                ))}

                            </Select>
                            
                            </HStack>
                            <Text>OR</Text>
                            <HStack>
                            <Button 
                                colorScheme='blue' 
                                _hover={{
                                    cursor: "pointer",
                                    fontWeight: "semibold",
                                    transform: 'scale(1.5)',
                                    }}
                                    onClick={onOpen}
                                    >
                                    <Text 
                                        fontSize='2xl'
                                        style={{ textDecoration: 'underline' }}
                                    >
                                    Scan
                                </Text>
                            </Button>
                            <Text>Event Code</Text>
                            </HStack>
                    </VStack>
                    
                    <VStack>
                        <Text fontSize='2xs'>Saved Event Config : {_appEventConfigs.length} </Text>
                    </VStack>
                </VStack>

            <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={_videoRequestRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Scan QR Code
            </AlertDialogHeader>

            <AlertDialogBody>
              This will need camera access to scan QR Code.
            </AlertDialogBody>

            <AlertDialogFooter>
            <Button mx='2' onClick={onClose} colorScheme='red'>
                Cancel
              </Button>
              <Button mx='2' onClick={() => navigate('/eventpassgenerator?scan=true')} colorScheme='green'>
                Proceed
              </Button>
                                
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>


               
                
            </HStack>
        </Center>
        
                
          
        
    )
}

export default EventParticipant


