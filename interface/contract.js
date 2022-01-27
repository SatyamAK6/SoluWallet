// require('dotenv').config();

import Web3 from 'web3';
import nodemailer from 'nodemailer';
import pkg from '@ethereumjs/tx';
const { Transaction } = pkg;

import Txs from '../models/txs';

import config from '../config.json';

var smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    tls: { rejectUnauthorized: false },
    ssl: true,
    service: "Gmail",
    auth: {
        user: config.mailCred.user,
        pass: config.mailCred.pass
    }
});

const web3 = new Web3(new Web3.providers.HttpProvider(config.web3Provider));

const SoluToken = new web3.eth.Contract(config.contractABI, config.contractAddress, { from: config.ownerAddress });
// console.log(SoluToken);

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// const secret = fs.readFileSync(".secret").toString().trim();
const privateKey = Buffer.from(config.ownerPrivateKey, 'hex');

export const transferETH = async function (toAddress) {
	const count = await web3.eth.getTransactionCount(config.ownerAddress);
    const nounce = await web3.utils.toHex(count);
    const gasPrice = await web3.utils.toHex(2 * 1e9);
	const gasLimit = await web3.utils.toHex(53000);
	const amount = await web3.utils.toHex(await web3.utils.toWei('0.1', 'ether'));
	const pk = Buffer.from(config.ownerPrivateKey, 'hex');
	const rawTransaction = {
        "from": config.ownerAddress,
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
		.send({ from: config.ownerAddress }, async function (error, txHash) {
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
				senderAddress: config.ownerAddress,
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
	const ethBal = await web3.utils.fromWei(await web3.eth.getBalance(fromAddress), 'ether');
	console.log('Eth Balance', ethBal);
	console.log('Amount', amount);
	fromPrivateKey = fromPrivateKey.split('0x')[1];
	const fromPK = Buffer.from(fromPrivateKey, 'hex');
	const data = SoluToken.methods.transfer(toAddress, amount).encodeABI();
    const rawTransaction = {
        "from": config.ownerAddress,
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": config.contractAddress,
        "value": "0x0",
        "data": data,
        "nonce": nounce
	}
	
    console.log('raw tx initialized');
	const transaction = Transaction.fromTxData(rawTransaction);
	const signTx = transaction.sign(fromPK);
    const txReceipt = await web3.eth.sendSignedTransaction('0x' + signTx.serialize().toString('hex'));
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