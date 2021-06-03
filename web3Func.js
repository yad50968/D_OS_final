const Web3 = require('web3');
const rpcURL = 'http://127.0.0.1:7545';
const web3 = new Web3(rpcURL);
const abi = ;
const bytecode= ;
const deploySC = (jdName, jdSymbol, jdSK) => {
    let deploy_contract = new web3.eth.Contract(JSON.parse(abi));
}

const deploySC = () => {

}

module.exports =
{
    deploySC,
    mintToken
}