var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.json([{id: "123456", turn: 2, tokennam: "tokennam", nftnam: "nftnam", uri: "uri", address: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1", sk: "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"},{id: "777777", turn: 2, tokennam: "tokennam", nftnam: "nftnam", uri: "uri", address: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1", sk: "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"}]);
});

router.post('/post', async (req, res, next) => {
  let id = req.body.id;
  let success = req.body.success;
  let sc_addr = req.body.sc_addr;
  let sc_tx_hash = req.body.sc_tx_hash;
  let mint_tx_hash = req.body.mint_tx_hash;
  res.json({"finish": 1});
});

module.exports = router;
