var express = require('express');
var router = express.Router();

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
/* GET home page. */
router.get('/', async function(req, res, next) {
  let accounts = await web3.eth.getAccounts();
  console.log(accounts[0]);
  res.json([{turn: 2, tokennam: "tokennam", nftnam: "nftnam", uri: "uri", address: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1", sk: "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"},]);
});

module.exports = router;
