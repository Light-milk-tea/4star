<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">主编视频推荐</h1>
        <p class="page-subtitle">精选四星队相关视频</p>
      </div>
      
      <div class="content-card">
        <div class="video-grid">
          <a
            v-for="(v, i) in list"
            :key="i"
            :href="v.href"
            class="video-card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="video-cover-wrapper">
              <img 
                v-if="v.cover" 
                :src="imgSrc(v.cover)" 
                alt="" 
                class="video-cover" 
                @error="onCoverError(i)" 
              />
              <div v-else class="video-cover-placeholder">
                <span class="video-icon">🎬</span>
              </div>
            </div>
            <div class="video-info">
              <h3 class="video-title">{{ v.title }}</h3>
              <p class="video-desc">{{ v.desc || (v.bv ? `BV：${v.bv}` : v.href) }}</p>
            </div>
          </a>
        </div>
        
        <div class="hint-box">
          <p class="hint-text">支持 BV 号或超链接，点击卡片跳转到相应视频。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

type RawVideo = { title: string; desc?: string; bv?: string; url?: string; cover?: string }
type Item = RawVideo & { href: string }

const raw: RawVideo[] = [
  { title: 'BV：BV1DL5TzxEnH', bv: 'BV1DL5TzxEnH' },
  { title: 'BV：BV14CaQzoEdm', bv: 'BV14CaQzoEdm' },
  { title: 'BV：BV1WQMWz5E15', bv: 'BV1WQMWz5E15' },
  { title: 'BV：BV1YVqCYCECh', bv: 'BV1YVqCYCECh' }
]

const list = ref<Item[]>(
  raw.map((v) => ({
    ...v,
    href: v.url ? v.url : v.bv ? `https://www.bilibili.com/video/${v.bv}` : '#'
  }))
)

const storageKey = 'videos.list'
const coverRetry: Record<number, number> = {}
const blockedBVs = new Set<string>(['BV1541oBcEKx'])
const isDev = import.meta.env.DEV

onMounted(async () => {
  try {
    const s = localStorage.getItem(storageKey)
    if (s) {
      const arr = JSON.parse(s) as RawVideo[]
      if (Array.isArray(arr)) {
        const mapped = arr.map((v) => toItem(v))
        list.value = mapped.length ? mapped : list.value
      }
    }
  } catch {}
  const defaults = raw.map((v) => toItem(v))
  for (const d of defaults) {
    if (!list.value.some((x) => x.href === d.href)) {
      list.value.unshift(d)
    }
  }
  list.value = list.value.filter((v) => !v.bv || !blockedBVs.has(v.bv))
  const tasks = list.value.map(async (v, i) => {
    if (v.bv) {
      try {
        const apiEndpoint = isDev
          ? `/api-bili/x/web-interface/view?bvid=${v.bv}`
          : `https://r.jina.ai/https://api.bilibili.com/x/web-interface/view?bvid=${v.bv}`
        const res = await fetch(apiEndpoint)
        const data = await res.json()
        const pic = data?.data?.pic as string | undefined
        const title = data?.data?.title as string | undefined
        const up = data?.data?.owner?.name as string | undefined
        if (pic) list.value[i].cover = normalizeCover(pic)
        if (title) list.value[i].title = title
        if (up) list.value[i].desc = up
      } catch {}
      if (!list.value[i].cover) {
        try {
          const htmlEndpoint = isDev
            ? `/html-bili/https://www.bilibili.com/video/${v.bv}`
            : `https://r.jina.ai/https://www.bilibili.com/video/${v.bv}`
          const res = await fetch(htmlEndpoint)
          const html = await res.text()
          const doc = new DOMParser().parseFromString(html, 'text/html')
          const m =
            doc.querySelector('meta[property="og:image"]') ||
            doc.querySelector('meta[itemprop="image"]') ||
            doc.querySelector('meta[name="og:image"]')
          const mt =
            doc.querySelector('meta[property="og:title"]') ||
            doc.querySelector('meta[name="og:title"]')
          const ma =
            doc.querySelector('meta[itemprop="author"]') ||
            doc.querySelector('meta[name="author"]')
          const content = m?.getAttribute('content') || ''
          const contentTitle = mt?.getAttribute('content') || doc.querySelector('title')?.textContent || ''
          const author = ma?.getAttribute('content') || ''
          if (content) list.value[i].cover = normalizeCover(content)
          if (contentTitle) list.value[i].title = contentTitle.trim()
          if (author) list.value[i].desc = author.trim()
        } catch {}
      }
    }
    if (!list.value[i].cover) {
      list.value[i].cover = `https://picsum.photos/seed/${v.bv || i}/640/360`
    }
  })
  await Promise.all(tasks)
  save()
})

function normalizeCover(u: string): string {
  try {
    const url = new URL(u)
    url.protocol = 'https:'
    if (url.hostname.endsWith('hdslb.com')) {
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
    if (url.hostname.endsWith('hdslb.com')) {
      return isDev ? `/img-bili${url.pathname}` : url.toString()
    }
    return url.toString()
  } catch {
    return u
  }
}

function onCoverError(i: number) {
  try {
    const u = new URL(list.value[i].cover || '')
    if (u.hostname.endsWith('hdslb.com')) {
      const n = (coverRetry[i] || 0) + 1
      coverRetry[i] = n
      const hosts = ['i0.hdslb.com', 'i1.hdslb.com', 'i2.hdslb.com']
      u.hostname = hosts[n % hosts.length]
      list.value[i].cover = u.toString()
      return
    }
  } catch {}
  list.value[i].cover = `https://picsum.photos/seed/${list.value[i].bv || i}/640/360`
}

function toItem(v: RawVideo): Item {
  return { ...v, href: v.url ? v.url : v.bv ? `https://www.bilibili.com/video/${v.bv}` : '#' }
}

 

 

function save() {
  try {
    const arr: RawVideo[] = list.value
      .filter((v) => !v.bv || !blockedBVs.has(v.bv))
      .map((v) => ({ title: v.title, desc: v.desc, bv: v.bv, url: v.url, cover: v.cover }))
    localStorage.setItem(storageKey, JSON.stringify(arr))
  } catch {}
}

watch(list, save, { deep: true })
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
  padding: var(--space-8) 0;
}

.container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.page-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--gray-800);
  margin-bottom: var(--space-2);
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: var(--text-lg);
  color: var(--gray-600);
  font-weight: var(--font-medium);
}

.content-card {
  background: var(--white);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-6);
  padding: var(--space-8);
}

.video-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: var(--transition-normal);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--accent-300);
}

.video-cover-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
}

.video-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-normal);
}

.video-card:hover .video-cover {
  transform: scale(1.05);
}

.video-cover-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-100) 0%, var(--accent-200) 100%);
}

.video-icon {
  font-size: 3rem;
  opacity: 0.7;
}

.video-info {
  padding: var(--space-4);
  background: var(--white);
}

.video-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--gray-800);
  margin-bottom: var(--space-2);
  line-height: var(--leading-snug);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-desc {
  font-size: var(--text-sm);
  color: var(--gray-600);
  line-height: var(--leading-relaxed);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hint-box {
  padding: var(--space-6) var(--space-8);
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
  text-align: center;
}

.hint-text {
  font-size: var(--text-sm);
  color: var(--gray-600);
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .page {
    padding: var(--space-4) 0;
  }
  
  .page-title {
    font-size: var(--text-3xl);
  }
  
  .video-grid {
    grid-template-columns: 1fr;
    padding: var(--space-4);
    gap: var(--space-4);
  }
  
  .hint-box {
    padding: var(--space-4);
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: var(--text-2xl);
  }
  
  .video-info {
    padding: var(--space-3);
  }
  
  .video-title {
    font-size: var(--text-base);
  }
  
  .video-desc {
    font-size: var(--text-xs);
  }
}
</style>