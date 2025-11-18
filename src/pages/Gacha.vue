<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <router-link to="/" class="btn btn-secondary">
          <span class="btn-icon">←</span>
          返回主页
        </router-link>
        <h1 class="page-title">四星队模拟抽卡</h1>
        <p class="page-subtitle">测试你的欧气！</p>
      </div>

      <div class="card">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">总抽取次数</div>
            <div class="stat-value">{{ totalPulls }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">四星获得</div>
            <div class="stat-value">{{ fourStarCount }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">四星概率</div>
            <div class="stat-value">{{ fourStarRate }}%</div>
          </div>
          
        </div>

        <div class="alert alert-warning" v-if="pullsSinceLast4Star >= 40">
          <div class="alert-icon">⚠️</div>
          <div class="alert-content">
            保底机制已激活！当前4星概率已提升至 {{ current4StarRate }}%
            <span v-if="pullsSinceLast4Star >= 50">（每抽+2%）</span>
          </div>
        </div>

        <div class="gacha-display">
          <div class="result-area" v-if="currentResults.length > 0">
            <div class="result-grid" v-if="currentResults.length > 1">
              <div 
                v-for="(result, index) in currentResults" 
                :key="result.id"
                class="result-card result-card-small" 
                :class="`rarity-${result.rarity}`"
                :style="{ animationDelay: `${index * 0.05}s` }"
              >
                <div class="result-rarity">{{ result.rarity }}★</div>
                <div class="result-name">{{ result.name }}</div>
                <div class="result-class">{{ result.class }}</div>
              </div>
            </div>
            <div class="result-card-wrapper" v-else>
              <div class="result-card" :class="`rarity-${currentResults[0].rarity}`">
                <div class="result-rarity">{{ currentResults[0].rarity }}★</div>
                <div class="result-name">{{ currentResults[0].name }}</div>
                <div class="result-class">{{ currentResults[0].class }}</div>
              </div>
            </div>
          </div>
          
          <div class="placeholder" v-else>
            <div class="placeholder-text">点击抽卡开始</div>
          </div>
        </div>

        <div class="button-group">
          <button 
            class="btn btn-primary" 
            @click="doPull(1)"
            :disabled="isPulling"
          >
            单抽
          </button>
          <button 
            class="btn btn-accent" 
            @click="doPull(10)"
            :disabled="isPulling"
          >
            十连抽
          </button>
        </div>

        <div class="history-section" v-if="history.length > 0">
          <h3 class="section-title">抽卡历史</h3>
          <div class="history-list">
            <div 
              v-for="(item, index) in history.slice(-10)" 
              :key="index"
              class="history-item"
              :class="`rarity-${item.rarity}`"
            >
              <span class="history-rarity">{{ item.rarity }}★</span>
              <span class="history-name">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <div class="probability-info">
          <h4 class="section-title">概率说明</h4>
          <div class="prob-list">
            <div class="prob-item">
              <span class="prob-rarity" data-rarity="1">1★</span>
              <span class="prob-value">38%</span>
            </div>
            <div class="prob-item">
              <span class="prob-rarity" data-rarity="2">2★</span>
              <span class="prob-value">50%</span>
            </div>
            <div class="prob-item">
              <span class="prob-rarity" data-rarity="3">3★</span>
              <span class="prob-value">10%</span>
            </div>
            <div class="prob-item">
              <span class="prob-rarity" data-rarity="4">4★</span>
              <span class="prob-value">2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Operator {
  name: string
  rarity: number
  class: string  // 职业：先锋、近卫、重装、狙击、术师、医师、辅助、特种
}

interface PullResult extends Operator {
  id: number
}

const defaultOperators: Operator[] = [
  // 1星干员 (38%)
  { name: 'Lancet-2', rarity: 1, class: '医师' },
  { name: 'Castle-3', rarity: 1, class: '近卫' },
  { name: 'THRM-EX', rarity: 1, class: '特种' },
  { name: '夜刀', rarity: 1, class: '先锋' },
  { name: '黑角', rarity: 1, class: '重装' },
  
  // 2星干员 (50%)
  { name: '玫兰莎', rarity: 2, class: '近卫' },
  { name: '史都华德', rarity: 2, class: '术师' },
  { name: '梓兰', rarity: 2, class: '辅助' },
  { name: '芙蓉', rarity: 2, class: '医师' },
  { name: '安赛尔', rarity: 2, class: '医师' },
  { name: '炎熔', rarity: 2, class: '术师' },
  { name: '米格鲁', rarity: 2, class: '重装' },
  { name: '克洛丝', rarity: 2, class: '狙击' },
  { name: '芬', rarity: 2, class: '先锋' },
  { name: '香草', rarity: 2, class: '先锋' },
  
  // 3星干员 (10%)
  { name: '翎羽', rarity: 3, class: '先锋' },
  { name: '斑点', rarity: 3, class: '重装' },
  { name: '松果', rarity: 3, class: '狙击' },
  { name: '月见夜', rarity: 3, class: '近卫' },
  { name: '泡普卡', rarity: 3, class: '近卫' },
  { name: '杰西卡', rarity: 3, class: '狙击' },
  { name: '流星', rarity: 3, class: '狙击' },
  { name: '白雪', rarity: 3, class: '狙击' },
  { name: '远山', rarity: 3, class: '术师' },
  { name: '史都华德', rarity: 3, class: '术师' },
  
  // 4星干员 (2%)
  { name: '桃金娘', rarity: 4, class: '先锋' },
  { name: '红豆', rarity: 4, class: '先锋' },
  { name: '清道夫', rarity: 4, class: '先锋' },
  { name: '蛇屠箱', rarity: 4, class: '重装' },
  { name: '古米', rarity: 4, class: '重装' },
  { name: '梅', rarity: 4, class: '狙击' },
  { name: '安比尔', rarity: 4, class: '狙击' },
  { name: '艾丽妮', rarity: 4, class: '术师' },
  { name: '刻俄柏', rarity: 4, class: '术师' },
  { name: '调香师', rarity: 4, class: '医师' }
]

const operators = ref<Operator[]>(defaultOperators)

// 四星干员职业映射表
const operatorClassMap: Record<string, string> = {
  '阿消': '特种', '艾丝黛尔': '近卫', '安比尔': '狙击', '暗索': '特种', '白雪': '狙击',
  '波登可': '辅助', '布丁': '重装', '缠丸': '近卫', '骋风': '先锋', '地灵': '辅助',
  '调香师': '医师', '杜宾': '近卫', '断罪者': '近卫', '芳汀': '近卫', '格雷伊': '术师',
  '古米': '重装', '褐果': '医师', '红豆': '先锋', '红云': '狙击', '嘉维尔': '医师',
  '坚雷': '重装', '角峰': '重装', '孑': '特种', '杰克': '特种', '杰西卡': '狙击',
  '卡达': '术师', '刻刀': '近卫', '砾': '特种', '猎蜂': '近卫', '流星': '狙击',
  '露托': '重装', '罗比菈塔': '辅助', '梅': '狙击', '末药': '医师', '慕斯': '近卫',
  '泡泡': '重装', '铅踝': '狙击', '清道夫': '先锋', '清流': '医师', '蛇屠箱': '重装',
  '深靛': '术师', '深海色': '辅助', '石英': '术师', '霜叶': '近卫', '松果': '狙击',
  '苏苏洛': '医师', '酸糖': '狙击', '桃金娘': '先锋', '维荻': '辅助', '乌有': '特种',
  '巫恋': '辅助', '锡兰': '医师', '晓歌': '先锋', '雪雉': '特种', '亚叶': '医师',
  '宴': '近卫', '夜烟': '术师', '伊桑': '特种', '远山': '术师', '跃跃': '先锋',
  '云迹': '先锋'
}

async function loadOperatorsFromExcelJson() {
  const base = import.meta.env.BASE_URL || '/'
  const url = `${base}excel/operators.json`
  try {
    const res = await fetch(url)
    if (!res.ok) return
    const data = await res.json()
    if (Array.isArray(data)) {
      // 使用Excel文件中的所有干员数据，不再混合默认数据
      operators.value = data.map((d: any) => ({ 
        name: String(d.name), 
        rarity: Number(d.rarity), 
        class: operatorClassMap[d.name] || d.class || '未知' 
      }))
    }
  } catch {}
}

onMounted(() => {
  loadOperatorsFromExcelJson()
})

// 状态管理
const currentResults = ref<PullResult[]>([])
const history = ref<PullResult[]>([])
const isPulling = ref(false)
const totalPulls = ref(0)
const fourStarCount = ref(0)
const pullsSinceLast4Star = ref(0)  // 距离上次4星的抽数
const current4StarRate = ref(2)   // 当前4星概率（百分比）

// 计算属性
const fourStarRate = computed(() => {
  if (totalPulls.value === 0) return current4StarRate.value
  return current4StarRate.value.toFixed(1)
})

// 抽卡逻辑
function doPull(times: number) {
  if (isPulling.value) return
  
  isPulling.value = true
  
  // 清空当前结果
  currentResults.value = []
  
  // 立即执行所有抽卡
  const results: PullResult[] = []
  for (let i = 0; i < times; i++) {
    const result = pullOnce()
    results.push(result)
    history.value.push(result)
    totalPulls.value++
    
    if (result.rarity === 4) {
      fourStarCount.value++
    }
  }
  
  // 一次性显示所有结果
  currentResults.value = results
  isPulling.value = false
}

function pullOnce(): PullResult {
  const random = Math.random() * 100
  let rarity: number
  
  // 应用保底概率机制
  const actual4StarRate = current4StarRate.value
  
  if (random < actual4StarRate) {
    rarity = 4
    // 抽到4星后重置概率和计数
    current4StarRate.value = 2
    pullsSinceLast4Star.value = 0
  } else if (random < actual4StarRate + 10) {
    rarity = 3
    pullsSinceLast4Star.value++
  } else if (random < actual4StarRate + 60) {
    rarity = 2
    pullsSinceLast4Star.value++
  } else {
    rarity = 1
    pullsSinceLast4Star.value++
  }
  
  // 更新保底概率（50抽后每抽增加2%）
  if (pullsSinceLast4Star.value >= 50) {
    current4StarRate.value = 2 + (pullsSinceLast4Star.value - 49) * 2
  }
  
  const availableOps = operators.value.filter(op => op.rarity === rarity)
  const selected = availableOps[Math.floor(Math.random() * availableOps.length)]
  
  return {
    ...selected,
    id: Date.now() + Math.random()
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--gray-600);
  margin-bottom: 1rem;
}

.card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--primary-50);
  border-radius: var(--radius-md);
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-600);
}

.alert {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
  border: 1px solid var(--warning-200);
  background: var(--warning-50);
}

.alert-icon {
  font-size: 1.5rem;
  animation: pulse 2s ease-in-out infinite;
}

.alert-content {
  font-weight: 500;
  color: var(--warning-800);
}

.gacha-display {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.placeholder {
  text-align: center;
  color: var(--gray-500);
}

.placeholder-text {
  font-size: 1.1rem;
  font-weight: 500;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 800px;
}

.result-card {
  background: var(--white);
  padding: 2rem 3rem;
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-lg);
  border: 2px solid;
  animation: fadeInUp 0.5s ease-out;
}

.result-card-small {
  padding: 1rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border-width: 1px;
  animation: fadeInUp 0.3s ease-out both;
}

.result-card-small.rarity-4 {
  border-color: #ff5a36;
  background: linear-gradient(135deg, #fff0f0 0%, #ffd9c2 50%, #ffb38a 100%);
  box-shadow: var(--shadow-md), 0 0 20px rgba(255, 74, 36, 0.25);
  border-width: 2px;
  animation: float 3s ease-in-out infinite;
}

.result-card-small .result-rarity {
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}

.result-card-small.rarity-4 .result-rarity {
  color: #ff4a24;
  font-weight: 800;
  text-shadow: 0 0 10px rgba(255, 74, 36, 0.35);
}

.result-card-small .result-name {
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
  font-weight: 600;
}

.result-card-small.rarity-4 .result-name {
  color: #c84a1a;
  font-weight: 700;
}

.result-card-small .result-class {
  font-size: 0.8rem;
  color: var(--gray-600);
}

.result-card-small.rarity-4 .result-class {
  color: #ff4a24;
  font-weight: 500;
}

.result-card-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.result-card.rarity-1 {
  border-color: var(--accent-600);
  background: linear-gradient(135deg, var(--accent-50) 0%, var(--accent-100) 100%);
}

.result-card.rarity-2 {
  border-color: var(--purple-500);
  background: linear-gradient(135deg, var(--purple-50) 0%, var(--purple-100) 100%);
}

.result-card.rarity-3 {
  border-color: var(--warning);
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
}

.result-card.rarity-4 {
  border-color: #ff5a36;
  background: linear-gradient(135deg, #fff0f0 0%, #ffd9c2 50%, #ffb38a 100%);
  box-shadow: var(--shadow-lg), 0 0 30px rgba(255, 74, 36, 0.35);
  position: relative;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.result-card.rarity-4::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 200, 150, 0.5), transparent);
  animation: shimmer 6s ease-in-out infinite;
  opacity: 0.6;
}

.result-rarity {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.result-card.rarity-1 .result-rarity { color: var(--accent-700); }
.result-card.rarity-2 .result-rarity { color: var(--purple-600); }
.result-card.rarity-3 .result-rarity { color: var(--warning); }
.result-card.rarity-4 .result-rarity { 
  color: #ff4a24;
  font-weight: 900;
  text-shadow: 0 0 15px rgba(255, 74, 36, 0.45);
}

.result-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--gray-900);
}

.result-card.rarity-4 .result-name {
  color: #c84a1a;
  font-weight: 800;
}

.result-class {
  font-size: 1rem;
  color: var(--gray-600);
}

.result-card.rarity-4 .result-class {
  color: #ff4a24;
  font-weight: 600;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.history-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  background: var(--primary-50);
  border-left: 4px solid;
}

.history-item.rarity-1 { border-left-color: var(--accent-600); }
.history-item.rarity-2 { border-left-color: var(--purple-500); }
.history-item.rarity-3 { border-left-color: var(--warning); }
.history-item.rarity-4 { border-left-color: #ff8a00; }

.history-rarity {
  font-weight: 700;
  min-width: 2rem;
  color: var(--gray-700);
}

.history-item.rarity-4 .history-rarity { 
  color: #ff7a00;
  font-weight: 800;
}

.history-name {
  font-weight: 600;
  color: var(--gray-900);
}

.probability-info {
  background: var(--primary-50);
  padding: 1.5rem;
  border-radius: var(--radius-md);
}

.prob-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.prob-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--white);
  border-radius: var(--radius-sm);
  border: 1px solid var(--gray-200);
}

.prob-rarity {
  font-weight: 700;
  font-size: 1.1rem;
}

.prob-rarity[data-rarity="1"] { color: var(--accent-700); }
.prob-rarity[data-rarity="2"] { color: var(--purple-600); }
.prob-rarity[data-rarity="3"] { color: var(--warning); }
.prob-rarity[data-rarity="4"] { 
  color: #ff7a00;
  font-weight: 800;
}

.prob-value {
  font-weight: 600;
  color: var(--gray-700);
}

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

@keyframes shimmer {
  0% {
    left: -100%;
    opacity: 0;
  }
  40% {
    opacity: 0.8;
  }
  60% {
    opacity: 0.8;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.4);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
  }
}

@media (max-width: 640px) {
  .page-container {
    padding: 1rem;
  }
  
  .card {
    padding: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 1rem;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .prob-list {
    grid-template-columns: 1fr;
  }
  
  .result-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .result-card {
    padding: 1.5rem;
  }
  
  .result-card-small {
    padding: 0.8rem;
  }
  
  .result-rarity {
    font-size: 1.5rem;
  }
  
  .result-name {
    font-size: 1.2rem;
  }
}
</style>