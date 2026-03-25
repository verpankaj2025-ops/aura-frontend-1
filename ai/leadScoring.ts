export function scoreLead(messages: any[]): number {
  let score = 0
  
  // Basic scoring logic based on message history
  messages.forEach(msg => {
    const isCustomer = msg.isMe === false || msg.sender !== "me"
    if (isCustomer) {
      const text = msg.text.toLowerCase()
      if (text.includes("book") || text.includes("slot") || text.includes("baje") || text.includes("aana")) score += 30
      if (text.includes("price") || text.includes("cost") || text.includes("kitna") || text.includes("paise")) score += 10
      if (text.includes("tomorrow") || text.includes("today") || text.includes("kal") || text.includes("aaj")) score += 20
    }
  })
  
  return Math.min(score, 100)
}
