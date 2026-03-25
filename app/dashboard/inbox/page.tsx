"use client"

import { useEffect, useState } from "react"

export default function InboxPage() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    fetch("https://api.aurawellness.cloud/api/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data || [])
      })
      .catch(() => {
        setUsers([])
      })
  }, [])

  return (
    <div className="flex h-screen">
      
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 border-r overflow-y-auto">
        {(users || []).map((user, index) => {
          const displayName = user?.name || user?.phone || "Unknown"
          const firstLetter = displayName.charAt(0)

          return (
            <div
              key={index}
              className="p-4 border-b hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-bold text-lg">{firstLetter}</div>
              <div className="text-sm text-gray-600">{displayName}</div>
            </div>
          )
        })}
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Select a chat to start</p>
      </div>
    </div>
  )
}
