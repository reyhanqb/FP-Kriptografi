<template>
    <div>
      <h1>User Information</h1>
      <ul>
        <li v-for="(user, userId) in state.users" :key="userId">
          {{ user.username }} - {{ user.vote_key }} - {{ user.vote }}
        </li>
      </ul>
    </div>
  </template>
  
  
  <script>
import axios from 'axios';
import { reactive } from 'vue';

export default {
  setup() {
    const state = reactive({
      users: {},
    });

    const fetchUserInfo = () => {
      axios.get('http://localhost:3000/api/userinfo')
        .then(response => {
          response.data.forEach(user => {
            state.users[user.id] = user;
          });
        })
        .catch(error => {
          console.error(error);
        });
    };

    fetchUserInfo();

    return {
      state,
      fetchUserInfo,
    };
  },
};
  </script>
  