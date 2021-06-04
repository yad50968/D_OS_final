var axios = require('axios');

const isEmptyObject = (value) => {
    return value && Object.keys(value).length === 0 && value.constructor === Object;
}

const postResult = async () => {

}

module.exports =
{
    isEmptyObject,
    postResult
}