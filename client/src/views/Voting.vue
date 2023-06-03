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
    <h3 v-if="voted">Your secret key is: {{ vote_key }}</h3>
    <button @click="submitVote" :disabled="selectedOption === null">Vote</button>
    <div v-if="voted">
      <h3>Enter Your Name and Key to View Your Vote</h3>
      <div class="columns">
        <div class="column">
          <label for="view-name">Your Name:</label>
          <input type="text" id="view-name" v-model="viewName">
        </div>
        <div class="column">
          <label for="view-key">Key:</label>
          <input type="text" id="view-key" v-model="viewKey">
        </div>
      </div>
      <button @click="viewVote">View Vote</button>
      <p v-if="showVote">{{ voteMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      question: 'What is your favorite programming language?',
      vote: [
        { text: 'JavaScript', votes: 0 },
        { text: 'Python', votes: 0 },
        { text: 'Java', votes: 0 },
        { text: 'C++', votes: 0 }
      ],
      selectedOption: null,
      voted: false,
      vote_key: '',
      showVote: false,
      voteMessage: '',
      viewName: '',
      viewKey: ''
    };
  },
  methods: {
    submitVote() {
      this.vote[this.selectedOption].votes++;
      this.voted = true;
      this.vote_key = this.generateKey();
      this.voteMessage = '';
      this.showVote = false;

      axios.post('/api/vote', {
        username: this.username,
        vote_key: this.vote_key,
        vote: this.vote
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    },
    generateKey() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let key = '';
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        key += chars.charAt(randomIndex);
      }
      return key;
    },
    viewVote() {
  axios.post('/api/viewvote', {
    username: this.viewName,
    vote_key: this.viewKey
  })
  .then(response => {
    const voteData = response.data;
    if (voteData.error) {
      this.voteMessage = voteData.error;
    } else {
      this.showVote = true;
      if (voteData.vote && Array.isArray(voteData.vote)) {
        const votedOption = voteData.vote.find(option => option.username === this.viewName);
        if (votedOption) {
          this.voteMessage = `You voted for ${votedOption.vote}. Total votes: ${votedOption.votes}`;
        } else {
          this.voteMessage = 'You have not voted.';
        }
      } else {
        this.voteMessage = 'Invalid vote data. Please try again.';
      }
    }
  })
  .catch(error => {
    console.error(error);
  });
}

  }
};
</script>

<style>
.columns {
  display: flex;
}

.column {
  flex: 1;
  margin-right: 1rem;
}
</style>
