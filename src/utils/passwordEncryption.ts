// @ts-ignore
import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse('rt5XOJnVTYjw1UIE');
const iv = CryptoJS.enc.Utf8.parse('dfBZojV7VsH3t66V');

/**
 * 密码解密
 * @param word
 * @constructor
 */
export function Decrypt(word: string) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

/**
 * 密码加密
 * @param word
 * @constructor
 */
export function Encrypt(word: string | number) {
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString();
}
