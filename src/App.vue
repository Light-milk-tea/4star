<template>
  <div class="app">
    <router-view />
    <footer v-if="$route.path === '/'" class="footer">
      <div>made by 轻茗</div>
      <div>关注b站"创世纪乐部"</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #FFF9DB;
}

.footer {
  position: fixed;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 0.6rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  color: #5D4037;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 213, 79, 0.35);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  text-align: center;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}
</style>