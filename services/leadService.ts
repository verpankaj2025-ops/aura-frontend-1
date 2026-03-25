import { api } from './api'

export const leadService = {
  getLeads: async () => {
    // In a real app: return await api.get('/leads')
    return [
      { id: 1, name: "Rahul Sharma", service: "Deep Tissue", status: "Hot", time: "10 mins ago" },
      { id: 2, name: "Priya Singh", service: "Couple Therapy", status: "Warm", time: "1 hour ago" },
    ]
  },
  
  getLeadById: async (id: string) => {
    // return await api.get(`/leads/${id}`)
    return { id, name: "Rahul Sharma", service: "Deep Tissue", status: "Hot" }
  },
  
  updateLeadStatus: async (id: string, status: string) => {
    // return await api.put(`/leads/${id}/status`, { status })
    return { success: true }
  }
}
