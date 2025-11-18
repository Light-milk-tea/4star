<template>
  <div class="app">
    <Navigation />
    <main class="main-content">
      <router-view />
    </main>
    <footer v-if="$route.path === '/'" class="footer">
      <div class="footer-content">
        <span>made by 轻茗</span>
        <span class="footer-separator">•</span>
        <span>关注b站"创世纪乐部"</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Navigation from './components/Navigation.vue'
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 0;
}

.footer {
  background: var(--white);
  border-top: 1px solid var(--gray-200);
  padding: var(--space-4) 0;
  margin-top: auto;
}

.footer-content {
  max-width: var(--container-lg);
  margin: 0 auto;
  padding: 0 var(--space-4);
  text-align: center;
  color: var(--gray-500);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.footer-separator {
  color: var(--gray-300);
}

@media (max-width: 640px) {
  .footer-content {
    flex-direction: column;
    gap: var(--space-1);
  }
  
  .footer-separator {
    display: none;
  }
}
</style>