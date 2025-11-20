import CryptoJS from "react-native-crypto-js";

/**
 * Encrypts content using AES encryption with the passcode as the key
 * @param content - The content to encrypt
 * @param passcode - The passcode to use as the encryption key
 * @returns Encrypted content as a string
 */
export const encryptContent = (content: string, passcode: string): string => {
  try {
    if (!content || !passcode) {
      return content;
    }
    // Use the passcode as the key for AES encryption
    const encrypted = CryptoJS.AES.encrypt(content, passcode).toString();
    return encrypted;
  } catch (error) {
    console.error("Error encrypting content:", error);
    throw new Error("Failed to encrypt content");
  }
};

/**
 * Decrypts content using AES decryption with the passcode as the key
 * @param encryptedContent - The encrypted content to decrypt
 * @param passcode - The passcode to use as the decryption key
 * @returns Decrypted content as a string
 */
export const decryptContent = (
  encryptedContent: string,
  passcode: string
): string => {
  try {
    if (!encryptedContent || !passcode) {
      return encryptedContent;
    }
    // Decrypt using the passcode as the key
    const decrypted = CryptoJS.AES.decrypt(encryptedContent, passcode);
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    
    // If decryption fails, the result will be empty
    if (!decryptedText) {
      throw new Error("Invalid passcode or corrupted data");
    }
    
    return decryptedText;
  } catch (error) {
    console.error("Error decrypting content:", error);
    throw new Error("Failed to decrypt content. Invalid passcode.");
  }
};

