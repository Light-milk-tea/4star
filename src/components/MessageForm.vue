<template>
  <div class="message-form">
    <div class="form-header">
      <h3>💬 发表留言</h3>
      <div class="user-info">
        <span class="nickname-label">昵称：</span>
        <input 
          v-model="nickname" 
          @blur="updateNickname"
          class="nickname-input"
          placeholder="输入你的昵称"
          maxlength="20"
        />
      </div>
    </div>
    
    <textarea
      v-model="content"
      class="message-input"
      placeholder="分享你的想法..."
      :maxlength="500"
      rows="4"
      @keydown.enter.prevent="handleEnter"
    ></textarea>
    
    <div class="form-footer">
      <span class="char-count" :class="{ 'char-count-warning': content.length > 400 }">
        {{ content.length }}/500
      </span>
      <button 
        @click="submitMessage" 
        class="submit-btn"
        :disabled="!canSubmit"
      >
        🔥 发表
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MessageStorageService } from '@/utils/messageStorage'

const emit = defineEmits<{
  messageAdded: [message: any]
}>()

const content = ref('')
const nickname = ref(MessageStorageService.getUserProfile().nickname)

const canSubmit = computed(() => {
  return content.value.trim().length > 0 && nickname.value.trim().length > 0
})

const updateNickname = () => {
  if (nickname.value.trim()) {
    MessageStorageService.updateUserProfile({ nickname: nickname.value.trim() })
  }
}

const submitMessage = () => {
  if (!canSubmit.value) return
  
  const message = MessageStorageService.addMessage(
    content.value.trim(),
    nickname.value.trim()
  )
  
  content.value = ''
  emit('messageAdded', message)
}

const handleEnter = (event: KeyboardEvent) => {
  if (event.ctrlKey && canSubmit.value) {
    submitMessage()
  }
}
</script>

<style scoped>
.message-form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem 1.5rem; /* 减少左右内边距 */
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 213, 79, 0.3);
  width: 100%; /* 确保表单占满容器宽度 */
  box-sizing: border-box; /* 确保padding包含在width内 */
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.form-header h3 {
  color: #E65100;
  margin: 0;
  font-size: 1.2rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nickname-label {
  color: #5D4037;
  font-size: 0.9rem;
}

.nickname-input {
  padding: 0.25rem 0.5rem;
  border: 1px solid #FFD54F;
  border-radius: 6px;
  background: #FFF8E1;
  color: #E65100;
  font-size: 0.9rem;
  width: 120px;
}

.nickname-input:focus {
  outline: none;
  border-color: #FF9800;
  box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.2);
}

.message-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #FFD54F;
  border-radius: 12px;
  background: #FFF8E1;
  color: #5D4037;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  box-sizing: border-box; /* 确保padding和border包含在width内 */
}

.message-input:focus {
  outline: none;
  border-color: #FF9800;
  box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.2);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.char-count {
  color: #8D6E63;
  font-size: 0.9rem;
}

.char-count-warning {
  color: #F57C00;
  font-weight: 600;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #FF9800, #F57C00);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.submit-btn:disabled {
  background: #CCC;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .form-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .submit-btn {
    width: 100%;
  }
}
</style>