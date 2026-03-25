import { detectIntent } from "./intentDetector"
import { getTemplate } from "./templates"

export async function generateReply(message: string, leadData: any): Promise<string> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const intent = detectIntent(message)
  
  // Basic language detection: if message contains mostly English words
  const isEnglish = /^[a-zA-Z0-9\s.,!?']+$/.test(message) && !message.toLowerCase().includes("hai") && !message.toLowerCase().includes("kya") && !message.toLowerCase().includes("liye")
  
  // In a real app, this would call an LLM (like Gemini) with the lead context
  // For now, we use rule-based templates based on intent
  
  let reply = ""
  
  switch (intent) {
    case "pricing":
      reply = getTemplate("pricing", leadData.interest || "Couple Therapy", isEnglish)
      break
    case "booking":
      reply = getTemplate("booking", leadData.name, isEnglish)
      break
    case "greeting":
      reply = getTemplate("greeting", leadData.name, isEnglish)
      break
    case "objection":
      reply = getTemplate("objection", "", isEnglish)
      break
    default:
      reply = isEnglish ? "I understand. How can I assist you further?" : "Main samajh gaya. Main aapki aur kya madad kar sakta hoon?"
  }
  
  return reply
}
