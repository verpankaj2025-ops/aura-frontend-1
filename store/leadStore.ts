import { create } from 'zustand'

interface Lead {
  id: number | string
  name: string
  service: string
  status: string
  time: string
}

interface LeadState {
  leads: Lead[]
  isLoading: boolean
  setLeads: (leads: Lead[]) => void
  addLead: (lead: Lead) => void
  updateLeadStatus: (id: number | string, status: string) => void
}

export const useLeadStore = create<LeadState>((set) => ({
  leads: [],
  isLoading: false,
  
  setLeads: (leads) => set({ leads }),
  
  addLead: (lead) => set((state) => ({ leads: [lead, ...state.leads] })),
  
  updateLeadStatus: (id, status) => set((state) => ({
    leads: state.leads.map(lead => lead.id === id ? { ...lead, status } : lead)
  }))
}))
