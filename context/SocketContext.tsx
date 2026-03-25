"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useAuthStore } from "@/store/authStore"
import { useChatStore, Message } from "@/store/chatStore"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const { token } = useAuthStore()
  const { addMessage, setTyping, updateLastMessage } = useChatStore()

  useEffect(() => {
    // 🔥 FINAL PRODUCTION SOCKET URL (HTTPS → auto WSS)
    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      "https://api.aurawellness.cloud"

    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token || "dummy-token",
      },
      transports: ["websocket"],
    })

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id)
      setIsConnected(true)
    })

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected")
      setIsConnected(false)
    })

    newSocket.on(
      "new_message",
      (data: { chatId: string | number; message: Message }) => {
        addMessage(data.chatId, data.message)
        updateLastMessage(
          data.chatId,
          data.message.text,
          data.message.timestamp
        )
      }
    )

    newSocket.on(
      "typing",
      (data: { chatId: string | number; isTyping: boolean }) => {
        setTyping(data.chatId, data.isTyping)
      }
    )

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [token, addMessage, setTyping, updateLastMessage])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}