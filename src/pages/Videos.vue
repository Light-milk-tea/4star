<template>
  <div class="page">
    <h1 class="title">主编视频推荐</h1>
    <router-link to="/" class="back-home">返回主页</router-link>
    <div class="content">
      <div class="list">
        <a
          v-for="(v, i) in list"
          :key="i"
          :href="v.href"
          class="card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img v-if="v.cover" :src="imgSrc(v.cover)" alt="" class="card-cover" @error="onCoverError(i)" />
          <div class="card-icon">🎬</div>
          <div class="card-title">{{ v.title }}</div>
          <div class="card-desc">{{ v.desc || (v.bv ? `BV：${v.bv}` : v.href) }}</div>
        </a>
      </div>
      <p class="hint">支持 BV 号或超链接，点击卡片跳转到相应视频。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

type RawVideo = { title: string; desc?: string; bv?: string; url?: string; cover?: string }
type Item = RawVideo & { href: string }

const raw: RawVideo[] = [
  { title: '示例：BV1541oBcEKx', desc: 'b站演示视频', bv: 'BV1541oBcEKx' }
]

const list = ref<Item[]>(
  raw.map((v) => ({
    ...v,
    href: v.url ? v.url : v.bv ? `https://www.bilibili.com/video/${v.bv}` : '#'
  }))
)

onMounted(async () => {
  const tasks = list.value.map(async (v, i) => {
    if (v.bv) {
      try {
        const res = await fetch(`/api-bili/x/web-interface/view?bvid=${v.bv}`)
        const data = await res.json()
        const pic = data?.data?.pic as string | undefined
        if (pic) list.value[i].cover = normalizeCover(pic)
      } catch {}
      if (!list.value[i].cover) {
        try {
          const res = await fetch(`/html-bili/https://www.bilibili.com/video/${v.bv}`)
          const html = await res.text()
          const doc = new DOMParser().parseFromString(html, 'text/html')
          const m =
            doc.querySelector('meta[property="og:image"]') ||
            doc.querySelector('meta[itemprop="image"]') ||
            doc.querySelector('meta[name="og:image"]')
          const content = m?.getAttribute('content') || ''
          if (content) list.value[i].cover = normalizeCover(content)
        } catch {}
      }
    }
    if (!list.value[i].cover) {
      list.value[i].cover = `https://picsum.photos/seed/${v.bv || i}/640/360`
    }
  })
  await Promise.all(tasks)
})

function normalizeCover(u: string): string {
  try {
    const url = new URL(u)
    if (url.hostname.endsWith('hdslb.com')) {
      url.protocol = 'https:'
      url.hostname = 'i0.hdslb.com'
    }
    return url.toString()
  } catch {
    return u
  }
}

function imgSrc(u: string): string {
  try {
    const url = new URL(u)
    if (url.hostname === 'i0.hdslb.com') {
      return `/img-bili${url.pathname}`
    }
    return u
  } catch {
    return u
  }
}

function onCoverError(i: number) {
  list.value[i].cover = `https://picsum.photos/seed/${list.value[i].bv || i}/640/360`
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
}
.title {
  font-size: 2rem;
  font-weight: 700;
  color: #E65100;
  margin-bottom: 1rem;
}
.back-home {
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: #FFF8E1;
  color: #E65100;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid #FFD54F;
}
.content {
  width: 80%;
  max-width: 860px;
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  border: 1px solid rgba(255,213,79,0.3);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  padding: 1.2rem 1.4rem;
}
.list {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 280px));
  gap: 1.1rem;
  margin-bottom: 0.8rem;
}
.card {
  display: block;
  padding: 1.1rem 1.3rem;
  border-radius: 16px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 213, 79, 0.45);
  box-shadow: 0 12px 26px rgba(0,0,0,0.09);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  color: #5D4037;
}
.card-cover {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 0.6rem;
  display: block;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 30px rgba(0,0,0,0.12);
  border-color: #FFA000;
}
.card-icon { font-size: 1.3rem; margin-bottom: 0.3rem; }
.card-title { font-size: 1.15rem; font-weight: 700; color: #E65100; margin-bottom: 0.25rem; }
.card-desc { font-size: 0.95rem; color: #5D4037; }
.hint { color: #5D4037; font-size: 0.95rem; }

@media (max-width: 900px) {
  .list { grid-template-columns: repeat(2, minmax(220px, 1fr)); }
}
@media (max-width: 640px) {
  .list { grid-template-columns: 1fr; }
}
</style>