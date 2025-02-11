<script setup lang="ts">
</script>

<template>
  <div class="container">
    <router-view />
  </div>
</template>

<style scoped>
.container {
  margin: 0 auto;
}

@media (min-width: 1440px) {
  .container {
    max-width: 1380px;
  }
}

@media (min-width: 1920px) {
  .container {
    max-width: 1600px;
  }
}
</style>
