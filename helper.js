const axios = require('axios');
const postSCURL = "https://nftipfs.herokuapp.com/contract";
const postMintURL = "https://nftipfs.herokuapp.com/mint";
//const postURL = "http://127.0.0.1:3000/post ";

const isEmptyObject = (value) => {
    return value && Object.keys(value).length === 0 && value.constructor === Object;
}

const postDeploySCResult = async (id, success, scAddress) => {

    let payload = {
        "id": id,
        "success": success,
        "sc_addr": scAddress,
    }
    try {
        let res = await axios.post(postSCURL, payload);
        if (res.data.status === "finish") {
            console.log("post_result:" + res.data.status);
            return 1;
        } else {
            return 0;
        }
    } catch (e) {
        console.log(e);
        return 0;
    }
}


const postMintResult = async (id, success, scTxResultHash) => {

    let payload = {
        "id": id,
        "success": success,
        "mint_tx_hash": scTxResultHash
    };
    try {
        let res = await axios.post(postMintURL, payload);
        if (res.data.status === "finish") {
            console.log("post_result:" + res.data.status);
            return 1;
        } else {
            return 0;
        }
    } catch (e) {
        console.log(e);
        return 0;
    }
}

module.exports =
{
    isEmptyObject,
    postDeploySCResult,
    postMintResult
}