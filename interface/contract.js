require('dotenv').config();

const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;

const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/'));

const ContractAddress = '0x3DbfD434246d9F85cc007e293D0e187318A20138';
const ownerAddress = '0x206648203024FB7a0867f015ea5270caE7ca21a3';

const SoluToken = new web3.eth.Contract([
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "initialSupply",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
], ContractAddress,{from:ownerAddress});

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}


const privateKey = new Buffer('', 'hex');

exports.initialTransfer = async function (toAddress) {
    // const initialAmount = await web3.utils.toHex(); //5000 SLT
    const initialAmount = await web3.utils.toHex(await web3.utils.toWei('5000000000000000000000', 'ether'));
    const count = await web3.eth.getTransactionCount(ownerAddress) + 1;
    const nounce = await web3.utils.toHex(count);
    const gasPrice = await web3.utils.toHex(2 * 1e9);
    const gasLimit = await web3.utils.toHex(210000); 
    const data = await SoluToken.methods.transfer(toAddress, initialAmount).encodeABI();
    console.log('Nounce', nounce);
    console.log('data', data);
    console.log('AMOUNT', initialAmount);
    const rawTransaction = {
        "from": ownerAddress,
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": ContractAddress,
        "value": "0x0",
        "data": data,
        "nonce": nounce
    } 
    const transaction = new Tx(rawTransaction, { chain: 'ropsten' });
    // console.log("Initial Tx", transaction);
    await transaction.sign(privateKey);
    const txx = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
    console.log("Initial Tx", txx);
    const balance = await SoluToken.methods.balanceOf(toAddress).call();
    return balance;
    // web3.utils.toHex(web3.utils.toWei(initialAmount.toString(), 'ether'));
    // SoluToken.methods.transfer(toAddress, web3.utils.toHex(web3.utils.toWei(initialAmount.toString(), 'ether'))).send({ from: ownerAddress }, async function (error, txHash) {
    //     if (error) {
    //         console.log('Error', error);
    //         return error;
    //     }
    //     console.log('tx Submitted with', txHash);
    //     let txReceipt = null;
    //     while (txReceipt == null) {
    //         txReceipt = await web3.eth.getTransactionReceipt(txHash);
    //         await sleep(11000);
    //     }
    //     console.log('got Transaction Receipt', txReceipt);
    //     let Balance = await getBalance(toAddress);
    //     console.log('final Balance', balance);
    //     return balance;
    // });
}

exports.getBalance = async function (address) {
    let balance = await SoluToken.methods.balanceOf(address).call();
    return balance;
}