
import { Contract, providers, Signer } from "ethers"
import ERC721_ABI from "../../public/contracts/ERC721_abi.json"
import ERC1155_ABI from "../../public/contracts/ERC1155_abi.json"
import ERC20_ABI from "../../public/contracts/ERC20_abi.json"

const { ethereum } = window


//Created check function to see if the MetaMask extension is installed
export const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed

    return Boolean(ethereum && ethereum.isMetaMask)
}

export const getSigner = (_ethereum: any) => {
    const ethersProvider = new providers.Web3Provider(_ethereum)
    return ethersProvider.getSigner()
}
export const getProvider = (_chainId:string) =>{
    if(_chainId == '137'){
        return new providers.JsonRpcProvider(process.env.POLYGON_URL)
    }
    if(_chainId == '5'){
        return new providers.JsonRpcProvider(process.env.GOERLI_URL)
    }
    console.log(`${_chainId}`)
    return new providers.Web3Provider(ethereum!);
}

export const getERC721Contract = (_ethersProvider: any, _contractAddress) => {
   // const ethersProvider = new providers.Web3Provider(_ethereum)
    return new Contract(_contractAddress!, ERC721_ABI, _ethersProvider)
}

export const getERC1155Contract = (_ethereum: any, _contractAddress) => {
    const ethersProvider = new providers.Web3Provider(_ethereum)
    return new Contract(_contractAddress!, ERC1155_ABI, ethersProvider.getSigner())
}
export const getERC20Contract = (_ethersProvider: any, _contractAddress) => {
    return new Contract(_contractAddress!, ERC20_ABI, _ethersProvider)
}
