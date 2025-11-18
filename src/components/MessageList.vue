<template>
  <div class="message-list">
    <div class="list-header">
      <h3>💭 留言列表</h3>
      <div class="message-stats">
        共 {{ messages.length }} 条留言
      </div>
    </div>
    
    <div v-if="messages.length === 0" class="empty-state">
      <div class="empty-icon">💬</div>
      <p>还没有留言，快来发表第一条留言吧！</p>
    </div>
    
    <div v-else class="messages-container">
      <div 
        v-for="message in messages" 
        :key="message.id" 
        class="message-card"
        :class="{ 'own-message': message.author === currentUser }"
      >
        <div class="message-header">
          <div class="author-info">
            <div class="author-avatar">🔥</div>
            <div class="author-name">{{ message.author }}</div>
          </div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
        
        <div class="message-content">
          {{ message.content }}
        </div>
        
        <div class="message-actions">
          <button 
            @click="toggleLike(message)" 
            class="like-btn"
            :class="{ 'liked': message.likedBy.includes(currentUser) }"
          >
            <span class="like-icon">❤️</span>
            <span class="like-count">{{ message.likes }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'

const props = defineProps<{
  messages: Message[]
  currentUser: string
}>()

const emit = defineEmits<{
  likeToggled: [messageId: string, userNickname: string]
}>()

const formatTime = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN')
}

const toggleLike = (message: Message) => {
  emit('likeToggled', message.id, props.currentUser)
}
</script>

<style scoped>
.message-list {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem 1.5rem; /* 减少左右内边距 */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 213, 79, 0.3);
  width: 100%; /* 确保列表占满容器宽度 */
  box-sizing: border-box; /* 确保padding包含在width内 */
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 213, 79, 0.3);
}

.list-header h3 {
  color: #E65100;
  margin: 0;
  font-size: 1.2rem;
}

.message-stats {
  color: #8D6E63;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #8D6E63;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-card {
  background: #FFF8E1;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 213, 79, 0.5);
  transition: all 0.3s ease;
}

.message-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-card.own-message {
  background: linear-gradient(135deg, #FFF8E1, #FFECB3);
  border-color: #FF9800;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  font-size: 1.2rem;
}

.author-name {
  font-weight: 600;
  color: #E65100;
}

.message-time {
  color: #8D6E63;
  font-size: 0.8rem;
}

.message-content {
  color: #5D4037;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  word-wrap: break-word;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #FFD54F;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.like-btn:hover {
  background: #FFF8E1;
  transform: scale(1.05);
}

.like-btn.liked {
  background: #FFECB3;
  border-color: #FF9800;
}

.like-icon {
  font-size: 1rem;
}

.like-count {
  color: #E65100;
  font-weight: 600;
  min-width: 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>