const axios = require('axios');
const postURL = "https://nftipfs.herokuapp.com/contract ";
//const postURL = "http://127.0.0.1:3000/post ";

const isEmptyObject = (value) => {
    return value && Object.keys(value).length === 0 && value.constructor === Object;
}

const postResult = async (id, success, scAddress, scTxResultHash, setURITxResultHash) => {

    let payload = {
        "id": id,
        "success": success,
        "sc_addr": scAddress,
        "sc_tx_hash": scTxResultHash,
        "mint_tx_hash": setURITxResultHash
    };
    try {
        let res = await axios.post(postURL, payload);
        if (res.data.status === "finish") {
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
    postResult
}