import { create } from 'zustand'

export interface Message {
  id: string | number
  sender: string | number
  text: string
  timestamp: string
  isAi?: boolean
  status?: 'sent' | 'delivered' | 'seen'
}

export interface Chat {
  id: string | number
  name: string
  lastMessage: string
  time: string
  unread: number
  status: string
  phone: string
  score?: number
}

interface ChatState {
  chats: Chat[]
  messages: Record<string | number, Message[]>
  activeChatId: string | number | null
  typingUsers: Record<string | number, boolean>
  aiSuggestions: Record<string | number, string>
  autoSend: boolean
  
  setChats: (chats: Chat[]) => void
  setActiveChat: (chatId: string | number | null) => void
  addMessage: (chatId: string | number, message: Message) => void
  setMessages: (chatId: string | number, messages: Message[]) => void
  setTyping: (chatId: string | number, isTyping: boolean) => void
  updateLastMessage: (chatId: string | number, text: string, time: string) => void
  setAiSuggestion: (chatId: string | number, suggestion: string | null) => void
  setAutoSend: (autoSend: boolean) => void
  updateChatScore: (chatId: string | number, score: number) => void
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  messages: {},
  activeChatId: null,
  typingUsers: {},
  aiSuggestions: {},
  autoSend: false,
  
  setChats: (chats) => set({ chats }),
  
  setActiveChat: (chatId) => set((state) => {
    // Clear unread count when opening chat
    const updatedChats = state.chats.map(chat => 
      chat.id === chatId ? { ...chat, unread: 0 } : chat
    )
    return { activeChatId: chatId, chats: updatedChats }
  }),
  
  addMessage: (chatId, message) => set((state) => {
    const chatMessages = state.messages[chatId] || []
    return {
      messages: {
        ...state.messages,
        [chatId]: [...chatMessages, message]
      }
    }
  }),
  
  setMessages: (chatId, messages) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: messages
    }
  })),
  
  setTyping: (chatId, isTyping) => set((state) => ({
    typingUsers: {
      ...state.typingUsers,
      [chatId]: isTyping
    }
  })),
  
  updateLastMessage: (chatId, text, time) => set((state) => ({
    chats: state.chats.map(chat => 
      chat.id === chatId ? { ...chat, lastMessage: text, time } : chat
    )
  })),

  setAiSuggestion: (chatId, suggestion) => set((state) => {
    const newSuggestions = { ...state.aiSuggestions }
    if (suggestion === null) {
      delete newSuggestions[chatId]
    } else {
      newSuggestions[chatId] = suggestion
    }
    return { aiSuggestions: newSuggestions }
  }),

  setAutoSend: (autoSend) => set({ autoSend }),

  updateChatScore: (chatId, score) => set((state) => {
    let newStatus = "Cold"
    if (score >= 50) newStatus = "Hot"
    else if (score >= 20) newStatus = "Warm"

    return {
      chats: state.chats.map(chat => 
        chat.id === chatId ? { ...chat, score, status: chat.status === "Booked" ? "Booked" : newStatus } : chat
      )
    }
  })
}))
