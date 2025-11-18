<template>
  <div class="home">
    <div class="hero">
      <div class="hero-content">
        <div class="headline">
          <h1 class="title">Ark-4Stars</h1>
          <p class="subtitle">四星干员专题站</p>
        </div>
        <p class="tagline">四星队，Let's go!</p>
      </div>
    </div>
    
    <div class="container">
      <div class="modules">
        <router-link to="/messages" class="module-card">
          <div class="card-icon">💬</div>
          <div class="card-content">
            <h3 class="card-title">四星队小火留言</h3>
            <p class="card-desc">地狱之门</p>
          </div>
        </router-link>
        
        <router-link to="/videos" class="module-card">
          <div class="card-icon">🎬</div>
          <div class="card-content">
            <h3 class="card-title">四星队作战记录</h3>
            <p class="card-desc">茗喵严选</p>
          </div>
        </router-link>
        
        <router-link to="/champions" class="module-card">
          <div class="card-icon">🏆</div>
          <div class="card-content">
            <h3 class="card-title">四星干员冠军数量排行</h3>
            <p class="card-desc">注：纯四星队合约</p>
          </div>
        </router-link>
        
        <router-link to="/gacha" class="module-card">
          <div class="card-icon">🎲</div>
          <div class="card-content">
            <h3 class="card-title">模拟抽卡</h3>
            <p class="card-desc">测试你的欧气！</p>
          </div>
        </router-link>
        
        <router-link to="/dps-calculator" class="module-card">
          <div class="card-icon">⚔️</div>
          <div class="card-content">
            <h3 class="card-title">DPS计算器</h3>
            <p class="card-desc">精确计算干员输出能力</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
}

.hero {
  background: linear-gradient(135deg, var(--purple-600) 0%, var(--accent-600) 50%, var(--accent-700) 100%);
  color: var(--white);
  padding: var(--space-16) 0 var(--space-12);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: var(--container-md);
  margin: 0 auto;
  padding: 0 var(--space-4);
  animation: fadeIn 0.8s ease-out;
}

.title {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  margin: 0;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: var(--text-2xl);
  font-weight: var(--font-medium);
  margin: 0;
  opacity: 0.9;
}

.headline {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-2);
  justify-content: center;
  margin-bottom: var(--space-4);
}

.tagline {
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  opacity: 0.8;
  font-style: italic;
}

.container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: var(--space-12) var(--space-4);
}

.modules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-8);
}

.module-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-8);
  background: var(--white);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow-md);
  text-decoration: none;
  color: inherit;
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
  animation: slideInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.module-card:nth-child(1) { animation-delay: 0.1s; }
.module-card:nth-child(2) { animation-delay: 0.2s; }
.module-card:nth-child(3) { animation-delay: 0.3s; }
.module-card:nth-child(4) { animation-delay: 0.4s; }
.module-card:nth-child(5) { animation-delay: 0.5s; }
.module-card:nth-child(6) { animation-delay: 0.6s; }

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--purple-300);
}

.module-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--purple-500), var(--accent-500));
  opacity: 0;
  transition: var(--transition-normal);
}

.module-card:hover::before {
  opacity: 1;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: var(--space-4);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  transition: var(--transition-normal);
}

.module-card:hover .card-icon {
  transform: scale(1.1);
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--gray-800);
  margin-bottom: var(--space-2);
}

.card-desc {
  font-size: var(--text-sm);
  color: var(--gray-600);
  line-height: var(--leading-relaxed);
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: var(--space-12) 0 var(--space-8);
  }
  
  .title {
    font-size: var(--text-4xl);
  }
  
  .subtitle {
    font-size: var(--text-xl);
  }
  
  .container {
    padding: var(--space-8) var(--space-4);
  }
  
  .modules {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .module-card {
    padding: var(--space-6);
  }
}

@media (max-width: 480px) {
  .title {
    font-size: var(--text-3xl);
  }
  
  .subtitle {
    font-size: var(--text-lg);
  }
}
</style>