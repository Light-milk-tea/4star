<template>
  <div class="home">
    <div class="hero">
      <h1 class="title">Ark-4Stars</h1>
      <p class="subtitle">四星队小火留言 · 主编视频推荐 · 冠军排行</p>
    </div>
    <div class="modules">
      <router-link to="/messages" class="card">
        <div class="card-icon">💬</div>
        <div class="card-title">四星队小火留言</div>
        <div class="card-desc">地狱之门</div>
      </router-link>
      <router-link to="/videos" class="card">
        <div class="card-icon">🎬</div>
        <div class="card-title">主编视频推荐</div>
        <div class="card-desc">精选视频合集</div>
      </router-link>
      <router-link to="/champions" class="card">
        <div class="card-icon">🏆</div>
        <div class="card-title">四星干员冠军数量排行</div>
        <div class="card-desc">注：纯四星队合约</div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
  position: relative;
}

.hero {
  text-align: center;
  padding: 2rem 2rem 0;
  max-width: 800px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,213,79,0.35);
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.08);
}

.title {
  font-size: 3rem;
  font-weight: 700;
  color: #E65100;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  font-size: 1.5rem;
  color: #5D4037;
  margin-bottom: 2rem;
  font-weight: 500;
}

.modules {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 280px));
  gap: 1.2rem;
  margin-top: 1.5rem;
  padding: 0 1rem 2rem;
}

.card {
  display: block;
  padding: 1.3rem 1.5rem;
  border-radius: 16px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 213, 79, 0.45);
  box-shadow: 0 12px 26px rgba(0,0,0,0.09);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  color: #5D4037;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 30px rgba(0,0,0,0.12);
  border-color: #FFA000;
}

.card-icon {
  font-size: 1.4rem;
  margin-bottom: 0.4rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #E65100;
  margin-bottom: 0.3rem;
}

.card-desc {
  font-size: 0.95rem;
  color: #5D4037;
}

@media (max-width: 900px) {
  .modules {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 640px) {
  .modules {
    grid-template-columns: 1fr;
  }
  .hero {
    margin: 0 1rem;
  }
}
</style>