const Web3 = require('web3');
const fs = require('fs');
const rpcURL = 'http://127.0.0.1:8545';
const web3 = new Web3(rpcURL);
const abi = fs.readFileSync('./abi.json').toString();
const bytecode = fs.readFileSync('./bytecode.bin').toString();

const deploySC = async (name, symbol, address, SK) => {
    console.log('enter deploySC');
    try {
        let contract = new web3.eth.Contract(JSON.parse(abi));

        let deployTx = await contract.deploy({ data: "0x" + bytecode, arguments: [name, symbol] });

        let gas = await deployTx.estimateGas({ from: address });
        let options = {
            data: deployTx.encodeABI(),
            gas: gas
        };

        let signedTransaction = await web3.eth.accounts.signTransaction(options, SK);
        let deployContractTxResult = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        return [1, deployContractTxResult.contractAddress, deployContractTxResult.transactionHash];
    } catch (e) {
        console.log(e);
        return [0, "", ""];
    }
}

const mintToken = async (scAddressHash, address, SK) => {
    console.log('enter mintToken');
    try {
        let deployContract = new web3.eth.Contract(JSON.parse(abi), scAddressHash);

        let mintTokenTx = await deployContract.methods.safeMint(address);
        let gas = await mintTokenTx.estimateGas({ from: address });
        let options = {
            to: mintTokenTx._parent._address,
            data: mintTokenTx.encodeABI(),
            gas: gas
        };


        let signedTransaction = await web3.eth.accounts.signTransaction(options, SK);
        let mintTokenTxResult = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        return [1, mintTokenTxResult.transactionHash];
    } catch (e) {
        //console.log(e);
        return [0, ""];
    }
}

const setTokenURI = async (scAddressHash, uri, address, SK) => {
    console.log('enter setTokenURI');
    try {
        let deployContract = new web3.eth.Contract(JSON.parse(abi), scAddressHash);

        let setTokenURITx = await deployContract.methods.setTokenURI(0, uri);

        let gas = await setTokenURITx.estimateGas({ from: address });
        let options = {
            to: setTokenURITx._parent._address,
            data: setTokenURITx.encodeABI(),
            gas: gas
        };

        let signedTransaction = await web3.eth.accounts.signTransaction(options, SK);
        let setURITxResult = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        return [1, setURITxResult.transactionHash];
    } catch (e) {
        //console.log(e);
        return [0, ""];
    }
}

module.exports =
{
    deploySC,
    mintToken,
    setTokenURI
}