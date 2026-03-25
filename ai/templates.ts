export function getTemplate(type: string, param: string, isEnglish: boolean = false): string {
  const hindiTemplates: Record<string, string> = {
    greeting: `Welcome to Aura Wellness & Spa, Gomti Nagar ✨\nAaj aap relaxation ke liye dekh rahe hain ya kisi specific pain ke liye?`,
    pricing: `Aapke requirement ke hisaab se ${param || 'Deep Tissue Therapy'} best rahegi. Yeh muscle stiffness aur stress dono reduce karti hai. Iski premium pricing ₹3,500 se start hoti hai for 60 mins.`,
    booking: `Aaj ke premium evening slots almost full hain. Kya main 6 PM ka slot block kar doon?`,
    objection: `Hum hygiene, certified therapists aur complete privacy ensure karte hain. Yeh sirf massage nahi, ek premium wellness experience hai.`,
    followUp: `Bilkul sir. Main aapko yaad dila doon? Kaunsa time convenient rahega?`
  }

  const englishTemplates: Record<string, string> = {
    greeting: `Welcome to Aura Wellness & Spa, Gomti Nagar ✨\nAre you looking for relaxation or relief from specific pain?`,
    pricing: `Based on your concern, ${param || 'Deep Tissue Therapy'} would be ideal. It relieves muscle tension and deep stress. Our premium sessions start at ₹3,500 for 60 minutes.`,
    booking: `We have limited premium evening slots available. Shall I reserve the 6 PM slot for you?`,
    objection: `We ensure certified therapists, complete privacy, and premium hygiene. This is not just a massage, it's a luxury wellness experience.`,
    followUp: `Sure. When would you like me to remind you so you don't miss your preferred slot?`
  }
  
  const templates = isEnglish ? englishTemplates : hindiTemplates
  const defaultReply = isEnglish ? "How can I help you today?" : "Main aapki kaise madad kar sakta hoon?"

  return templates[type] || defaultReply
}
