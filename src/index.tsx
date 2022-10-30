import { Box, ChakraProvider, ColorModeScript, HStack, Icon, Text, theme, useColorModeValue, VStack } from "@chakra-ui/react"
import React from "react"
import { createRoot } from "react-dom/client"
import { FaGithub, FaHeart } from "react-icons/fa"
import { Provider } from "react-redux"
import { HashRouter, Link, Route, Routes } from "react-router-dom"
import persistStore from "redux-persist/es/persistStore"
import { PersistGate } from "redux-persist/integration/react"
import store from "./appdata/store"
import EventOrganizer from "./components/EventOrganizer"
import EventParticipant from "./components/EventParticipant"
import EventPassGenerator from "./components/EventPassGenerator"
import Header from "./components/header"
import Main from "./components/Main"
import NewEventConfiguration from "./components/NewEventConfiguration"
import ParticipantsVerifier from "./components/ParticipantsVerifier"
import UsageGuide from "./components/UsageGuide"



function App() {
    return (
        <>
        <HashRouter>
        <Box minH="100vh" fontSize="xl" fontFamily="monospace"  bg={useColorModeValue('gray.200', 'gray.800')}>
            <Header/>
            <hr />
            <Routes>
            <Route path="/" element={<Main/>} />
            <Route path="/guide" element={<UsageGuide />}/>
            <Route path="/eventorganizer" element={<EventOrganizer/>} />
            <Route path="/neweventconfiguration" element={<NewEventConfiguration/>} />
            <Route path="verifyparticipants" element={<ParticipantsVerifier/>} />
            
            <Route path="/eventparticipant" element={<EventParticipant/>} />
            <Route path="/eventpassgenerator" element={<EventPassGenerator/>} />
          
                <Route
                    path="*"
                    element={
                        <main style={{ padding: "1rem" }}>
                            <p>There's nothing here!</p>
                        </main>
                    }
                />
            </Routes>
            <VStack>
                <Text>made with <Icon as={FaHeart} w='4' h='4' color='red'/></Text>
                <Text fontSize='xs'>by <Link style={{ textDecoration: 'underline' }} to='https://github.com/KannuSingh/air-gapped-token-verification'>Karandeep Singh <Icon as={FaGithub} /></Link></Text>
                
            </VStack>
            
            
        </Box>
    </HashRouter>
</>
    )
}

const root = createRoot(document.getElementById("root") as HTMLElement)
let persistor = persistStore(store)
root.render(

    <ChakraProvider theme={theme}>
        <ColorModeScript />
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </ChakraProvider>
)
