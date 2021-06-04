
const helper = require("./helper");
const axios = require('axios');
const web3Func = require('./web3Func');
const apiUrl = "https://nftipfs.herokuapp.com/contract ";
//const apiUrl = "http://127.0.0.1:3000";

let processData = new Set();
//const apiUrl = "https://firebasestorage.googleapis.com/v0/b/nft-ipfs.appspot.com/o/userdata.json?alt=media&token=3fdc509b-cfac-448f-b3dc-48ead043c05e&fbclid=IwAR0J8v9ALLGV-qFVnRTzTVxFCtV4CAS9wr1_O1gEdlhfR8VehKTQJhVrYjM";


const main = async () => {

    let response = await axios.get(apiUrl);
    let json_data = response['data'];
    if (!helper.isEmptyObject(json_data)) {

        for (let jd of json_data) {
            let jdTurn = jd["turn"];
            if (jdTurn === 1) {
                let jdId = jd["id"];
                if (!processData.has(jdId)) {
                    processData.add(jdId);
                    let jdAddress = jd["address"];
                    let jdSK = jd["sk"];
                    let jdName = jd["tokenNam"];
                    let jdSymbol = jd["nftNam"];
                    let jdUri = jd["uri"];

                    let checkAllOK = 0;

                    var [checkSC, scAddressHash, scTxResultHash] = await web3Func.deploySC(jdName, jdSymbol, jdAddress, jdSK);

                    if (checkSC === 1) {
                        var [checkMintToken, mintTokenTxResultHash] = await web3Func.mintToken(scAddressHash, jdAddress, jdSK);

                        if (checkMintToken === 1) {
                            var [checkSetURI, setURITxResultHash] = await web3Func.setTokenURI(scAddressHash, jdUri, jdAddress, jdSK);

                            if (checkSetURI === 1) {
                                checkAllOK = 1;
                            }
                        }
                    }

                    let finish;

                    if (checkAllOK === 1) {
                        finish = await helper.postResult(jdId, 1, scAddressHash, scTxResultHash, setURITxResultHash);
                    } else {
                        finish = await helper.postResult(jdId, 0, "", "", "");
                    }

                    processData.delete(jdId);
                }
            }
        }
    } else {
        console.log('current no data need to process');
    }
}

setInterval(main, 10000);