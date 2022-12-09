// https://etherscan.io/address/0x6f1d09fed11115d65e1071cd2109edb300d80a27#readProxyContract#F4

import Web3 from 'web3';
import fxBridgeContract from './contracts/fx_bridge.js'
import registeredTokens from './contracts/registeredTokens.js';
import { bignumber, multiply } from 'mathjs'

const web3 = new Web3("https://cloudflare-eth.com")
/* Check instance of web3 */
// async function getBlockNumber() {
//     const latestBlockNumber = await web3.eth.getBlockNumber()
//     console.log(latestBlockNumber)
//     return latestBlockNumber
// }
// getBlockNumber()

/* Get registered tokens */
const contract = fxBridgeContract(web3)
const getRegisteredToken = async () => {
    try {
        const tokenRegistered = await contract.methods.getBridgeTokenList().call()
        console.log(tokenRegistered)
    } catch (err) {
        console.log(err)
    }
}
getRegisteredToken()

/* Get total supply of token that locked in the bridge 0x6f1D09Fed11115d65E1071CD2109eDb300D80A27 */
const getTotalSupply = async (contract) => {
    try {
        const decimals = await contract.methods.decimals().call()
        const supplyLocked = await contract.methods.balanceOf('0x6f1D09Fed11115d65E1071CD2109eDb300D80A27').call()
        //convert to Ether
        const data = multiply(bignumber(supplyLocked), bignumber(10 ** (-decimals))).toString()
        return data
    } catch (err) {
        console.log(err)
    }
}
for (const token in registeredTokens) {
    const tokenContract = registeredTokens[token](web3)
    const data = await getTotalSupply(tokenContract)
    console.log(`Total supply of ${token} locked in bridge is ${data} Ether.`)
}