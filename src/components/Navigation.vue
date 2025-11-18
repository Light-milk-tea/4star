<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-icon">⭐</span>
          <span class="brand-text">Ark-4Stars</span>
        </router-link>
      </div>
      
      <div class="nav-menu">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path" 
          class="nav-link"
          :class="{ active: $route.path === item.path }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.name }}
        </router-link>
      </div>
      
      <div class="nav-mobile-toggle" @click="toggleMobileMenu">
        <span class="toggle-icon">☰</span>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <div class="nav-mobile" :class="{ active: isMobileMenuOpen }">
      <router-link 
        v-for="item in navItems" 
        :key="item.path"
        :to="item.path" 
        class="nav-link mobile-link"
        :class="{ active: $route.path === item.path }"
        @click="closeMobileMenu"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        {{ item.name }}
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

const navItems = [
  { name: '首页', path: '/', icon: '🏠' },
  { name: '留言', path: '/messages', icon: '💬' },
  { name: '视频', path: '/videos', icon: '🎬' },
  { name: '排行', path: '/champions', icon: '🏆' },
  { name: '抽卡', path: '/gacha', icon: '🎲' },
  { name: 'DPS计算器', path: '/dps-calculator', icon: '⚔️' }
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-200);
  box-shadow: var(--shadow-sm);
}

.nav-container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  color: var(--gray-800);
  font-weight: var(--font-bold);
  font-size: var(--text-xl);
  transition: var(--transition-fast);
}

.brand-link:hover {
  color: var(--accent-600);
}

.brand-icon {
  font-size: var(--text-2xl);
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.brand-text {
  letter-spacing: -0.02em;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  color: var(--gray-600);
  text-decoration: none;
  font-weight: var(--font-medium);
  border-radius: var(--radius-lg);
  transition: var(--transition-fast);
  position: relative;
}

.nav-link:hover {
  color: var(--accent-600);
  background-color: var(--accent-50);
}

.nav-link.active {
  color: var(--accent-600);
  background-color: var(--accent-100);
}

.nav-icon {
  font-size: var(--text-sm);
}

.nav-mobile-toggle {
  display: none;
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.nav-mobile-toggle:hover {
  background-color: var(--gray-100);
}

.toggle-icon {
  font-size: var(--text-xl);
  color: var(--gray-600);
}

.nav-mobile {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-200);
  box-shadow: var(--shadow-lg);
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: var(--transition-normal);
}

.nav-mobile.active {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-link {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--gray-100);
}

.mobile-link:last-child {
  border-bottom: none;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .nav-mobile-toggle {
    display: block;
  }
  
  .nav-mobile {
    display: flex;
    flex-direction: column;
  }
  
  .nav-container {
    padding: 0 var(--space-3);
  }
}

@media (max-width: 640px) {
  .brand-text {
    font-size: var(--text-lg);
  }
  
  .nav-container {
    height: 3.5rem;
  }
}
</style>