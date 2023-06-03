<template>
  <div>
    <h1>{{ question }}</h1>
    <label for="name">Your Name:</label>
    <input type="text" id="name" v-model="name">
    <ul>
      <li v-for="(option, index) in options" :key="index">
        <label>
          <input type="radio" :value="index" v-model="selectedOption">
          {{ option.text }} - Votes: {{ option.votes }}
        </label>
      </li>
    </ul>
    <h3 v-if="voted">Your secret key is: {{ voteKey }}</h3>
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
export default {
  data() {
    return {
      name: '',
      question: 'What is your favorite programming language?',
      options: [
        { text: 'JavaScript', votes: 0 },
        { text: 'Python', votes: 0 },
        { text: 'Java', votes: 0 },
        { text: 'C++', votes: 0 }
      ],
      selectedOption: null,
      voted: false,
      voteKey: '',
      showVote: false,
      voteMessage: '',
      viewName: '',
      viewKey: ''
    };
  },
  methods: {
    submitVote() {
      this.options[this.selectedOption].votes++;
      this.voted = true;
      this.voteKey = this.generateKey();
      this.voteMessage = '';
      this.showVote = false;

      // Save vote data to localStorage
      localStorage.setItem('voteData', JSON.stringify(this.options));
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
    if (this.viewKey === this.voteKey && this.viewName === this.name) {
      this.showVote = true;
      const votedOption = this.options.find(option => option.text === this.name);
      if (votedOption) {
        this.voteMessage = `You voted for ${votedOption.text}. Total votes: ${votedOption.votes}`;
      } else {
        this.voteMessage = 'You have not voted.';
      }
    } else {
      this.voteMessage = 'Invalid name or key. Please try again.';
    }
  }
  },
  watch: {
    viewName() {
      this.viewVote();
    },
    viewKey() {
      this.viewVote();
    }
  },
  mounted() {
  const voteData = localStorage.getItem('voteData');
  if (voteData) {
    this.options = JSON.parse(voteData);
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
