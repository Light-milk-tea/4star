import type { Message, MessageStorage, UserProfile } from '@/types/message'

const STORAGE_KEY = '4star-messages'

export class MessageStorageService {
  private static getStorage(): MessageStorage {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    
    const defaultStorage: MessageStorage = {
      messages: [],
      userProfile: {
        nickname: '小火苗'
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStorage))
    return defaultStorage
  }

  private static saveStorage(storage: MessageStorage): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
  }

  static getMessages(): Message[] {
    const storage = this.getStorage()
    return storage.messages.sort((a, b) => b.timestamp - a.timestamp)
  }

  static addMessage(content: string, author: string): Message {
    const storage = this.getStorage()
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content: content.trim(),
      author: author.trim(),
      timestamp: Date.now(),
      likes: 0,
      likedBy: []
    }
    
    storage.messages.push(newMessage)
    this.saveStorage(storage)
    
    return newMessage
  }

  static likeMessage(messageId: string, userNickname: string): void {
    const storage = this.getStorage()
    const message = storage.messages.find((m: Message) => m.id === messageId)
    
    if (message) {
      const userIndex = message.likedBy.indexOf(userNickname)
      if (userIndex === -1) {
        message.likes++
        message.likedBy.push(userNickname)
      } else {
        message.likes--
        message.likedBy.splice(userIndex, 1)
      }
      
      this.saveStorage(storage)
    }
  }

  static getUserProfile(): UserProfile {
    const storage = this.getStorage()
    return storage.userProfile
  }

  static updateUserProfile(profile: UserProfile): void {
    const storage = this.getStorage()
    storage.userProfile = profile
    this.saveStorage(storage)
  }

  static clearAllMessages(): void {
    const storage = this.getStorage()
    storage.messages = []
    this.saveStorage(storage)
  }
}