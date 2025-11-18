<template>
  <div class="page">
    <h1 class="title">四星队小火留言</h1>
    <router-link to="/" class="back-home">返回主页</router-link>
    
    <div class="content">
      <MessageForm @message-added="handleMessageAdded" />
      <MessageList 
        :messages="messages" 
        :current-user="currentUser"
        @like-toggled="handleLikeToggled"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MessageForm from '@/components/MessageForm.vue'
import MessageList from '@/components/MessageList.vue'
import { MessageStorageService } from '@/utils/messageStorage'
import type { Message } from '@/types/message'

const messages = ref<Message[]>([])
const currentUser = ref(MessageStorageService.getUserProfile().nickname)

const loadMessages = () => {
  messages.value = MessageStorageService.getMessages()
}

const handleMessageAdded = () => {
  loadMessages()
}

const handleLikeToggled = (messageId: string, userNickname: string) => {
  MessageStorageService.likeMessage(messageId, userNickname)
  loadMessages()
}

onMounted(() => {
  loadMessages()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 3rem 1rem 2rem; /* 稍微增加左右内边距 */
  background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
}
.title {
  font-size: 2rem;
  font-weight: 700;
  color: #E65100;
  text-align: center;
  margin-bottom: 2rem;
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
}
.content {
  width: 90%; /* 舒适的宽度比例 */
  max-width: 1400px; /* 适中的最大宽度 */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .content {
    width: 92%; /* 大屏幕保持宽敞 */
  }
}

@media (max-width: 768px) {
  .content {
    width: 95%; /* 平板设备较宽 */
  }
  
  .title {
    font-size: 1.5rem; /* 减小标题字体 */
    margin-bottom: 1.5rem;
  }
  
  .page {
    padding: 1rem 0.5rem; /* 减少页面内边距 */
  }
}

@media (max-width: 480px) {
  .content {
    width: 98%; /* 手机设备基本全宽 */
  }
  
  .title {
    font-size: 1.3rem;
  }
}
</style>