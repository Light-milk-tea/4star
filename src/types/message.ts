export interface Message {
  id: string
  content: string
  author: string
  timestamp: number
  likes: number
  likedBy: string[]
}

export interface UserProfile {
  nickname: string
  avatar?: string
}

export interface MessageStorage {
  messages: Message[]
  userProfile: UserProfile
}