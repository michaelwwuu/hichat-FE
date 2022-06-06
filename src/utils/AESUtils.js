import CryptoJS from "crypto-js";
//加密
export function Encrypt(data, key, iv) {
  //编码 key
  key = CryptoJS.enc.Utf8.parse(key);
  //编码iv
  iv = CryptoJS.enc.Utf8.parse(iv);
  //编码data
  data = CryptoJS.enc.Utf8.parse(data);
  // 加密模式为CBC，补码方式为NoPadding
  let encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  //返回base64
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}
//解密
export function Decrypt(data, key, iv) {
  //编码
  key = CryptoJS.enc.Utf8.parse(key);
  //编码
  iv = CryptoJS.enc.Utf8.parse(iv);
  //Base64编码
  const base64 = CryptoJS.enc.Base64.parse(data);
  const base64Str = CryptoJS.enc.Base64.stringify(base64);
  const decrypt = CryptoJS.AES.decrypt(base64Str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}