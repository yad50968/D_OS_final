
const helper = require("./helper");
const axios = require('axios');
const web3Func = require('./web3Func');
const apiUrl = "https://nftipfs.herokuapp.com/contract ";
//const apiUrl = "http://127.0.0.1:3000";

let processData = new Set();
//const apiUrl = "https://firebasestorage.googleapis.com/v0/b/nft-ipfs.appspot.com/o/userdata.json?alt=media&token=3fdc509b-cfac-448f-b3dc-48ead043c05e&fbclid=IwAR0J8v9ALLGV-qFVnRTzTVxFCtV4CAS9wr1_O1gEdlhfR8VehKTQJhVrYjM";


const main = async () => {
    if (processData.size === 0) {
        let response = await axios.get(apiUrl);
        let json_data = response['data'];
        if (!helper.isEmptyObject(json_data)) {

            for (let jd of json_data) {
                let jdTurn = jd["turn"];
                if (jdTurn === 2) { // process deploy
                    if (!processData.has(jdId)) {
                        processData.add(jdId);
                        let jdAddress = jd["address"];
                        let jdSK = jd["sk"];
                        let jdName = jd["tokenNam"];
                        let jdSymbol = jd["nftNam"];

                        var [checkSC, scAddress] = await web3Func.deploySC(jdName, jdSymbol, jdAddress, jdSK);

                        if (checkSC === 1) {
                            console.log("contract addr: " + scAddressHash);
                            finish = await helper.postDeploySCResult(jdId, 1, scAddress);
                        } else {
                            console.log("deploy error");
                            finish = await helper.postDeploySCResult(jdId, 0, "");
                        }

                        processData.delete(jdId);
                    }
                }
                else if (jdTurn === 1) {  // process mint
                    let jdId = jd["id"];
                    if (!processData.has(jdId)) {
                        processData.add(jdId);
                        let jdAddress = jd["address"];
                        let jdSK = jd["sk"];
                        let jdUri = jd["uri"];
                        let jdSCAddress = jd["scaddress"];
                        let checkAllOK = 0;
                        console.log("id" + jdId);

                        var [checkMintToken, mintTxHash] = await web3Func.mintToken(jdSCAddress, jdAddress, jdSK, jdUri);

                        if (checkMintToken === 1) {
                            finish = await helper.postResult(jdId, 1, mintTxHash);
                        } else {
                            finish = await helper.postResult(jdId, 0, "");
                        }

                        processData.delete(jdId);
                    }
                }
            }
        }
    } else {
        console.log("set is not empty");
    }
}

//main();
setInterval(main, 10000);