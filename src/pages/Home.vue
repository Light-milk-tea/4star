<template>
  <div class="home">
    <div class="hero">
      <h1 class="title">Ark-4Stars</h1>
      <p class="subtitle">四星队，Let's go!</p>
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
      <router-link to="/gacha" class="card">
        <div class="card-icon">🎲</div>
        <div class="card-title">模拟抽卡</div>
        <div class="card-desc">测试你的欧气！</div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #FFF8E1;
  position: relative;
  overflow-x: hidden;
}

.hero {
  text-align: center;
  padding: 4rem 5rem 3rem;
  width: 85%;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(255,193,7,0.4);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.8s ease-out;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #D84315;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 8px rgba(0,0,0,0.15);
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.8rem;
  color: #6D4C41;
  margin-bottom: 2.5rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.modules {
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, 320px));
  gap: 2rem;
  margin-top: 3rem;
  padding: 0 2rem 3rem;
  perspective: 1000px;
}

.card {
  display: block;
  padding: 2rem;
  border-radius: 20px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid rgba(255, 193, 7, 0.3);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  color: #5D4037;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.2s; }
.card:nth-child(3) { animation-delay: 0.3s; }

.card:hover {
  transform: translateY(-8px) rotateX(5deg);
  box-shadow: 0 25px 50px rgba(0,0,0,0.15);
  border-color: #FFB300;
  background: rgba(255, 255, 255, 1);
}

.card:hover .card-icon {
  transform: scale(1.2) rotate(5deg);
  animation: float 2s ease-in-out infinite;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  transition: transform 0.3s ease;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #D84315;
  margin-bottom: 0.8rem;
  letter-spacing: -0.01em;
}

.card-desc {
  font-size: 1rem;
  color: #6D4C41;
  line-height: 1.5;
  opacity: 0.9;
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