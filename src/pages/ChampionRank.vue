<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loadChampions, Operator } from '../utils/parseChampionExcel'

const operators = ref<Operator[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const expanded = ref<Set<string>>(new Set())

function toggleRow(name: string) {
  const s = new Set(expanded.value)
  if (s.has(name)) s.delete(name)
  else s.add(name)
  expanded.value = s
}

onMounted(async () => {
  try {
    operators.value = await loadChampions()
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">四星干员冠军排行</h1>
        <p class="page-subtitle">纯四星队合约统计</p>
      </div>
      
      <div class="content-card">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <div class="error-icon">⚠️</div>
          <p>加载失败：{{ error }}</p>
        </div>
        
        <div v-else-if="operators.length === 0" class="empty-state">
          <div class="empty-icon">📊</div>
          <p>暂无数据</p>
        </div>
        
        <div v-else class="rank-table-container">
          <div class="table-wrapper">
            <table class="rank-table">
              <thead>
                <tr>
                  <th class="rank-col">排名</th>
                  <th class="name-col">干员名称</th>
                  <th class="count-col">冠军总数</th>
                  <th class="action-col">详情</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(op, index) in operators" :key="op.name">
                  <tr class="rank-row" :class="{ 'top-4': index < 4 }">
                    <td class="rank-number">
                      <span class="rank-badge" :class="{ 'gold': index === 0, 'silver': index === 1, 'bronze': index === 2, 'fourth': index === 3 }">
                        {{ index + 1 }}
                      </span>
                    </td>
                    <td class="operator-name">{{ op.name }}</td>
                    <td class="champion-count">{{ op.championCount }}</td>
                    <td class="action-cell">
                      <button class="detail-btn" @click="toggleRow(op.name)">
                        <span class="btn-text">{{ expanded.has(op.name) ? '收起' : '展开' }}</span>
                        <span class="btn-icon" :class="{ 'rotated': expanded.has(op.name) }">▼</span>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="expanded.has(op.name)" class="detail-row">
                    <td colspan="4">
                      <div class="detail-content">
                        <div class="detail-header">
                          <h4 class="detail-title">获得冠军</h4>
                        </div>
                        <div class="tags-container">
                          <span v-for="title in op.titles" :key="title" class="title-tag">
                            {{ title }}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
  background: linear-gradient(180deg, var(--white) 0%, var(--gray-50) 100%);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  gap: var(--space-4);
  color: var(--gray-500);
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid var(--gray-200);
  border-top: 2px solid var(--accent-600);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-icon,
.empty-icon {
  font-size: var(--text-4xl);
  opacity: 0.7;
}

.table-wrapper {
  overflow-x: auto;
}

.rank-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.rank-table th {
  background: linear-gradient(180deg, var(--primary-50) 0%, var(--white) 100%);
  color: var(--gray-700);
  padding: var(--space-4);
  text-align: left;
  font-weight: var(--font-semibold);
  border-bottom: 1px solid var(--gray-200);
  white-space: nowrap;
}

.rank-table th.rank-col {
  text-align: center;
  width: 5rem;
}

.rank-table th.count-col {
  text-align: center;
  width: 6rem;
}

.rank-table th.action-col {
  text-align: center;
  width: 5rem;
}

.rank-row {
  border-bottom: 1px solid var(--gray-100);
  transition: var(--transition-fast);
}

.rank-row:hover {
  background: linear-gradient(90deg, var(--gray-50) 0%, var(--white) 100%);
}

.rank-row.top-4 {
  background: linear-gradient(135deg, var(--accent-50) 0%, var(--white) 100%);
  border-left: 4px solid var(--accent-600);
}

.rank-row:nth-of-type(even) {
  background: var(--gray-50);
}

.rank-row td {
  padding: var(--space-4);
  vertical-align: middle;
}

.rank-number {
  text-align: center;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
  color: var(--white);
  background: var(--gray-400);
}

.rank-badge.gold {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
}

.rank-badge.silver {
  background: linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%);
  box-shadow: 0 2px 8px rgba(156, 163, 175, 0.3);
}

.rank-badge.bronze {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.rank-badge.fourth {
  background: linear-gradient(135deg, var(--accent-400) 0%, var(--accent-600) 100%);
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.operator-name {
  font-weight: var(--font-medium);
  color: var(--gray-800);
}

.rank-row.top-4 .operator-name {
  font-weight: var(--font-semibold);
  color: var(--gray-900);
}

.champion-count {
  text-align: center;
  font-weight: var(--font-semibold);
  color: var(--accent-600);
  font-size: var(--text-lg);
}

.detail-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: var(--accent-600);
  color: var(--white);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: var(--transition-fast);
  white-space: nowrap;
}

.detail-btn:hover {
  background: var(--accent-700);
  transform: translateY(-1px);
}

.btn-icon {
  font-size: var(--text-xs);
  transition: var(--transition-fast);
}

.btn-icon.rotated {
  transform: rotate(180deg);
}

.detail-row {
  background: var(--accent-50);
  border-bottom: 1px solid var(--gray-200);
}

.detail-row td {
  padding: 0;
}

.detail-content {
  padding: var(--space-6);
}

.detail-header {
  margin-bottom: var(--space-4);
}

.detail-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--gray-800);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.title-tag {
  display: inline-flex;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  background: var(--white);
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: var(--transition-fast);
}

.title-tag:hover {
  background: var(--gray-50);
  border-color: var(--gray-300);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .page {
    padding: var(--space-4) 0;
  }
  
  .page-title {
    font-size: var(--text-3xl);
  }
  
  .rank-table {
    font-size: var(--text-xs);
  }
  
  .rank-table th,
  .rank-row td {
    padding: var(--space-3) var(--space-2);
  }
  
  .detail-content {
    padding: var(--space-4);
  }
}

@media (max-width: 480px) {
  .rank-table th.rank-col,
  .rank-table th.action-col {
    width: 4rem;
  }
  
  .rank-table th.count-col {
    width: 5rem;
  }
  
  .detail-btn {
    padding: var(--space-1) var(--space-2);
    font-size: var(--text-xs);
  }
}
</style>