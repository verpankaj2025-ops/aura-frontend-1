"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, Download, MoreHorizontal, MessageSquare, Phone } from "lucide-react"

import { api } from "@/services/api"

interface Lead {
  id: string | number
  name: string
  phone: string
  service: string
  status: string
  source: string
  date: string
  value?: string
}

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/leads')
        if (response.status === 200) {
          setLeads(response.data)
        } else {
          console.warn('Backend not reachable, using empty state')
        }
      } catch (err) {
        console.error('Failed to fetch leads:', err)
        setError('Failed to connect to the server. Please ensure the backend is running.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeads()
  }, [])

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  )

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl border shadow-sm items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading leads...</p>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Leads Management</h1>
          <p className="text-gray-500">Track and manage your potential clients.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Add Lead</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search leads..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Contact</th>
                  <th className="px-6 py-3 font-medium">Service Interest</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Source</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">{lead.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{lead.phone}</td>
                    <td className="px-6 py-4">{lead.service}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        lead.status === 'Hot' ? 'destructive' : 
                        lead.status === 'Warm' ? 'warning' : 
                        lead.status === 'Booked' ? 'success' : 'secondary'
                      }>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{lead.source}</td>
                    <td className="px-6 py-4 text-gray-500">{lead.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredLeads.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No leads found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
