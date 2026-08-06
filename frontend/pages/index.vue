<template>
  <div style="padding: 2rem;">
    <h1>Users</h1>
    
    <!-- Loading state -->
    <p v-if="pending">Fetching data from the backend...</p>
    
    <!-- Error state -->
    <p v-else-if="error" style="color: red;">
      Error occurred during communication: {{ error }}
    </p>
    
    <!-- Successful response (Raw data output) -->
    <div v-else>
      <p>Successful response from the backend!</p>
      <pre style="background: #eee; padding: 1rem; border-radius: 8px;">
        {{ data }}
      </pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userService } from '~/services/userService'

const { data, pending, error } = await userService.getUsers()
</script>