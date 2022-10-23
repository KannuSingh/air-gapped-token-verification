import React from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import { Link as RouterLink } from "react-router-dom"
import {
    Heading,
    HStack,
    Link,
    Tab,
    TabList,
    Tabs,
} from "@chakra-ui/react"
import { hexlify } from "ethers/lib/utils"
import { useEffect, useState } from "react"


function Header() {
    const [_metaMaskInstalled,setMetaMaskInstalled] = useState(false)
    const [_metaMaskConnected,setMetaMaskConnected] = useState(false)
    const [_chainId, setChainId] = useState("137")
    const [_accounts,setAccounts] = useState<string[]>([])


    useEffect( ()=>{
        (async () => {
            const ethereum = (await detectEthereumProvider()) as any
            //check if metamask is installed
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                console.log("Setting metamask Installed ")
                setMetaMaskInstalled(true)

                //check if account is set on application means metamask is already connected.
                if (_accounts.length > 0) {
                    setMetaMaskConnected(true)
                    console.log("Setting metamask connected ")
                }
                ethereum.on("accountsChanged", (newAccounts: string[]) => {
                    if (newAccounts.length !== 0 && _accounts[0] != newAccounts[0]) {
                        console.log("User changed account in their metamask wallet")
                        setAccounts(newAccounts)
                    }
                })
            }

        })()
    },[])

    const handleChainSwitch =async (selectedChainId) =>{
        const ethereum = (await detectEthereumProvider()) as any
        if (selectedChainId) {
            try{
                await ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [
                        {
                            chainId: hexlify(Number(selectedChainId!)).replace("0x0", "0x")
                        }
                    ]
                })
                setChainId(selectedChainId);

            }
            catch(e){

                console.log(e)
            }
            
    }}


    const handleConnect = async () => {
        console.log("handleMetaMaskConnect : " + _chainId)
        const ethereum = (await detectEthereumProvider()) as any
        if (_chainId) {
            try{
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: hexlify(Number(_chainId!)).replace("0x0", "0x")
                    }
                ]
            })
            var accounts: string[] = await ethereum.request({
                method: "eth_requestAccounts"
            })
            console.log("Account :"+accounts[0] )
            setAccounts(accounts)
            setMetaMaskConnected(true)
        }
        catch(e){
            console.log(e)
        }
        }
    }

    const handleDisconnect =async =>{
        setMetaMaskConnected(false)
        setAccounts([])
    }

    const handleInstall = async () => {
        const ethereum = await detectEthereumProvider()
        console.log("handleCInstall")
        //dispatch(requestAccounts(ethereum));
    }

    return (
        <HStack align="center" p={2}>
            <HStack w='50%' alignSelf="center" spacing="2">
                <Heading as="h2">Air-Gapped-Verification</Heading>
            </HStack>

            <HStack alignSelf="center" spacing="5">
                <Tabs>
                    <TabList>
                        <Tab as={RouterLink} to="/newEventConfiguration">Create</Tab>
                        <Tab as={RouterLink} to="/passGenerator">Generate</Tab>
                        <Tab as={RouterLink} to="/verifyParticipants">Verify</Tab>
                    </TabList>
                </Tabs>
               
            </HStack>
        </HStack>
    )
}

export default Header
