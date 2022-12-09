// https://etherscan.io/address/0x6f1d09fed11115d65e1071cd2109edb300d80a27#readProxyContract#F4

import Web3 from 'web3';
import fxBridgeContract from './contracts/fx_bridge.js'
import registeredTokens from './contracts/registeredTokens.js';
import { bignumber, multiply } from 'mathjs'
import fs from "fs";
import { stringify } from 'csv-stringify'

const web3 = new Web3("https://cloudflare-eth.com")
const data = []
const filename = "fx-bridge token supply.csv";
const writableStream = fs.createWriteStream(filename);
const columns = [
    "Timestamp (At request)",
    "Block Height",
    "PUNDIX (Ether)",
    "USDT (Ether)",
    "DAI (Ether)",
    "EURS (Ether)",
    "LINK (Ether)",
    "C98 (Ether)",
    "WETH (Ether)",
    "BUSD (Ether)",
    "FRAX (Ether)",
    "USDC (Ether)",
];
const stringifier = stringify({ header: true, columns: columns });

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
        const supplyLockedInEther = multiply(bignumber(supplyLocked), bignumber(10 ** (-decimals)))
        return supplyLockedInEther.toString()
    } catch (err) {
        console.log(err)
    }
}

/* Store in object and print it */
// const getBatchTotalSupply = async (registeredTokens) => {
//     const timestamp = new Date()
//     const latestBlockNumber = await web3.eth.getBlockNumber()
//     const res = {
//         timestamp: timestamp,
//         blockHeight: latestBlockNumber
//     }
//     for (const token in registeredTokens) {
//         const tokenContract = registeredTokens[token](web3)
//         const supplyLockedInEther = await getTotalSupply(tokenContract)
//         res[token] = data
//         // console.log(`Total supply of ${token} locked in bridge is ${data} Ether`)
//     }
//     return res;
// }

/* Format data in rows for .csv file */
const getBatchTotalSupply = async (registeredTokens) => {
    const res = [];
    const timestamp = Date()
    const latestBlockNumber = await web3.eth.getBlockNumber()
    res.push(timestamp, latestBlockNumber)
    for (const token in registeredTokens) {
        const tokenContract = registeredTokens[token](web3)
        const supplyLockedInEther = await getTotalSupply(tokenContract)
        //push data in this order: PUNDIX,USDT,DAI,EURS,LINK,C98,WETH,BUSD,FRAX,USDC
        res.push(supplyLockedInEther)
        // console.log(`Total supply of ${token} locked in bridge is ${data} Ether`)
    }
    return res
}

const intervalId = setInterval(async function () {
    const res = await getBatchTotalSupply(registeredTokens)
    data.push(res)
}, 5000);

setTimeout(() => {
    clearInterval(intervalId)
    data.forEach(row => {
        stringifier.write(row);
    });
    stringifier.pipe(writableStream);
    console.log("Finished writing data");
}, 65000);



