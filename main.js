const fs = require("fs");
const crypto = require("crypto");

// Path to the file to be encrypted
const filePath = "example.txt";

// Path to the encrypted file
const encryptedFilePath = "./encrypted-file.txt";

// Encryption algorithm and options
const algorithm = "aes-256-cbc";
const options = {
  iv: crypto.randomBytes(16), // Generate a random initialization vector
  salt: crypto.randomBytes(16), // Generate a random salt
};

// User's password (can be obtained from user input)
const password = "user_password";

// Generate the encryption key using the password and salt
const key = crypto.scryptSync(password, options.salt, 32);

// Create a cipher object for encryption
const cipher = crypto.createCipheriv(algorithm, key, options.iv);

// Create read and write streams
const readStream = fs.createReadStream(filePath);
const writeStream = fs.createWriteStream(encryptedFilePath);

// Pipe the read stream through the cipher and write to the encrypted file
readStream.pipe(cipher).pipe(writeStream);

// Event handlers for stream completion
readStream.on("end", () => {
  console.log("File encrypted successfully.");
});

writeStream.on("finish", () => {
  console.log("Encryption completed. Encrypted file created.");
});
