const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");
const KEY_PARSE = process.env.TOKEN_KEY_PARSE;
const IV_PARSE = process.env.TOKEN_IV_PARSE;

const GenerateToken = async (email) => {
  const key = CryptoJS.enc.Utf8.parse(KEY_PARSE);
  const iv = CryptoJS.enc.Utf8.parse(IV_PARSE);
  return CryptoJS.AES.encrypt(email, key, { iv }).toString();
};

const DecodeToken = async (token) => {
  const key = CryptoJS.enc.Utf8.parse(KEY_PARSE);
  const iv = CryptoJS.enc.Utf8.parse(IV_PARSE);
  const decrypted = CryptoJS.AES.decrypt(token, key, { iv });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const HashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const ComparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  GenerateToken,
  DecodeToken,
  HashPassword,
  ComparePassword,
};
