<template>
  <div>
    <h2>Simple RSA Encryption</h2>
    <form @submit.prevent>
      <div>
        <label for="message">Message:</label>
        <input type="text" id="message" v-model="message" />
      </div>
      <div>
        <button @click="encrypt">Encrypt</button>
      </div>
      <div v-if="ciphertext">
        <h3>Ciphertext:</h3>
        <p>{{ ciphertext }}</p>
      </div>
    </form>
    <form @submit.prevent>
      <div>
        <label for="encryptedMessage">Encrypted Message:</label>
        <input type="text" id="encryptedMessage" v-model="encryptedMessageInput" />
      </div>
      <div>
        <label for="privateKeyD">Private Key (d):</label>
        <input type="text" id="privateKeyD" v-model="privateKeyInput.d" />
      </div>
      <div>
        <label for="privateKeyN">Modulus (n):</label>
        <input type="text" id="privateKeyN" v-model="privateKeyInput.n" />
      </div>
      <div>
        <button @click="decrypt">Decrypt</button>
      </div>
      <div v-if="decryptedMessage">
        <h3>Decrypted Message:</h3>
        <p>{{ decryptedMessage }}</p>
      </div>
    </form>
    <div>
      <h3>Public Key:</h3>
      <p>{{ publicKey }}</p>
      <h3>Private Key:</h3>
      <p>{{ privateKey }}</p>
    </div>
  </div>
</template>

<script>
import bigInt from 'big-integer';

function gcd(a, b) {
  while (b.isPositive()) {
    const temp = b;
    b = a.mod(b);
    a = temp;
  }
  return a;
}

function generateRandomPrime(min, max) {
  while (true) {
    const randomNumber = bigInt.randBetween(min, max);
    if (randomNumber.isProbablePrime()) {
      return randomNumber;
    }
  }
}

export default {
  data() {
    return {
      message: '',
      publicKey: {
        e: '',
        n: ''
      },
      privateKeyInput: {
        d: '',
        n: ''
      },
      ciphertext: '',
      encryptedMessageInput: '',
      decryptedMessage: ''
    };
  },
  methods: {
    generateKeyPair() {
      const bitLength = 16; // Adjust the bit length as desired
      const min = bigInt(2).pow(bitLength - 1);
      const max = bigInt(2).pow(bitLength).prev();

      // Generate two large random prime numbers
      const p = generateRandomPrime(min, max);
      const q = generateRandomPrime(min, max);

      // Calculate n = p * q
      const n = p.multiply(q);

      // Calculate Euler's totient function φ(n)
      const phi = p.subtract(1).multiply(q.subtract(1));

      // Choose public exponent e
      const e = bigInt(65537);

      // Calculate the modular multiplicative inverse of e modulo φ(n) to get the private exponent d
      const d = e.modInv(phi);

      const publicKey = { e, n };
      const privateKey = { d, n };

      this.publicKey = JSON.stringify(publicKey);
      this.privateKey = JSON.stringify(privateKey);
    },

    encrypt() {
      // Validate the message as a number
      if (!isNaN(this.message) && this.message.trim() !== '') {
        // Generate key pair
        this.generateKeyPair();

        // Convert the message to a BigInteger
        const messageBigInt = bigInt(this.message);

        // Encrypt the message using the public key
        const encryptedMessage = messageBigInt.modPow(
          bigInt(JSON.parse(this.publicKey).e),
          bigInt(JSON.parse(this.publicKey).n)
        );

        // Store the encrypted message
        this.ciphertext = encryptedMessage.toString();

        // Reset the decrypted message
        this.decryptedMessage = '';
      }
    },

    decrypt() {
      // Convert the encrypted message input to a BigInteger
      const encryptedMessageBigInt = bigInt(this.encryptedMessageInput);

      // Convert the private key to BigIntegers
      const privateKey = {
        d: bigInt(this.privateKeyInput.d),
        n: bigInt(this.privateKeyInput.n)
      };

      // Decrypt the message using the private key
      const decryptedMessage = encryptedMessageBigInt.modPow(
        privateKey.d,
        privateKey.n
      );

      // Store the decrypted message
      this.decryptedMessage = decryptedMessage.toString();
    }
  }
};
</script>
