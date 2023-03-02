import CryptoJS from "crypto-js"

const key = "oP2Idf#8jbGi53@aDslB*ov0saSp"

const Encrypt = (response) => {
    return CryptoJS.AES.encrypt(JSON.stringify(response), key).toString()
}

const Decrypt = (response) => {
    return JSON.parse(CryptoJS.AES.decrypt(response, key).toString(CryptoJS.enc.Utf8))
}

export { Encrypt, Decrypt }