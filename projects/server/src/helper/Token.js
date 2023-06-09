const CryptoJS = require("crypto-js");
const PARSE = process.env.TOKEN_PARSE;

/**
 * Generate token for email verification
 * @param email
 * @returns {Promise<string>}
 * @constructor
 */
const GenerateToken = async (email) => {
  const token = await CryptoJS.AES.encrypt(email, PARSE).toString();

  const hash = await CryptoJS.SHA256(token).toString();

  return `${token}.${hash}`;
};

/**
 * Decode token for email verification
 * @param token
 * @returns {Promise<string>}
 * @constructor
 */
const DecodeToken = async (token) => {
  const [encryptedEmail, hash] = token.split(".");

  const decryptedBytes = await CryptoJS.AES.decrypt(encryptedEmail, PARSE);
  const decryptedEmail = decryptedBytes.toString(CryptoJS.enc.Utf8);

  const calculatedHash = await CryptoJS.SHA256(encryptedEmail).toString();
  if (calculatedHash !== hash) {
    throw new Error("Invalid token");
  }

  return decryptedEmail;
};

module.exports = {
  GenerateToken,
  DecodeToken,
};
