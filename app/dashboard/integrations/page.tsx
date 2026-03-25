"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MessageCircle, Facebook, Instagram, Globe, Link2, CheckCircle2, AlertCircle } from "lucide-react"

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Integrations</h1>
          <p className="text-gray-500">Connect your favorite tools and platforms.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-2 border-green-500 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Connected
          </div>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-[#25D366] flex items-center justify-center text-white">
                <MessageCircle className="h-6 w-6" />
              </div>
              <CardTitle>WhatsApp Business</CardTitle>
            </div>
            <CardDescription>Connect your WhatsApp Business API to send and receive messages directly from the CRM.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 border border-gray-100">
              <span className="font-semibold">Number:</span> +91 98765 43210<br/>
              <span className="font-semibold">Status:</span> Active<br/>
              <span className="font-semibold">Messages this month:</span> 4,521
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">Disconnect</Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-transparent shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-[#1877F2] flex items-center justify-center text-white">
                <Facebook className="h-6 w-6" />
              </div>
              <CardTitle>Facebook Pages</CardTitle>
            </div>
            <CardDescription>Sync leads from Facebook Lead Ads and reply to Messenger inquiries.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 border border-blue-100 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>Connect your Facebook Page to start receiving leads automatically.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white">Connect Facebook</Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-transparent shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white">
                <Instagram className="h-6 w-6" />
              </div>
              <CardTitle>Instagram Direct</CardTitle>
            </div>
            <CardDescription>Manage Instagram DMs and comments directly from your CRM inbox.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-500 border border-gray-100">
              Requires Facebook Page connection first.
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Connect Instagram</Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-transparent shadow-sm col-span-full md:col-span-2 lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center text-white">
                <Globe className="h-6 w-6" />
              </div>
              <CardTitle>Custom Webhooks</CardTitle>
            </div>
            <CardDescription>Send data to external services or receive leads from custom forms on your website.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-900">Inbound Webhook URL (POST leads here)</label>
                <div className="flex gap-2">
                  <Input readOnly value="https://api.auracrm.com/v1/webhooks/inbound/wh_123456789" className="bg-gray-50 font-mono text-xs" />
                  <Button variant="outline" className="shrink-0">Copy</Button>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Outbound Webhooks</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-sm">Lead Created</h5>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 font-mono truncate">https://zapier.com/hooks/catch/123/abc</p>
                    <Button variant="link" className="h-auto p-0 text-xs text-blue-600">Edit</Button>
                  </div>
                  <div className="border rounded-lg p-4 border-dashed flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors min-h-[100px]">
                    <Link2 className="h-5 w-5 mb-2" />
                    <span className="text-sm font-medium">Add Webhook</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
