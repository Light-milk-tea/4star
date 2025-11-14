<template>
  <div class="app">
    <div class="star-container">
      <h1 class="star-text">4star</h1>
      <div class="star-decoration">⭐</div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.star-container {
  text-align: center;
  padding: 2rem;
}

.star-text {
  font-size: 4rem;
  font-weight: bold;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.1em;
}

.star-decoration {
  font-size: 3rem;
  margin-top: 1rem;
  animation: twinkle 2s infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}
</style>