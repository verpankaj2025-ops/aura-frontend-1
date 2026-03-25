export function detectIntent(message: string): string {
  const lowerMsg = message.toLowerCase()
  
  if (lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("charges") || lowerMsg.includes("how much") || lowerMsg.includes("kitna") || lowerMsg.includes("paise")) {
    return "pricing"
  }
  
  if (lowerMsg.includes("book") || lowerMsg.includes("appointment") || lowerMsg.includes("slot") || lowerMsg.includes("time") || lowerMsg.includes("baje") || lowerMsg.includes("aana")) {
    return "booking"
  }
  
  if (lowerMsg.includes("hi") || lowerMsg.includes("hello") || lowerMsg.includes("hey") || lowerMsg.includes("namaste")) {
    return "greeting"
  }
  
  if (lowerMsg.includes("expensive") || lowerMsg.includes("discount") || lowerMsg.includes("offer") || lowerMsg.includes("mehenga") || lowerMsg.includes("kam")) {
    return "objection"
  }
  
  return "inquiry"
}
