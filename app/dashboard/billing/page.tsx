"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Download, FileText } from "lucide-react"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Billing & Plans</h1>
          <p className="text-gray-500">Manage your subscription and billing history.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2 border-transparent">
          <CardHeader>
            <CardTitle>Starter</CardTitle>
            <CardDescription>Perfect for small spas</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">₹999</span>
              <span className="text-gray-500">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-green-500" /> Up to 500 leads/month</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-green-500" /> Basic CRM features</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-green-500" /> WhatsApp Integration</li>
              <li className="flex items-center gap-2 text-sm text-gray-400"><Check className="h-4 w-4 text-gray-300" /> No AI Reply Engine</li>
              <li className="flex items-center gap-2 text-sm text-gray-400"><Check className="h-4 w-4 text-gray-300" /> No Advanced Automations</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Downgrade</Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-blue-500 shadow-lg relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Current Plan
          </div>
          <CardHeader>
            <CardTitle>Professional</CardTitle>
            <CardDescription>For growing wellness centers</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">₹2,499</span>
              <span className="text-gray-500">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-green-500" /> Unlimited leads</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-green-500" /> Advanced CRM features</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-green-500" /> All Integrations</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-green-500" /> AI Reply Engine (10k msgs)</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-green-500" /> Basic Automations</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>Current Plan</Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-transparent">
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>For multi-location spas</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">₹7,999</span>
              <span className="text-gray-500">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-green-500" /> Everything in Pro</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-green-500" /> Unlimited AI Replies</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-green-500" /> Advanced Automations</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-green-500" /> Dedicated Account Manager</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-green-500" /> Custom API Access</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">Upgrade to Enterprise</Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-16 bg-white border rounded flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Visa ending in 4242</p>
                <p className="text-sm text-gray-500">Expires 12/2028</p>
              </div>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: "Mar 01, 2026", desc: "Professional Plan - Monthly", amount: "₹2,499", status: "Paid" },
                { date: "Feb 01, 2026", desc: "Professional Plan - Monthly", amount: "₹2,499", status: "Paid" },
                { date: "Jan 01, 2026", desc: "Professional Plan - Monthly", amount: "₹2,499", status: "Paid" },
              ].map((invoice, i) => (
                <tr key={i} className="bg-white border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">{invoice.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{invoice.desc}</td>
                  <td className="px-6 py-4 text-gray-900">{invoice.amount}</td>
                  <td className="px-6 py-4">
                    <Badge variant="success">{invoice.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Download className="h-4 w-4 mr-2" /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
