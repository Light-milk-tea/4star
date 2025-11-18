<template>
  <div class="dps-calculator">
    <div class="calculator-hero">
      <div class="calculator-content">
        <h1 class="calculator-title">明日方舟DPS计算器</h1>
        <p class="calculator-subtitle">还没搞。。。算dps晕晕</p>
      </div>
    </div>

    <div class="container">
      <div class="calculator-panel">
        <div class="input-section">
          <h2 class="section-title">干员基础属性</h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="attack">攻击力</label>
              <input 
                id="attack"
                v-model.number="operator.attack" 
                type="number" 
                class="form-input"
                placeholder="输入攻击力"
              >
            </div>
            
            <div class="form-group">
              <label for="attackSpeed">攻击速度</label>
              <input 
                id="attackSpeed"
                v-model.number="operator.attackSpeed" 
                type="number" 
                step="0.1"
                class="form-input"
                placeholder="输入攻击速度"
              >
            </div>
            
            <div class="form-group">
              <label for="damageScale">伤害倍率</label>
              <input 
                id="damageScale"
                v-model.number="operator.damageScale" 
                type="number" 
                step="0.1"
                class="form-input"
                placeholder="输入伤害倍率"
              >
            </div>
            
            <div class="form-group">
              <label for="hitCount">攻击次数</label>
              <input 
                id="hitCount"
                v-model.number="operator.hitCount" 
                type="number" 
                class="form-input"
                placeholder="输入攻击次数"
              >
            </div>
          </div>
        </div>

        <div class="result-section">
          <h2 class="section-title">计算结果</h2>
          
          <div class="result-grid">
            <div class="result-card">
              <div class="result-label">基础DPS</div>
              <div class="result-value">{{ formatNumber(basicDPS) }}</div>
            </div>
            
            <div class="result-card">
              <div class="result-label">技能DPS</div>
              <div class="result-value">{{ formatNumber(skillDPS) }}</div>
            </div>
            
            <div class="result-card">
              <div class="result-label">总伤害</div>
              <div class="result-value">{{ formatNumber(totalDamage) }}</div>
            </div>
            
            <div class="result-card">
              <div class="result-label">攻击间隔</div>
              <div class="result-value">{{ formatNumber(attackInterval, 2) }}s</div>
            </div>
          </div>
        </div>

        <div class="presets-section">
          <h2 class="section-title">常用干员预设</h2>
          
          <div class="presets-grid">
            <button 
              v-for="preset in operatorPresets" 
              :key="preset.name"
              class="preset-btn"
              @click="loadPreset(preset)"
            >
              <div class="preset-name">{{ preset.name }}</div>
              <div class="preset-class">{{ preset.class }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Operator {
  attack: number
  attackSpeed: number
  damageScale: number
  hitCount: number
}

interface OperatorPreset {
  name: string
  class: string
  attack: number
  attackSpeed: number
  damageScale: number
  hitCount: number
}

const operator = ref<Operator>({
  attack: 500,
  attackSpeed: 1.0,
  damageScale: 1.0,
  hitCount: 1
})

const operatorPresets: OperatorPreset[] = [
  { name: '能天使', class: '狙击', attack: 620, attackSpeed: 1.0, damageScale: 1.0, hitCount: 5 },
  { name: '艾雅法拉', class: '术师', attack: 800, attackSpeed: 2.9, damageScale: 1.0, hitCount: 1 },
  { name: '银灰', class: '近卫', attack: 720, attackSpeed: 1.3, damageScale: 1.0, hitCount: 1 },
  { name: '塞雷娅', class: '重装', attack: 450, attackSpeed: 1.2, damageScale: 1.0, hitCount: 1 },
  { name: '伊芙利特', class: '术师', attack: 950, attackSpeed: 2.9, damageScale: 1.0, hitCount: 1 },
  { name: '陈', class: '近卫', attack: 680, attackSpeed: 1.3, damageScale: 2.0, hitCount: 2 }
]

const basicDPS = computed(() => (operator.value.attack * operator.value.attackSpeed) / 1.0)
const skillDPS = computed(() => (operator.value.attack * operator.value.attackSpeed * operator.value.damageScale * operator.value.hitCount) / 1.0)
const totalDamage = computed(() => skillDPS.value * 10)
const attackInterval = computed(() => 1.0 / operator.value.attackSpeed)

function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function loadPreset(preset: OperatorPreset) {
  operator.value = { attack: preset.attack, attackSpeed: preset.attackSpeed, damageScale: preset.damageScale, hitCount: preset.hitCount }
}
</script>

<style scoped>
.dps-calculator { min-height: 100vh; background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%); }
.calculator-hero { background: linear-gradient(135deg, var(--accent-600) 0%, var(--purple-600) 100%); color: var(--white); padding: var(--space-12) 0 var(--space-8); text-align: center; }
.calculator-content { max-width: var(--container-md); margin: 0 auto; padding: 0 var(--space-4); }
.calculator-title { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-2) 0; letter-spacing: -0.02em; }
.calculator-subtitle { font-size: var(--text-xl); font-weight: var(--font-medium); margin: 0; opacity: 0.9; }
.container { max-width: var(--container-xl); margin: 0 auto; padding: var(--space-8) var(--space-4); }
.calculator-panel { display: flex; flex-direction: column; gap: var(--space-8); }
.input-section, .result-section, .presets-section { background: var(--white); border-radius: var(--radius-2xl); border: 1px solid var(--gray-200); box-shadow: var(--shadow-lg); padding: var(--space-8); }
.section-title { font-size: var(--text-2xl); font-weight: var(--font-semibold); color: var(--gray-800); margin: 0 0 var(--space-6) 0; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-6); }
.form-group { display: flex; flex-direction: column; gap: var(--space-2); }
.form-group label { font-weight: var(--font-medium); color: var(--gray-700); font-size: var(--text-sm); }
.form-input { padding: var(--space-3) var(--space-4); border: 1px solid var(--gray-300); border-radius: var(--radius-lg); font-size: var(--text-base); transition: var(--transition-fast); background: var(--white); }
.form-input:focus { outline: none; border-color: var(--accent-500); box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); }
.result-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-4); }
.result-card { background: linear-gradient(135deg, var(--accent-50) 0%, var(--purple-50) 100%); border-radius: var(--radius-xl); padding: var(--space-6); text-align: center; border: 1px solid var(--accent-200); }
.result-label { font-size: var(--text-sm); color: var(--gray-600); margin: 0 0 var(--space-2) 0; font-weight: var(--font-medium); }
.result-value { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--accent-700); margin: 0; }
.presets-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: var(--space-4); }
.preset-btn { background: var(--white); border: 1px solid var(--gray-300); border-radius: var(--radius-lg); padding: var(--space-4); cursor: pointer; transition: var(--transition-fast); text-align: center; }
.preset-btn:hover { background: var(--accent-50); border-color: var(--accent-400); transform: translateY(-2px); box-shadow: var(--shadow-md); }
.preset-name { font-weight: var(--font-semibold); color: var(--gray-800); margin: 0 0 var(--space-1) 0; font-size: var(--text-sm); }
.preset-class { font-size: var(--text-xs); color: var(--gray-600); margin: 0; }
@media (max-width: 768px) { .calculator-title { font-size: var(--text-3xl); } .calculator-subtitle { font-size: var(--text-lg); } .container { padding: var(--space-6) var(--space-4); } .input-section, .result-section, .presets-section { padding: var(--space-6); } .form-grid { grid-template-columns: 1fr; gap: var(--space-4); } .result-grid { grid-template-columns: repeat(2, 1fr); } .presets-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .result-grid { grid-template-columns: 1fr; } .presets-grid { grid-template-columns: 1fr; } }
</style>