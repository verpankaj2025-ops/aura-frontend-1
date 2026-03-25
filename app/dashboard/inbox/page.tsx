"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Phone, Video, MoreVertical, Check, CheckCheck, Bot, Sparkles, Smile, MessageSquare } from "lucide-react"
import { generateReply } from "@/ai/replyEngine"
import { scoreLead } from "@/ai/leadScoring"
import { useChatStore, Message } from "@/store/chatStore"
import { api } from "@/services/api"
import { useSocket } from "@/context/SocketContext"
import { Switch } from "@/components/ui/switch"
import dynamic from 'next/dynamic'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

export default function InboxPage() {
  const { 
    chats, messages, activeChatId, typingUsers, aiSuggestions, autoSend,
    setActiveChat, addMessage, updateLastMessage, setAiSuggestion, setAutoSend, updateChatScore 
  } = useChatStore()
  const { socket } = useSocket()
  
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0]
  const currentMessages = activeChat ? (messages[activeChat.id] || []) : []
  const isTyping = activeChat ? typingUsers[activeChat.id] : false
  const currentSuggestion = activeChat ? aiSuggestions[activeChat.id] : null

  const [inputValue, setInputValue] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be: const response = await api.get('/chats')
        // For now, if the backend isn't running, we'll gracefully handle it
        const response = await api.get('/chats')
        if (response.status === 200) {
          useChatStore.getState().setChats(response.data)
        } else {
          // Fallback if backend is not running
          console.warn('Backend not reachable, using empty state')
        }
      } catch (err) {
        console.error('Failed to fetch chats:', err)
        setError('Failed to connect to the server. Please ensure the backend is running.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchChats()
  }, [])

  useEffect(() => {
    if (!activeChatId) return

    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chats/${activeChatId}/messages`)
        if (response.status === 200) {
          useChatStore.getState().setMessages(activeChatId, response.data)
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err)
      }
    }

    fetchMessages()
  }, [activeChatId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, activeChat?.id, isTyping, currentSuggestion])

  const handleSendMessage = async (e?: React.FormEvent, textOverride?: string) => {
    e?.preventDefault()
    const textToSend = textOverride || inputValue
    if (!textToSend.trim() || !activeChat) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "me",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAi: !!textOverride,
      status: 'sent'
    }

    // Update local state
    addMessage(activeChat.id, newMessage)
    updateLastMessage(activeChat.id, newMessage.text, newMessage.timestamp)
    if (!textOverride) setInputValue("")
    setAiSuggestion(activeChat.id, null)
    
    // Emit via socket
    if (socket) {
      socket.emit('send_message', {
        chatId: activeChat.id,
        message: newMessage
      })
    }

    // Save to backend
    try {
      await api.post('/messages', { chatId: activeChat.id, message: newMessage })
    } catch (err) {
      console.error('Failed to save message to backend:', err)
    }
    
    // Simulate customer reply after 2 seconds for demo purposes
    if (!socket || !socket.connected) {
      const chatId = activeChat.id
      useChatStore.getState().setTyping(chatId, true)
      
      setTimeout(async () => {
        const customerReply: Message = {
          id: (Date.now() + 1).toString(),
          sender: chatId,
          text: "Okay, let me check and get back to you.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAi: false
        }
        addMessage(chatId, customerReply)
        updateLastMessage(chatId, customerReply.text, customerReply.timestamp)
        useChatStore.getState().setTyping(chatId, false)
        
        // Score lead
        const updatedMessages = useChatStore.getState().messages[chatId] || []
        const newScore = scoreLead(updatedMessages)
        updateChatScore(chatId, newScore)

        // Trigger AI suggestion
        const aiSuggestion = await generateReply(customerReply.text, activeChat)
        if (aiSuggestion) {
          if (useChatStore.getState().autoSend) {
            // Auto send the AI reply
            const autoReply: Message = {
              id: Date.now().toString(),
              sender: "me",
              text: aiSuggestion,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isAi: true,
              status: 'sent'
            }
            addMessage(chatId, autoReply)
            updateLastMessage(chatId, autoReply.text, autoReply.timestamp)
          } else {
            // Show suggestion
            setAiSuggestion(chatId, aiSuggestion)
          }
        }
      }, 2000)
    }
  }

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    
    if (socket && activeChat) {
      socket.emit('typing_event', {
        chatId: activeChat.id,
        isTyping: e.target.value.length > 0
      })
    }
  }

  const handleAiSuggest = async () => {
    if (!activeChat) return
    const lastCustomerMsg = [...currentMessages].reverse().find(m => m.sender !== "me")
    if (lastCustomerMsg) {
      const suggestion = await generateReply(lastCustomerMsg.text, activeChat)
      setAiSuggestion(activeChat.id, suggestion)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl border shadow-sm items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading chats...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl border shadow-sm items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center p-6 bg-red-50 rounded-2xl">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-red-800">Connection Error</h3>
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-2 border-red-200 text-red-700 hover:bg-red-100">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl border shadow-sm items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center p-6 bg-gray-50 rounded-2xl">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No Chats Found</h3>
          <p className="text-gray-500">There are currently no active chats. New messages will appear here.</p>
        </div>
      </div>
    )
  }

  if (!activeChat) return null

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col bg-gray-50/50">
        <div className="p-4 border-b bg-white">
          <h2 className="text-lg font-semibold mb-4">Inbox</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="w-full pl-9 bg-gray-100 border-transparent"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b last:border-0 ${
                activeChat.id === chat.id ? "bg-blue-50/50 border-l-4 border-l-blue-600" : "border-l-4 border-l-transparent"
              }`}
            >
              <Avatar>
                <AvatarFallback className={activeChat.id === chat.id ? "bg-blue-200 text-blue-800" : ""}>
                  {chat.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-semibold truncate text-gray-900">{chat.name}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={
                    chat.status === 'Hot' ? 'destructive' : 
                    chat.status === 'Warm' ? 'warning' : 
                    chat.status === 'Booked' ? 'success' : 'secondary'
                  } className="text-[10px] px-1.5 py-0">
                    {chat.status}
                  </Badge>
                  {chat.score !== undefined && (
                    <span className="text-[10px] text-gray-500 font-medium">Score: {chat.score}</span>
                  )}
                </div>
              </div>
              {chat.unread > 0 && (
                <div className="h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#efeae2]">
        {/* Chat Header */}
        <div className="h-16 border-b bg-white px-6 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-blue-100 text-blue-700">{activeChat.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{activeChat.name}</h2>
              <p className="text-xs text-gray-500">
                {isTyping ? <span className="text-blue-600 font-medium">User is typing...</span> : activeChat.phone}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border">
              <Bot className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Auto-send AI</span>
              <Switch 
                checked={autoSend} 
                onCheckedChange={setAutoSend} 
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-gray-500">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-0.5">
          <div className="flex justify-center mb-6">
            <span className="bg-white/80 text-gray-500 text-xs px-3 py-1 rounded-full shadow-sm">Today</span>
          </div>
          
          {currentMessages.map((msg, index) => {
            const isMe = msg.sender === "me"
            const prevMsg = index > 0 ? currentMessages[index - 1] : null
            const nextMsg = index < currentMessages.length - 1 ? currentMessages[index + 1] : null
            
            const isFirstInGroup = !prevMsg || prevMsg.sender !== msg.sender
            const isLastInGroup = !nextMsg || nextMsg.sender !== msg.sender

            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-4" : "mt-0.5"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm relative group ${
                  isMe 
                    ? `bg-[#d9fdd3] text-gray-900 ${isFirstInGroup ? 'rounded-tr-sm' : ''}` 
                    : `bg-white text-gray-900 ${isFirstInGroup ? 'rounded-tl-sm' : ''}`
                }`}>
                  {msg.isAi && (
                    <div className="flex items-center gap-1 mb-1 text-blue-600 text-[10px] font-medium uppercase tracking-wider">
                      <Bot className="h-3 w-3" /> AI Reply
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? "text-gray-500" : "text-gray-400"}`}>
                    <span className="text-[10px]">{msg.timestamp}</span>
                    {isMe && (
                      msg.status === 'seen' ? <CheckCheck className="h-3 w-3 text-blue-500" /> :
                      msg.status === 'delivered' ? <CheckCheck className="h-3 w-3 text-gray-500" /> :
                      <Check className="h-3 w-3 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          
          {isTyping && (
            <div className="flex justify-start mt-4">
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}

          {currentSuggestion && (
            <div className="flex justify-end mt-4">
              <div className="max-w-[70%] bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm relative group">
                <div className="flex items-center gap-1 mb-2 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" /> AI Suggestion
                </div>
                <p className="text-sm whitespace-pre-wrap leading-relaxed text-gray-800 mb-3">{currentSuggestion}</p>
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs text-gray-500 hover:text-gray-700"
                    onClick={() => setAiSuggestion(activeChat.id, null)}
                  >
                    Dismiss
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white shadow-sm"
                    onClick={() => handleSendMessage(undefined, currentSuggestion)}
                  >
                    Send AI Reply
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-[#f0f2f5] flex flex-col">
          {/* Quick Replies */}
          <div className="px-4 pt-3 pb-1 flex gap-2 overflow-x-auto no-scrollbar">
            <Button variant="outline" size="sm" className="bg-white rounded-full text-xs h-8 whitespace-nowrap text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => setInputValue("Our premium Deep Tissue Therapy starts at ₹3,500 for 60 minutes.")}>
              Send Price
            </Button>
            <Button variant="outline" size="sm" className="bg-white rounded-full text-xs h-8 whitespace-nowrap text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => setInputValue("We have limited premium evening slots available. Shall I reserve the 6 PM slot for you?")}>
              Book Now
            </Button>
            <Button variant="outline" size="sm" className="bg-white rounded-full text-xs h-8 whitespace-nowrap text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => setInputValue("We currently have slots available at 4 PM, 6 PM, and 7:30 PM today. Which one works for you?")}>
              Available Slots
            </Button>
          </div>

          <div className="p-3 flex items-end gap-2 relative">
            {showEmojiPicker && (
              <div className="absolute bottom-full left-4 mb-2 z-50 shadow-xl rounded-xl overflow-hidden">
                <EmojiPicker 
                  onEmojiClick={(emojiData) => {
                    setInputValue(prev => prev + emojiData.emoji)
                    setShowEmojiPicker(false)
                  }} 
                />
              </div>
            )}
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 shrink-0 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-6 w-6" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 shrink-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
              onClick={handleAiSuggest}
              title="Generate AI Reply"
            >
              <Bot className="h-6 w-6" />
            </Button>
            <div className="flex-1 relative bg-white rounded-xl border-transparent shadow-sm flex items-center">
              <textarea
                value={inputValue}
                onChange={handleTyping}
                placeholder="Type a message"
                className="w-full min-h-[40px] max-h-[120px] bg-transparent px-4 py-2.5 text-sm focus:outline-none resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
            </div>
            <Button 
              type="button" 
              className="h-10 w-10 shrink-0 rounded-full bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center justify-center p-0"
              disabled={!inputValue.trim()}
              onClick={(e) => handleSendMessage(e)}
            >
              <Send className="h-5 w-5 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Lead Info */}
      <div className="w-72 border-l bg-white flex flex-col hidden lg:flex">
        <div className="p-6 flex flex-col items-center border-b">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">{activeChat.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold text-gray-900">{activeChat.name}</h2>
          <p className="text-sm text-gray-500 mb-4">{activeChat.phone}</p>
          <div className="flex gap-2 w-full">
            <Button className="flex-1" variant="outline">Profile</Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Book</Button>
          </div>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Lead Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <Badge variant="warning">{activeChat.status}</Badge>
            </div>
            {activeChat.score !== undefined && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Lead Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${activeChat.score >= 50 ? 'bg-green-500' : activeChat.score >= 20 ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                      style={{ width: `${activeChat.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{activeChat.score}/100</span>
                </div>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 mb-1">Interest</p>
              <p className="text-sm font-medium">Couple Therapy</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Source</p>
              <p className="text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> WhatsApp
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Notes</p>
              <p className="text-sm bg-gray-50 p-3 rounded-md border text-gray-700">
                Looking for evening slots. Mentioned anniversary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
