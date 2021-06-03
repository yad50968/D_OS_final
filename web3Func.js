const Web3 = require('web3');
const fs = require('fs');
const rpcURL = 'http://127.0.0.1:8545';
const web3 = new Web3(rpcURL);
const abi = fs.readFileSync('./abi.json').toString();
const bytecode = fs.readFileSync('./bytecode.bin').toString();



const deploySC_Mint = async (jdName, jdSymbol, jdAddress, jdSK) => {

    console.log('enter deploySC');

    let contract = new web3.eth.Contract(JSON.parse(abi));

    let deploy_tx = await contract.deploy({data: "0x" + bytecode, arguments: [jdName, jdSymbol]});

    let gas = await deploy_tx.estimateGas({from: jdAddress});
    let options = {
        to  : deploy_tx._parent._address,
        data: deploy_tx.encodeABI(),
        gas : gas
    };

    let signedTransaction = await web3.eth.accounts.signTransaction(options, jdSK);
    let deploy_address = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    

}

module.exports =
{
    deploySC_Mint
}