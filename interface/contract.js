// require('dotenv').config();

import fs from 'fs';

import Web3 from 'web3';
import nodemailer from 'nodemailer';
import pkg from '@ethereumjs/tx';
const { Transaction } = pkg;

import Txs from '../models/txs';

const pass = fs.readFileSync(".mailAuth").toString().trim();

var smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    tls: { rejectUnauthorized: false },
    ssl: true,
    service: "Gmail",
    auth: {
        user: "info.solulabwallet@gmail.com",
        pass: pass
    }
});

const web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));

const ContractAddress = '0xE8BA2781cF10DB54C08A481c43B46A2B4D8D6159';
const ownerAddress = '0x014bF2eF4f4b343Cfe71450DAe85dD64A87f5968';

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
], ContractAddress ,{from:ownerAddress});

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const secret = fs.readFileSync(".secret").toString().trim();
const privateKey = Buffer.from(secret, 'hex');

export const transferETH = async function (toAddress) {
	const count = await web3.eth.getTransactionCount('0x3E08416c5f2281520610D62363745Fe4e5e9eF37');
    const nounce = await web3.utils.toHex(count);
    const gasPrice = await web3.utils.toHex(2 * 1e9);
	const gasLimit = await web3.utils.toHex(53000);
	const amount = await web3.utils.toHex(await web3.utils.toWei('0.01', 'ether'));
	const pk = Buffer.from('48ad3913a805bc81a722926157db78291a85353549f1e44444efa951b1977f3f', 'hex');
	const rawTransaction = {
        "from": '0x3E08416c5f2281520610D62363745Fe4e5e9eF37',
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": toAddress,
        "value": amount,
        "nonce": nounce
    }
    console.log('raw tx for ETH initialized');
    const transaction = Transaction.fromTxData(rawTransaction);
    const signTx = transaction.sign(pk);
	const txx = await web3.eth.sendSignedTransaction('0x' + signTx.serialize().toString('hex'));
	console.log('ETH tx Done');
    return txx;
}

export const initialTransfer = async function (toAddress, toMail) {
	const amount = await web3.utils.toWei('5000', 'ether');
	await SoluToken.methods.transfer(toAddress, await web3.utils.toHex(amount))
		.send({ from: ownerAddress }, async function (error, txHash) {
			if (error) {
				console.log('Error', error);
				return error;
			}
			console.log('tx Submitted with', txHash);
			let txReceipt = null;
			while (txReceipt == null) {
				txReceipt = await web3.eth.getTransactionReceipt(txHash);
				await sleep(11000);
			}
			console.log('got Transaction Receipt', txReceipt);
			const tx = new Txs({
				txHash: txReceipt.transactionHash,
				txIndex: txReceipt.transactionIndex,
				txStatus: txReceipt.status,
				senderAddress: ownerAddress,
				receiverAddress: toAddress,
				amount: 5000
			});
			tx.save();
			var mailOptions = {
				to: toMail,
				subject: 'SignUp Bonus Credited',
				html:  `<p>Welcome to SoluLab Wallet</p>
					  <p>Bonus Token Credited to Your Account: <b> ${toAddress}</b><br/> 
					  this is your txHash: <b>${txReceipt.transactionHash}</b>.</p>`
			  };
			  smtpTransport.sendMail(mailOptions, function (error, response) {
				if (error) {
				  console.log(error);
				}
				else {
				  console.log('mail Sent Successfully');
				  return res.redirect('/login');
				}
			});
		});
}

export const internalTransfer = async function (fromAddress, fromPrivateKey, fromMail, sendAmount, toAddress, toMail) {
	const count = await web3.eth.getTransactionCount(fromAddress);
    const nounce = await web3.utils.toHex(count);
    const gasPrice = await web3.utils.toHex(2 * 1e9);
	const gasLimit = await web3.utils.toHex(53000);
	const amount = await web3.utils.toWei(sendAmount, 'ether');
	console.log('Amount', amount);
	fromPrivateKey = fromPrivateKey.split('0x')[1];
	console.log('User PK', fromPrivateKey);
	const fromPK = Buffer.from(fromPrivateKey, 'hex');
	const data = await SoluToken.methods.transfer(toAddress, amount).encodeABI();
    const rawTransaction = {
        "from": ownerAddress,
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": ContractAddress,
        "value": "0x0",
        "data": data,
        "nonce": nounce
    }
    console.log('raw tx initialized');
    const transaction = Transaction.fromTxData(rawTransaction);
    const signTx = transaction.sign(fromPK);
    const txReceipt = await web3.eth.sendSignedTransaction('0x' + signTx.serialize().toString('hex'));
    console.log('tx Send');
	console.log("Final Tx Hash", JSON.stringify(txReceipt));
	const tx = new Txs({
		txHash: txReceipt.transactionHash,
		txIndex: txReceipt.transactionIndex,
		txStatus: txReceipt.status,
		senderAddress: fromAddress,
		receiverAddress: toAddress,
		amount: sendAmount
	});
	tx.save();
	var toMailOptions = {
		to: toMail,
		subject: 'Balance Credited',
		html: `<p>Welcome to SoluLab Wallet</p>
					  <p>Balance Credited to Your Account: <b> ${toAddress}</b> from <b>${fromAddress}</b><br/> 
					  this is your txHash: <b>${txReceipt.transactionHash}</b>.</p>`
	};
	var fromMailOptions = {
		to: fromMail,
		subject: 'Balance Debited',
		html: `<p>Welcome to SoluLab Wallet</p>
					  <p>Balance Debited from Your Account: <b> ${fromAddress}</b>, and Credited to <b>${toAddress}</b><br/> 
					  this is your txHash: <b>${txReceipt.transactionHash}</b>.</p>`
	};
	smtpTransport.sendMail(toMailOptions, function (error, response) {
		if (error) {
			console.log('TO',error);
		}
		else {
			console.log('mail Sent Successfully');
		}
	});
	smtpTransport.sendMail(fromMailOptions, function (errs, resps) {
		if (errs) {
			console.log('FROM',errs);
		} else {
			console.log('Mail Sent Successfully');
		}
	});
	return txReceipt;
};

export const getBalance = async function (address) {
	let balanceInWei = await SoluToken.methods.balanceOf(address).call();
	let balance = await web3.utils.fromWei(balanceInWei, 'ether');
    return balance;
}