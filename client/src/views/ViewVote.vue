<template>
  <div>
    <h1>{{ question }}</h1>
    <ul>
      <li v-for="(v, index) in votes" :key="index">
        {{ v.text }} - Votes: {{ v.votes }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      question: 'Vote Result',
      votes: [
        { text: 'JavaScript', blindedVotes: [], votes: 0 },
        { text: 'Python', blindedVotes: [], votes: 0 },
        { text: 'Java', blindedVotes: [], votes: 0 },
        { text: 'C++', blindedVotes: [], votes: 0 }
      ]
    };
  },
  methods: {
    async fetchVoteData() {
      try {
        const response = await axios.get('http://localhost:3000/api/view');
        const voteData = response.data;

        for (const entry of voteData) {
          const { vote, token } = entry;

          if (this.validateToken(token)) {
            this.incrementVote(vote);
          } else {
            console.log(`Invalid token: ${token}`);
          }
        }
      } catch (error) {
        console.error('Failed to fetch vote data:', error);
      }
    },
    validateToken(token) {
      const minLength = 16;
      const maxLength = 16;
      const validCharacters = /^[a-zA-Z0-9]+$/;

      if (token.length < minLength || token.length > maxLength) {
        return false;
      }

      if (!validCharacters.test(token)) {
        return false;
      }

      return true;
    },
    incrementVote(vote) {
      const voteOption = this.votes.find(v => v.text === vote);

      if (voteOption) {
        voteOption.votes++;
      } else {
        console.error(`Invalid vote option: ${vote}`);
      }
    }
  },
  mounted() {
    this.fetchVoteData();
  }
};
</script>
