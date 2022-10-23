import { Box, ChakraProvider, theme } from "@chakra-ui/react"
import React from "react"
import { createRoot } from "react-dom/client"
import { HashRouter, Route, Routes } from "react-router-dom"
import EventPassGenerator from "./components/EventPassGenerator"
import Header from "./components/header"
import Main from "./components/Main"
import NewEventConfiguration from "./components/NewEventConfiguration"
import ParticipantsVerifier from "./components/ParticipantsVerifier"



function App() {
    return (
        <>
        <HashRouter>
        <Box minH="100vh" p={3} fontSize="xl">
            <Header/>
            <hr />
            <Routes>
            <Route path="/" element={<Main/>} />
            <Route path="/newEventConfiguration" element={<NewEventConfiguration/>} />
            <Route path="/verifyParticipants" element={<ParticipantsVerifier/>} />
            <Route path="/passGenerator" element={<EventPassGenerator/>} />

                <Route
                    path="*"
                    element={
                        <main style={{ padding: "1rem" }}>
                            <p>There's nothing here!</p>
                        </main>
                    }
                />
            </Routes>
        </Box>
    </HashRouter>
</>
    )
}

const root = createRoot(document.getElementById("root") as HTMLElement)

root.render(
<ChakraProvider theme={theme}>
    <App />
</ChakraProvider> )
