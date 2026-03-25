"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, ArrowRight, MessageSquare, Clock, Users, Zap, Settings } from "lucide-react"

export default function AutomationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Automation Builder</h1>
          <p className="text-gray-500">Create workflows to automate your spa business.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> New Workflow
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Panel - Workflows List */}
        <div className="col-span-1 space-y-4">
          <Card className="border-blue-200 shadow-sm ring-1 ring-blue-500 ring-opacity-50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">Welcome Message</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-gray-500 mb-4">Sends a greeting when a new lead messages on WhatsApp.</p>
              <div className="flex items-center text-xs text-gray-400 gap-4">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 1.2k runs</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 2m ago</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:border-gray-300 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">Abandoned Booking</h3>
                <Badge variant="secondary">Draft</Badge>
              </div>
              <p className="text-sm text-gray-500 mb-4">Follows up if a lead stops replying during booking.</p>
              <div className="flex items-center text-xs text-gray-400 gap-4">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 0 runs</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Edited yesterday</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:border-gray-300 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">Post-Therapy Feedback</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-gray-500 mb-4">Asks for a Google review 2 hours after appointment.</p>
              <div className="flex items-center text-xs text-gray-400 gap-4">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 450 runs</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 1h ago</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Visual Builder Mockup */}
        <div className="col-span-2">
          <Card className="h-[600px] flex flex-col bg-gray-50/50 border-dashed">
            <CardHeader className="border-b bg-white flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">Welcome Message Flow</CardTitle>
                <Badge variant="outline" className="text-gray-500">Unsaved changes</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm"><Play className="h-4 w-4 mr-2" /> Test</Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Save & Publish</Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-8 relative overflow-hidden flex flex-col items-center">
              
              {/* Background Grid */}
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              {/* Nodes */}
              <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                
                {/* Trigger Node */}
                <div className="bg-white border-2 border-purple-500 rounded-xl p-4 shadow-sm w-full mb-8 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Trigger
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">New WhatsApp Message</h4>
                      <p className="text-xs text-gray-500">When a new lead sends a message</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-300">
                    <ArrowRight className="h-6 w-6 rotate-90" />
                  </div>
                </div>

                {/* Condition Node */}
                <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-sm w-full mb-8 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Condition
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Settings className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Check Business Hours</h4>
                      <p className="text-xs text-gray-500">If current time is between 10 AM - 8 PM</p>
                    </div>
                  </div>
                  
                  {/* Branches */}
                  <div className="absolute -bottom-12 left-1/4 -translate-x-1/2 text-gray-300">
                    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M60 0V20C60 31.0457 51.0457 40 40 40H0" stroke="#D1D5DB" strokeWidth="2"/>
                      <path d="M5 35L0 40L5 45" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="absolute top-2 left-0 bg-green-100 text-green-700 text-[10px] px-1 rounded">Yes</span>
                  </div>
                  <div className="absolute -bottom-12 right-1/4 translate-x-1/2 text-gray-300">
                    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0V20C0 31.0457 8.9543 40 20 40H60" stroke="#D1D5DB" strokeWidth="2"/>
                      <path d="M55 35L60 40L55 45" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="absolute top-2 right-0 bg-red-100 text-red-700 text-[10px] px-1 rounded">No</span>
                  </div>
                </div>

                {/* Action Nodes */}
                <div className="flex w-[120%] justify-between mt-4">
                  <div className="bg-white border-2 border-green-500 rounded-xl p-4 shadow-sm w-[45%] relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Action
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Send AI Reply</h4>
                        <p className="text-xs text-gray-500">Generate context-aware response</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-300 rounded-xl p-4 shadow-sm w-[45%] relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Action
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Send Away Msg</h4>
                        <p className="text-xs text-gray-500">&quot;We are currently closed...&quot;</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Add Node Button */}
              <button className="absolute bottom-8 right-8 h-12 w-12 bg-white rounded-full shadow-lg border flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors">
                <Plus className="h-6 w-6" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
