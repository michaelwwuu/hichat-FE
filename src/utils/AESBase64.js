import { Decrypt } from "@/utils/AESUtils.js";

export default function (data, aesKey ,aesIv) {
  var base64Rejex =
    /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;
  if (!base64Rejex.test(data)) {
    return data;
  }
  try {
    return Decrypt(data, aesKey, aesIv);
  } catch (err) {
    return data;
  }
}