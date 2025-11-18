<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">四星队小火留言</h1>
        <p class="page-subtitle">分享你的四星队心得</p>
      </div>
      
      <div class="content-card">
        <MessageForm @message-added="handleMessageAdded" />
        <MessageList 
          :messages="messages" 
          :current-user="currentUser"
          @like-toggled="handleLikeToggled"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MessageForm from '@/components/MessageForm.vue'
import MessageList from '@/components/MessageList.vue'
import { MessageService } from '@/utils/messageService'
import type { Message } from '@/types/message'

const messages = ref<Message[]>([])
const currentUser = ref(MessageService.getUserProfile().nickname)

const loadMessages = async () => {
  try {
    messages.value = await MessageService.getMessages()
  } catch {}
}

const handleMessageAdded = () => {
  loadMessages()
}

const handleLikeToggled = async (messageId: string, userNickname: string) => {
  try {
    await MessageService.toggleLike(messageId, userNickname)
  } catch {}
  loadMessages()
}

onMounted(() => {
  loadMessages()
})
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

/* Responsive */
@media (max-width: 768px) {
  .page {
    padding: var(--space-4) 0;
  }
  
  .page-title {
    font-size: var(--text-3xl);
  }
  
  .page-subtitle {
    font-size: var(--text-base);
  }
}
</style>