<template>
  <div>
    <h1>{{ question }}</h1>
    <label for="name">Your Name:</label>
    <input type="text" id="name" v-model="username">
    <ul>
      <li v-for="(option, index) in vote" :key="index">
        <label>
          <input type="radio" :value="index" v-model="selectedOption">
          {{ option.text }} - Votes: {{ option.votes }}
        </label>
      </li>
    </ul>
    <!-- <h3 v-if="voted">Your public key is: {{ this.publicKey }}</h3> -->
    <h3 v-if="voted">Your private key is: {{ this.concat_key }}</h3>
    <button @click="submitVote" :disabled="selectedOption === null">Vote</button>
    <div>
      <h3>Enter Key to Unblind Vote</h3>
      <div class="columns">
        <div class="column">
          <label for="username">Username:</label>
          <input type="text" v-model="usernameView">
        </div>
        <div class="column">
          <label for="private-key-d">Private Key (d):</label>
          <input type="text" id="private-key-d" v-model="privateKeyInput.d">
        </div>
        <div class="column">
          <label for="private-key-n">Private Key (n):</label>
          <input type="text" id="private-key-n" v-model="privateKeyInput.n">
        </div>
      </div>
      <button @click="unblindVote">Unblind Vote</button>
      <h3 v-if="showUnblindedVote">You voted for: {{ decryptedMessage }}</h3>
      <!-- <p v-if="showUnblindedVote">{{ decryptedMessage }}</p> -->
    </div>
    <!-- <div v-if="voted">
      <h3>Your Blind Signature: {{ blindSignature }}</h3>
    </div> -->
    <!-- <div>
      <h3>Enter Username</h3>
      <input type="text" v-model="usernameView">
    </div> -->
  </div>
</template>

<script>
import axios from 'axios';
import bigInt from 'big-integer';
import { SHA256 } from 'crypto-js';

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
      username: '',
      usernameView: '',
      question: 'What is your favorite programming language?',
      vote: [
        { text: 'JavaScript', blindedVotes: [] },
        { text: 'Python', blindedVotes: [] },
        { text: 'Java', blindedVotes: [] },
        { text: 'C++', blindedVotes: [] }
      ],
      selectedOption: null,
      voted: false,
      rsaKey: null, // New property to store RSA key pair
      vote_key: '',
      showVote: false,
      voteMessage: '',
      viewName: '',
      viewKey: '',
      blindSignature: '',
      publicKey: {
        e: '',
        n: '',
      },
      privateKeyInput: {
        d: '',
        n: '',
      },
      decryptedMessage:'',
      unblindedVote: '',
      showUnblindedVote: false,
      unblindedVoteMessage: '',
      concat_key: '',
    };
  },
  methods: {
    submitVote() {

  // Generate blind signature
  const blindSignature = this.generateBlindSignature();

  // Ensure that the blind signature is generated successfully
  if (!blindSignature) {
    console.error('Blind signature could not be generated.');
    return;
  }

  // Generate blinded option using the selectedOption index
  const blindedOption = this.blindOption(this.username, blindSignature);

  // Ensure that the blinded option is valid
  if (!blindedOption) {
    console.error('Invalid blinded option:', blindedOption);
    return;
  }

  // Push blinded option to the corresponding vote option using the selectedOption index
  if (this.vote[this.selectedOption]) {
    this.vote[this.selectedOption].blindedVotes.push(blindedOption);
  } else {
    console.error('Invalid vote option:', this.selectedOption);
    return;
  }
  
  const key1 = JSON.parse(this.privateKey).d;
  const key2 = JSON.parse(this.privateKey).n;
  this.concat_key = this.generateConcatKey(key1, key2);
  // Set voted flag to true
  this.voted = true;

  // Clear vote message and hide vote form
  this.voteMessage = '';
  this.showVote = false;

  const selectedOptionIndex = parseInt(this.selectedOption);
  const selectedOption = this.vote[selectedOptionIndex].text;

  const tokenVote = this.generateToken(16);

  // Prepare payload for API request
  const selectedOptionText = this.vote[this.selectedOption].text;
  const payload = {
    vote: selectedOptionText
  };

  // Send vote data to the server
  axios
    .post('http://localhost:3000/api/vote', {
      username: this.username,
      vote: blindedOption
    })
    .then(response => {
      console.log(response.data);

      // Perform additional actions or send another request
      return axios.post('http://localhost:3000/api/generatetoken', {
        vote: selectedOption,
        token: tokenVote,
      });
    })
    .then(secondResponse => {
      console.log(secondResponse.data);
      // Handle the response from the second request
    })
    .catch(error => {
      console.error(error);
    });
},
generateConcatKey(key1, key2) {
const concatKey = `${key1}-${key2}`;
console.log(concatKey);
return concatKey;
},
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

generateBlindSignature() {
  this.generateKeyPair();

// Convert the message to a BigInteger
const messageBigInt = bigInt(this.selectedOption + 2);

// Encrypt the message using the public key
const blindSignature = messageBigInt.modPow(
  bigInt(JSON.parse(this.publicKey).e),
  bigInt(JSON.parse(this.publicKey).n)
);

const private_Key = this.privateKey;

  // const blindSignature = publicKey.e.modPow(privateKey, publicKey.n).toString();
  console.log('blindSignature:', blindSignature); // Debug statement

  this.blindSignature = blindSignature;
  return blindSignature;
},

generateToken(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  console.log(token);
  return token;
},

blindOption(username, blindSignature) {
  const hashedName = SHA256(this.username).toString(); // Hash the name using SHA256 and convert it to a string
  const blindedOption = `${hashedName}-${blindSignature}`;
  console.log(blindedOption);
  return blindedOption;
},

    viewVote() {
      const url = `http://localhost:3000/api/viewvote?username=${encodeURIComponent(this.viewName)}&vote_key=${encodeURIComponent(this.viewKey)}`;

      axios
        .get(url)
        .then(response => {
          const voteData = response.data;
          this.showVote = true;
          this.voteMessage = JSON.stringify(voteData);
        })
        .catch(error => {
          console.error(error);
        });
    },
     
    async unblindVote() {
      const voteValue = await this.verifyHash(this.usernameView)
      console.log('Hash is:', voteValue)
      const extractedValue = voteValue.substring(voteValue.indexOf('-') + 1).trim().replace(/"$/, '');
      console.log('Extracted value is:', extractedValue);
      const encryptedMessageBigInt = bigInt(extractedValue);

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
this.decryptedMessage = decryptedMessage - 2;
console.log(this.decryptedMessage)
this.showUnblindedVote = true;

const voteOption = this.vote[this.decryptedMessage];

// Store the decrypted vote option
this.decryptedMessage = voteOption.text;
},

async verifyHash(usernameView) {
  const hashedName = SHA256(usernameView).toString();
  console.log('Verifying hashed name:', hashedName);

  const url = `http://localhost:3000/api/getVoteOptions?hashedName=${encodeURIComponent(hashedName)}`;
  console.log('API URL:', url);

  try {
    const response = await axios.get(url);
    console.log('API response:', response.data);

    const voteOption = response.data;

    if (voteOption) {
      // Extract the vote value from the returned query and remove the leading double quotation mark
      const voteValue = voteOption.split('-')[0].trim().slice(1);
      console.log('Matching vote option found:', voteValue);

      return voteOption;
    } else {
      console.log('No matching vote option found.');
      return null; // Hashed name does not match any of the vote options
    }
  } catch (error) {
    console.error('Error occurred while fetching vote options:', error);
    return null; // Error occurred while fetching vote options
  }
},


  generateRSAKeys() {
  console.log('Generating RSA keys...');
  this.rsaKey = this.generateKeyPair();
  console.log('RSA keys generated.');
  // console.log('Public Key:', this.rsaKey.publicKey);
  // console.log('Private Key:', this.rsaKey.privateKey);
},
  },
mounted() {
  console.log('Component mounted.');
  // this.generateRSAKeys();
}
};
</script>