import type { Message, UserProfile } from '@/types/message'
import { MessageStorageService } from '@/utils/messageStorage'

const API_URL = import.meta.env.VITE_MESSAGES_API_URL as string | undefined
const API_TOKEN = import.meta.env.VITE_MESSAGES_API_TOKEN as string | undefined
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const headers = (): Record<string, string> => {
  const base: Record<string, string> = { 'Content-Type': 'application/json' }
  if (API_TOKEN) base['Authorization'] = `Bearer ${API_TOKEN}`
  return base
}

const sbHeaders = (): Record<string, string> => {
  const base: Record<string, string> = { 'Content-Type': 'application/json' }
  if (SUPABASE_ANON_KEY) {
    base['apikey'] = SUPABASE_ANON_KEY
    base['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`
    base['Prefer'] = 'return=representation'
  }
  return base
}

export const MessageService = {
  async getMessages(): Promise<Message[]> {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/messages?select=*&order=timestamp.desc`, { headers: sbHeaders() })
      if (!res.ok) throw new Error('Failed to fetch messages')
      const rows = await res.json()
      return (rows as any[]).map((r) => ({ id: r.id, content: r.content, author: r.author, timestamp: r.timestamp, likes: r.likes ?? 0, likedBy: r.liked_by ?? [] }))
    }
    if (API_URL) {
      const res = await fetch(`${API_URL}/messages`, { headers: headers() })
      if (!res.ok) throw new Error('Failed to fetch messages')
      const data = await res.json()
      return Array.isArray(data) ? data.sort((a: Message, b: Message) => b.timestamp - a.timestamp) : []
    }
    return Promise.resolve(MessageStorageService.getMessages())
  },

  async addMessage(content: string, author: string): Promise<Message> {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const body = { content: content.trim(), author: author.trim(), timestamp: Date.now(), likes: 0, liked_by: [] }
      const res = await fetch(`${SUPABASE_URL}/rest/v1/messages`, { method: 'POST', headers: sbHeaders(), body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Failed to add message')
      const row = await res.json()
      const r = Array.isArray(row) ? row[0] : row
      return { id: r.id, content: r.content, author: r.author, timestamp: r.timestamp, likes: r.likes ?? 0, likedBy: r.liked_by ?? [] }
    }
    if (API_URL) {
      const body = { content: content.trim(), author: author.trim(), timestamp: Date.now() }
      const res = await fetch(`${API_URL}/messages`, { method: 'POST', headers: headers(), body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Failed to add message')
      return await res.json()
    }
    return Promise.resolve(MessageStorageService.addMessage(content, author))
  },

  async toggleLike(messageId: string, userNickname: string): Promise<void> {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const getRes = await fetch(`${SUPABASE_URL}/rest/v1/messages?id=eq.${encodeURIComponent(messageId)}&select=*`, { headers: sbHeaders() })
      if (!getRes.ok) throw new Error('Failed to load message')
      const rows = await getRes.json()
      const r = Array.isArray(rows) ? rows[0] : rows
      if (!r) return
      const likedBy: string[] = Array.isArray(r.liked_by) ? r.liked_by : []
      const idx = likedBy.indexOf(userNickname)
      if (idx === -1) likedBy.push(userNickname)
      else likedBy.splice(idx, 1)
      const likes = likedBy.length
      const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/messages?id=eq.${encodeURIComponent(messageId)}`, {
        method: 'PATCH',
        headers: sbHeaders(),
        body: JSON.stringify({ liked_by: likedBy, likes })
      })
      if (!patchRes.ok) throw new Error('Failed to toggle like')
      return
    }
    if (API_URL) {
      const res = await fetch(`${API_URL}/messages/${encodeURIComponent(messageId)}/like`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ nickname: userNickname })
      })
      if (!res.ok) throw new Error('Failed to toggle like')
      return
    }
    MessageStorageService.likeMessage(messageId, userNickname)
    return Promise.resolve()
  },

  getUserProfile(): UserProfile {
    return MessageStorageService.getUserProfile()
  },

  updateUserProfile(profile: UserProfile): void {
    MessageStorageService.updateUserProfile(profile)
  }
}