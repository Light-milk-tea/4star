<template>
  <div class="gacha-page">
    <div class="gacha-container">
      <div class="gacha-header">
        <router-link to="/" class="back-home">返回主页</router-link>
        <h1 class="gacha-title">四星队模拟抽卡</h1>
        <p class="gacha-subtitle">测试你的欧气！</p>
      </div>

      <div class="gacha-stats">
        <div class="stat-item">
          <span class="stat-label">总抽取次数</span>
          <span class="stat-value">{{ totalPulls }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">四星获得</span>
          <span class="stat-value">{{ fourStarCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">四星概率</span>
          <span class="stat-value">{{ fourStarRate }}%</span>
        </div>
        <div class="stat-item" v-if="pullsSinceLast4Star >= 40">
          <span class="stat-label">保底进度</span>
          <span class="stat-value">{{ pullsSinceLast4Star }}/50</span>
        </div>
      </div>

      <div class="pity-warning" v-if="pullsSinceLast4Star >= 40">
        <div class="warning-icon">⚠️</div>
        <div class="warning-text">
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

      <div class="gacha-controls">
        <button 
          class="pull-button single-pull" 
          @click="doPull(1)"
          :disabled="isPulling"
        >
          单抽
        </button>
        <button 
          class="pull-button multi-pull" 
          @click="doPull(10)"
          :disabled="isPulling"
        >
          十连抽
        </button>
      </div>

      <div class="history-section" v-if="history.length > 0">
        <h3 class="history-title">抽卡历史</h3>
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
        <h4>概率说明</h4>
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
.gacha-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFF8E1;
  padding: 2rem;
}

.header-top {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #D84315;
  border-radius: 8px;
  color: #D84315;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: #D84315;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(216, 67, 21, 0.3);
}

/* 可选：绝对定位的返回按钮 */
.back-button-absolute {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
}

.back-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.gacha-container {
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  padding: 3rem;
  backdrop-filter: blur(12px);
}

.gacha-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
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
  z-index: 100;
  transition: all 0.3s ease;
}

.back-home:hover {
  background: #FFD54F;
  color: #E65100;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

.gacha-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #D84315;
  margin-bottom: 0.5rem;
}

.gacha-subtitle {
  font-size: 1.2rem;
  color: #6D4C41;
  opacity: 0.8;
}

.gacha-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  background: rgba(255, 193, 7, 0.1);
  padding: 1.5rem;
  border-radius: 16px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: #6D4C41;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #D84315;
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
  color: #6D4C41;
  opacity: 0.6;
}

.placeholder-text {
  font-size: 1.1rem;
  text-align: center;
  color: #6D4C41;
  opacity: 0.8;
  font-weight: 500;
}

.result-card {
  background: white;
  padding: 2rem 3rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  border: 3px solid;
  animation: fadeInUp 0.5s ease-out;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 800px;
}

.result-card-small {
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border-width: 2px;
  animation: fadeInUp 0.3s ease-out both;
}

.result-card-small.rarity-4 {
  border-color: #F44336;
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 30%, #EF9A9A 60%, #E57373 100%);
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.3), 0 0 25px rgba(211, 47, 47, 0.15);
  border-width: 3px;
  animation: float 3s ease-in-out infinite;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.result-card-small .result-rarity {
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}

.result-card-small.rarity-4 .result-rarity {
  background: linear-gradient(45deg, #FF1744, #FF5252, #FF8A80);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(255, 23, 68, 0.6), 0 0 30px rgba(255, 82, 82, 0.4);
  font-weight: 900;
  animation: textGlow 2s ease-in-out infinite alternate;
}

.result-card-small .result-name {
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
}

.result-card-small.rarity-4 .result-name {
  background: linear-gradient(45deg, #B71C1C, #D32F2F);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  text-shadow: 0 0 8px rgba(183, 28, 28, 0.3);
}

.result-card-small .result-class {
  font-size: 0.8rem;
}

.result-card-small.rarity-4 .result-class {
  color: #BF360C;
  font-weight: 600;
  text-shadow: 0 0 4px rgba(191, 54, 12, 0.2);
}

.result-card-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.result-card.rarity-1 {
  border-color: #2196F3;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
}

.result-card.rarity-2 {
  border-color: #BA68C8;
  background: linear-gradient(135deg, #F5F0FF 0%, #E1D5F7 100%);
}

.result-card.rarity-3 {
  border-color: #FFD700;
  background: linear-gradient(135deg, #FFF8DC 0%, #FFD700 100%);
}

.result-card.rarity-4 {
  border-color: #D32F2F;
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 25%, #EF9A9A 50%, #E57373 75%, #F44336 100%);
  box-shadow: 0 8px 25px rgba(244, 67, 54, 0.4), 0 0 40px rgba(211, 47, 47, 0.2);
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  animation: shimmer 6s ease-in-out infinite;
  opacity: 0.7;
}

.result-rarity {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.result-card.rarity-1 .result-rarity { color: #1565C0; text-shadow: 0 2px 4px rgba(33, 150, 243, 0.3); }
.result-card.rarity-2 .result-rarity { color: #8E24AA; text-shadow: 0 2px 4px rgba(186, 104, 200, 0.3); }
.result-card.rarity-3 .result-rarity { color: #F57C00; text-shadow: 0 2px 4px rgba(255, 215, 0, 0.3); }
.result-card.rarity-4 .result-rarity { 
  background: linear-gradient(45deg, #FF1744, #FF5252, #FF8A80, #FFC107);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(255, 23, 68, 0.8), 0 0 40px rgba(255, 82, 82, 0.6);
  font-weight: 900;
  animation: textGlow 2s ease-in-out infinite alternate;
  position: relative;
}

.result-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #D84315;
}

.result-card.rarity-4 .result-name {
  background: linear-gradient(45deg, #B71C1C, #D32F2F, #FF5722);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  text-shadow: 0 0 15px rgba(183, 28, 28, 0.4);
  animation: nameGlow 2.5s ease-in-out infinite alternate;
}

.result-class {
  font-size: 1rem;
  color: #6D4C41;
  opacity: 0.8;
}

.result-card.rarity-4 .result-class {
  color: #BF360C;
  font-weight: 600;
  opacity: 0.9;
  text-shadow: 0 0 8px rgba(191, 54, 12, 0.3);
}

.gacha-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.pull-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.single-pull {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: white;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.multi-pull {
  background: linear-gradient(135deg, #FF9800, #FFB74D);
  color: white;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.pull-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(0,0,0,0.25);
  filter: brightness(1.05);
}

.single-pull:hover:not(:disabled) {
  box-shadow: 0 12px 25px rgba(76, 175, 80, 0.3);
}

.multi-pull:hover:not(:disabled) {
  box-shadow: 0 12px 25px rgba(255, 152, 0, 0.3);
}

.pull-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.history-section {
  margin-bottom: 2rem;
}

.history-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #D84315;
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
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 193, 7, 0.1);
}

.history-item.rarity-1 { border-left: 4px solid #2196F3; }
.history-item.rarity-2 { border-left: 4px solid #BA68C8; }
.history-item.rarity-3 { border-left: 4px solid #FFD700; }
.history-item.rarity-4 { border-left: 4px solid #F44336; }

.history-rarity {
  font-weight: 700;
  min-width: 2rem;
}

.history-item.rarity-1 .history-rarity { color: #1565C0; }
.history-item.rarity-2 .history-rarity { color: #8E24AA; }
.history-item.rarity-3 .history-rarity { color: #F57C00; }
.history-item.rarity-4 .history-rarity { 
  background: linear-gradient(45deg, #FF1744, #FF5252);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
  text-shadow: 0 0 8px rgba(255, 23, 68, 0.4);
}

.history-name {
  font-weight: 600;
  color: #D84315;
}

.probability-info {
  background: rgba(255, 193, 7, 0.1);
  padding: 1.5rem;
  border-radius: 16px;
}

.probability-info h4 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #D84315;
  margin-bottom: 1rem;
  text-align: center;
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
  background: white;
  border-radius: 8px;
}

.prob-rarity {
  font-weight: 700;
  font-size: 1.1rem;
}

.prob-rarity[data-rarity="1"] { color: #2196F3; }
.prob-rarity[data-rarity="2"] { color: #BA68C8; }
.prob-rarity[data-rarity="3"] { color: #FFD700; }
.prob-rarity[data-rarity="4"] { 
  background: linear-gradient(45deg, #F44336, #FF5252);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.prob-value {
  font-weight: 600;
  color: #D84315;
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

@keyframes rainbow {
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(180deg); }
}

@keyframes redYellowShift {
  0%, 100% { 
    border-color: #D32F2F;
    background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 25%, #EF9A9A 50%, #E57373 75%, #F44336 100%);
    box-shadow: 0 8px 25px rgba(244, 67, 54, 0.4), 0 0 40px rgba(211, 47, 47, 0.2);
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

@keyframes textGlow {
  0% {
    text-shadow: 0 0 15px rgba(255, 23, 68, 0.6), 0 0 30px rgba(255, 82, 82, 0.4);
  }
  100% {
    text-shadow: 0 0 25px rgba(255, 23, 68, 0.8), 0 0 50px rgba(255, 82, 82, 0.6), 0 0 75px rgba(255, 138, 128, 0.4);
  }
}

@keyframes nameGlow {
  0% {
    text-shadow: 0 0 10px rgba(183, 28, 28, 0.3);
  }
  100% {
    text-shadow: 0 0 20px rgba(183, 28, 28, 0.5), 0 0 30px rgba(211, 47, 47, 0.3);
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

.pity-warning {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
  border: 2px solid #FF9800;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  animation: pulse 2s ease-in-out infinite;
}

.warning-icon {
  font-size: 1.5rem;
  animation: shake 0.5s ease-in-out infinite alternate;
}

.warning-text {
  font-weight: 600;
  color: #D84315;
  line-height: 1.4;
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

@keyframes shake {
  0% { transform: translateX(-2px); }
  100% { transform: translateX(2px); }
}

@media (max-width: 640px) {
  .gacha-container {
    padding: 2rem;
  }
  
  .gacha-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .gacha-controls {
    flex-direction: column;
  }
  
  .prob-list {
    grid-template-columns: 1fr;
  }
  
  .result-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .result-card-small {
    padding: 0.8rem;
  }
  
  .result-card-small .result-rarity {
    font-size: 1rem;
  }
  
  .result-card-small .result-name {
    font-size: 0.8rem;
  }
  
  .result-card-small .result-class {
    font-size: 0.7rem;
  }
}
</style>