<template>
  <div class="p-10 text-center">
    <!-- Egy egyszerű teszt gomb -->
    <UButton label="Am I signed in?" @click="testAuthentication" />
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi';

const api = useApi();

const testAuthentication = async () => {
  try {
    const response = await api('/users/profile');
    console.log('Success! The servers response:', response);
    alert('Success! You are signed in!');
  } catch (error) {
    console.error('Error:', error);
    alert("Error: You're not signed in!");
  }
};
</script>
