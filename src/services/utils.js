import "react-native-get-random-values";

export const genNonce = () => {
  let nonce = new Uint8Array(16); // 16 bytes (128 bits) nonce
  crypto.getRandomValues(nonce);
  return nonce.toString("base64");
};
