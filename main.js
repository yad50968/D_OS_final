
var helper = require("./helper");
var axios = require('axios');
var web3Func = require('./web3Func');

//var apiUrl = "https://firebasestorage.googleapis.com/v0/b/nft-ipfs.appspot.com/o/userdata.json?alt=media&token=3fdc509b-cfac-448f-b3dc-48ead043c05e&fbclid=IwAR0J8v9ALLGV-qFVnRTzTVxFCtV4CAS9wr1_O1gEdlhfR8VehKTQJhVrYjM";

var apiUrl = "http://127.0.0.1:3000/";


async function main() {

    let response = await axios.get(apiUrl);
    let json_data = response['data'];
    if (!helper.isEmptyObject(json_data)) {
        
        console.log(json_data);
        json_data.forEach(async jd => {
            let jdTurn = jd["turn"];
            if (jdTurn === 2) {
                let jdAddress = jd["address"];
                let jdSK = jd["sk"];
                let jdName = jd["tokennam"];
                let jdSymbol = jd["nftnam"];
                let jdUri = jd["uri"];
                let sc_tx = await web3Func.deploySC_Mint(jdName, jdSymbol, jdAddress, jdSK);
                //let mint_tx = await web3Func.mintToken(sc_tx, jdAddress, jdUri, jdSK);
                console.log('fff');
            }
        })
    } else {
        console.log('current no data need to process');
    }
}
//request_for_data();
main();
//setInterval(main, 1000);