const Web3 = require('web3');
const fs = require('fs');
//const rpcURL = 'http://127.0.0.1:8545';
var web3 = new Web3(new Web3.providers.HttpProvider(""));
const abi = fs.readFileSync('./abi.json').toString();
const bytecode = fs.readFileSync('./bytecode.bin').toString();

const deploySC = async (name, symbol, SK) => {
    console.log('enter deploySC');
    try {
        let contract = new web3.eth.Contract(JSON.parse(abi));

        let deployTx = await contract.deploy({ data: "0x" + bytecode, arguments: [name, symbol] });
        let address = await web3.eth.accounts.privateKeyToAccount(SK).address;
        //let gas = await deployTx.estimateGas({ from: address });
        
        
        
        let options = {
            data: deployTx.encodeABI(),
            gas: 8000000
        };

        let signedTransaction = await web3.eth.accounts.signTransaction(options, SK);
        let deployContractTxResult = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        return [1, deployContractTxResult.contractAddress];
    } catch (e) {
        console.log(e);
        return [0, ""];
    }
}

const mintToken = async (address, scAddressHash, SK, uri) => {
    console.log('enter mintToken');
    try {
        let deployContract = new web3.eth.Contract(JSON.parse(abi), scAddressHash);
        let mintTokenTx = await deployContract.methods.safeMint(address, uri);
        //let gas = await mintTokenTx.estimateGas({ from: address });
        let options = {
            to: scAddressHash,
            data: mintTokenTx.encodeABI(),
            gas: 8000000
        };


        let signedTransaction = await web3.eth.accounts.signTransaction(options, SK);
        let mintTokenTxResult = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        return [1, mintTokenTxResult.transactionHash];
    } catch (e) {
        console.log(e);
        return [0, ""];
    }
}


module.exports =
{
    deploySC,
    mintToken
}