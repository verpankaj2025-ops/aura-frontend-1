import { api } from './api'

export const chatService = {
  getChats: async () => {
    // return await api.get('/chats')
    return []
  },
  
  getMessages: async (chatId: string) => {
    // return await api.get(`/chats/${chatId}/messages`)
    return []
  },
  
  sendMessage: async (chatId: string, text: string) => {
    // return await api.post(`/chats/${chatId}/messages`, { text })
    return { id: Date.now(), text, isMe: true }
  }
}
