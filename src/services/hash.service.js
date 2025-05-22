const CryptoJS = require('crypto-js');

exports.encodeStringToSHA256 = (inputString) => {
    const encodedString = CryptoJS.SHA256(inputString).toString(CryptoJS.enc.Hex);
    return encodedString;
};
