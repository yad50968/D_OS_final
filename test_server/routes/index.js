var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.json([{"turn":1,"id":1623228776102,"sk":"0x256318c0cc3c28a26b486fdde33808962efa7f4e8c9e337e9d17f9defe4a8d75","address":"0x8d97CdA4d85755ECb61C5EDfd38f066D14F8d0e1","tokenNam":"hhh","nftNam":"3","desc":"3","supply":"3","creator":"3","assetType":"image/png","coverType":"image/png","submitTime":"2021/6/9","assetUrl":"https://firebasestorage.googleapis.com/v0/b/nft-ipfs.appspot.com/o/1623228776102%2Fasset.png?alt=media","coverUrl":"https://firebasestorage.googleapis.com/v0/b/nft-ipfs.appspot.com/o/1623228776102%2Fcover.png?alt=media","uri":"QmfBtTqzVsaJsAgbqR2GBzHzwUJaM7RUJEfkUH1eHQw9B5"}]);
});

router.post('/post', async (req, res, next) => {
  let id = req.body.id;
  let success = req.body.success;
  let sc_addr = req.body.sc_addr;
  let sc_tx_hash = req.body.sc_tx_hash;
  let mint_tx_hash = req.body.mint_tx_hash;
  res.json({ "finish": 1 });
});

module.exports = router;
