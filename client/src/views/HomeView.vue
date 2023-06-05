<script>
import {
  findModInverse,
  findPrime,
  gcd,
  extendedGCD,
  isPrime,
  RabinMiller,
} from "../algos/calc.js"; // Import the necessary functions from calc.js

export default {
  data() {
    return {
      publicKey: {},
      privateKey: {},
      message: "",
      eligibility: "",
      signedBlindMessage: "",
      verificationStatus: false,
      decodedMessage: "",
      p: null,
      q: null,
      phi: null,
      n: null,
      e: null,
      d: null,
    };
  },
  methods: {
    generateInformation() {
      this.p = calc.findPrime();
      this.q = calc.findPrime();
      this.phi = (this.p - 1) * (this.q - 1);
      this.n = this.p * this.q;

      // Log the information to the console
      console.log("p:", this.p);
      console.log("q:", this.q);
      console.log("ϕ(n):", this.phi);
      console.log("n:", this.n);

      // Generate e
      let foundEncryptionKey = false;
      while (!foundEncryptionKey) {
        this.e = Math.floor(Math.random() * (this.phi - 2)) + 2;
        if (calc.gcd(this.e, this.phi) === 1) {
          foundEncryptionKey = true;
        }
      }

      // Log e and its verification status
      console.log("e:", this.e);
      console.log("Verification Status:", calc.gcd(this.e, this.phi) === 1);

      // Calculate d
      this.d = calc.findModInverse(this.e, this.phi);

      // Log d and its verification status
      console.log("d:", this.d);
      console.log("Verification Status:", (this.e * this.d) % this.phi === 1);
    },
    signMessage() {
      // Implement the logic for signing the message
      // Update the data properties accordingly
    },
    verifyVoter() {
      // Implement the logic for verifying the voter's eligibility
      // Update the data properties accordingly
    },
    unwrapSignature() {
      // Implement the logic for unwrapping the signature
      // Update the data properties accordingly
    },
    blindMessage() {
      // Implement the logic for blinding the message
      // Update the data properties accordingly
    },
    verifySignature() {
      // Implement the logic for verifying the signature
      // Update the data properties accordingly
    },
  },
};
</script>

<template>
  <h1>heleoheofjoea</h1>
  <button @click="generateInformation">apsdasod</button>
</template>
