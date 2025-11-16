<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loadChampions, Operator } from '../utils/parseChampionExcel'

const operators = ref<Operator[]>([])
// 记录哪一行展开了
const expanded = ref<Set<string>>(new Set())

function toggleRow(name: string) {
  const s = new Set(expanded.value)
  if (s.has(name)) s.delete(name)
  else s.add(name)
  expanded.value = s
}

onMounted(async () => {
  operators.value = (await loadChampions()).filter(op => op.name !== '总数')
})
</script>

<template>
  <div class="page">
    <h1 class="title">合约冠军数排行（纯四星）</h1>
    <router-link to="/" class="back-home">返回主页</router-link>

    <div class="rank-container">
      <table class="rank-table">
        <colgroup>
          <col style="width:80px" />
          <col style="width:40%" />
          <col style="width:120px" />
          <col style="width:100px" />
        </colgroup>
        <thead>
          <tr>
            <th>排名</th>
            <th>干员名称</th>
            <th>冠军总数</th>
            <th>查看</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(op, index) in operators" :key="op.name">
            <tr>
              <td class="rank-number">{{ op.name === '总数' ? '' : (index + 1) }}</td>
              <td class="operator-name">{{ op.name }}</td>
              <td class="champion-count">{{ op.championCount }}</td>
              <td>
                <button class="view-btn" @click="toggleRow(op.name)">
                  {{ expanded.has(op.name) ? '收起' : '查看' }}
                </button>
              </td>
            </tr>
            <!-- 展开行 -->
            <tr v-if="expanded.has(op.name)" class="detail-row">
              <td colspan="4">
                <div class="titles-box">
                  <div class="titles-title">获得冠军：</div>
                  <div class="tags">
                    <span v-for="t in op.titles" :key="t" class="tag">{{ t }}</span>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  padding-top: 10vh;
  background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #E65100;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  transition: all 0.3s ease;
}
.back-home:hover {
  background: #FFD54F;
  color: #E65100;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

.rank-container {
  width: 80%;
  max-width: 1000px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  overflow-x: auto;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 213, 79, 0.3);
}

.rank-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.rank-table th {
  background: linear-gradient(135deg, #FFD54F 0%, #FFC107 100%);
  color: #5D4037;
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  white-space: nowrap;
  border-bottom: 2px solid #FFA000;
}

.rank-table td {
  padding: 1rem;
  border-bottom: 1px solid #FFE0B2;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.rank-table tr:nth-child(even) {
  background: #FFFDE7;
}

.rank-table tr:hover {
  background: #FFF9C4;
}

.rank-number {
  font-weight: 600;
  color: #F57C00;
  width: 80px;
}

.operator-name {
  font-weight: 500;
  color: #5D4037;
}

.champion-count {
  font-weight: 600;
  color: #E65100;
  text-align: center;
}

/* 查看按钮 */
.view-btn {
  background: linear-gradient(135deg, #FFB74D 0%, #FFA726 100%);
  color: #5D4037;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.view-btn:hover {
  background: linear-gradient(135deg, #FFA726 0%, #FF9800 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* 展开详情行 */
.detail-row td {
  background: #FFF8E1;
  padding: 0.8rem 1rem;
  overflow-wrap: anywhere;
  border-bottom: 2px solid #FFD54F;
}

.titles-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.titles-title {
  font-weight: 600;
  color: #E65100;
  font-size: 0.95rem;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.tag {
  background: linear-gradient(135deg, #FFD54F 0%, #FFC107 100%);
  color: #5D4037;
  font-size: 0.85rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  white-space: normal;
  overflow-wrap: anywhere;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 1px solid rgba(255, 167, 38, 0.3);
}
</style>