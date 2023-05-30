const fs = require("fs");
const crypto = require("crypto");

const filePath = "II2220_Dokumen1_G35.docx";
const encryptedFilePath = "encrypted.docx";
const algorithm = "aes-256-cbc";
const password = "user_password";

// Generate a random initialization vector
const iv = crypto.randomBytes(16);

// Generate the encryption key using the password
const key = crypto.scryptSync(password, "salt", 32);

// Create a cipher object for encryption
const cipher = crypto.createCipheriv(algorithm, key, iv);

const readStream = fs.createReadStream(filePath);
const writeStream = fs.createWriteStream(encryptedFilePath);

readStream.pipe(cipher).pipe(writeStream);

readStream.on("end", () => {
  console.log("File encrypted successfully.");
});

writeStream.on("finish", () => {
  console.log("Encryption completed. Encrypted file created.");
});
