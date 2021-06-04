
const helper = require("./helper");
const axios = require('axios');
const web3Func = require('./web3Func');

//const apiUrl = "https://firebasestorage.googleapis.com/v0/b/nft-ipfs.appspot.com/o/userdata.json?alt=media&token=3fdc509b-cfac-448f-b3dc-48ead043c05e&fbclid=IwAR0J8v9ALLGV-qFVnRTzTVxFCtV4CAS9wr1_O1gEdlhfR8VehKTQJhVrYjM";

const apiUrl = "http://127.0.0.1:3000/";
let processData = new Set();

async function main() {

    let response = await axios.get(apiUrl);
    let json_data = response['data'];
    if (!helper.isEmptyObject(json_data)) {

        for(let jd of json_data){
            let jdTurn = jd["turn"];
            if (jdTurn === 2) {
                let jdId = jd["id"];
                if (!processData.has(jdId)) {
                    processData.add(jdId);
                    let jdAddress = jd["address"];
                    let jdSK = jd["sk"];
                    let jdName = jd["tokennam"];
                    let jdSymbol = jd["nftnam"];
                    let jdUri = jd["uri"];
                    let [checkSC, scAddressHash, scTxResultHash] = await web3Func.deploySC(jdName, jdSymbol, jdAddress, jdSK);

                    let [checkMintToken, mintTokenTxResultHash] = await web3Func.mintToken(scAddressHash, jdAddress, jdSK);


                    let [checkSetURI, setURITxResultHash] = await web3Func.setTokenURI(scAddressHash, jdUri, jdAddress, jdSK);

                    let success = checkSC && checkMintToken && checkSetURI;

                    let finish = await helper.postResult(jdId, success, scAddressHash, scTxResultHash, setURITxResultHash);

                    if (finish === 1) {
                        processData.delete(jdId);
                    }
                }

            }
        }
    } else {
        console.log('current no data need to process');
    }
}
//request_for_data();
//main();
setInterval(main, 10000);