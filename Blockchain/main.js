
const helper = require("./helper");
const axios = require('axios');
const web3Func = require('./web3Func');
const apiUrl = "https://nftipfs.herokuapp.com/contract";
//const apiUrl = "http://127.0.0.1:3000";

let processData = new Set();


const main = async () => {
    console.log("gogo");
    if (processData.size === 0) {
        let response = await axios.get(apiUrl);
        let json_data = response['data'];
        if (!helper.isEmptyObject(json_data)) {

            for (let jd of json_data) {
                let jdTurn = jd["turn"];
                let jdId = jd["id"];
                if (jdTurn === 2) { // process deploy
                    if (!processData.has(jdId)) {
                        processData.add(jdId);
                        console.log(jd);
                        let jdSK = jd["sk"];
                        let jdName = jd["tokenname"];
                        let jdSymbol = jd["nftname"];

                        var [checkSC, scAddress] = await web3Func.deploySC(jdName, jdSymbol, jdSK);

                        if (checkSC === 1) {
                            console.log("contract addr: " + scAddress);
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
                        let jdSK = jd["sk"];
                        let jdUri = jd["uri"];
                        let jdSCAddress = jd["scaddress"];
                        let jdAddress = jd["address"];
                        console.log(jdSCAddress);
                        console.log("id" + jdId);

                        var [checkMintToken, mintTxHash] = await web3Func.mintToken(jdAddress, jdSCAddress, jdSK, jdUri);

                        if (checkMintToken === 1) {
                            finish = await helper.postMintResult(jdId, 1, mintTxHash);
                        } else {
                            finish = await helper.postMintResult(jdId, 0, "");
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

setInterval(main, 10000);
//web3Func.mintToken("0x8d97CdA4d85755ECb61C5EDfd38f066D14F8d0e1", "0xbdb3b0fb6f09c2e46b5e8de52a9144ee214cac03", "256318c0cc3c28a26b486fdde33808962efa7f4e8c9e337e9d17f9defe4a8d75", "hello");