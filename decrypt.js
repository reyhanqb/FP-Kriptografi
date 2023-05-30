const fs = require("fs");
const crypto = require("crypto");

const encryptedFilePath = "encrypted.png";
const decryptedFilePath = "decrypted.png";
const algorithm = "aes-256-cbc";
const password = "user_password";

// Read the encrypted file
const encryptedData = fs.readFileSync(encryptedFilePath);

// Generate the encryption key using the password
const key = crypto.scryptSync(password, "salt", 32);

// Get the initialization vector (iv) from the encrypted data
const iv = encryptedData.slice(0, 16);

// Get the encrypted content (excluding the iv)
const encryptedContent = encryptedData.slice(16);

// Create a decipher object for decryption
const decipher = crypto.createDecipheriv(algorithm, key, iv);

// Decrypt the content
const decryptedContent = Buffer.concat([
  decipher.update(encryptedContent),
  decipher.final(),
]);

// Write the decrypted content to the file
fs.writeFileSync(decryptedFilePath, decryptedContent);

console.log("File decrypted successfully.");
