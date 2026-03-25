"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/store/authStore'
import { useChatStore, Message } from '@/store/chatStore'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false })

export const useSocket = () => useContext(SocketContext)

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { token, isAuthenticated } = useAuthStore()
  const { addMessage, setTyping, updateLastMessage } = useChatStore()

  useEffect(() => {
    // In a real app, you would only connect if authenticated
    // if (!isAuthenticated) return

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'
    
    // Connect to socket server
    const newSocket = io(SOCKET_URL, {
      auth: { token: token || 'dummy-token' },
      transports: ['websocket'],
      // For demo purposes, we might not have a real backend, so it might fail to connect.
      // But we set it up as requested.
    })

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id)
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    // Listen for new messages
    newSocket.on('new_message', (data: { chatId: string | number, message: Message }) => {
      console.log('Received new_message:', data)
      addMessage(data.chatId, data.message)
      updateLastMessage(data.chatId, data.message.text, data.message.timestamp)
    })

    // Listen for typing events
    newSocket.on('typing', (data: { chatId: string | number, isTyping: boolean }) => {
      console.log('Received typing event:', data)
      setTyping(data.chatId, data.isTyping)
    })

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket)

    return () => {
      newSocket.off('connect')
      newSocket.off('disconnect')
      newSocket.off('new_message')
      newSocket.off('typing')
      newSocket.close()
    }
  }, [token, isAuthenticated, addMessage, setTyping, updateLastMessage])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

