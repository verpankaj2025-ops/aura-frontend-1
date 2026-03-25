"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Calendar, IndianRupee } from "lucide-react"

// Types
type Deal = {
  id: string
  title: string
  client: string
  value: number
  date: string
  service: string
}

type Column = {
  id: string
  title: string
  dealIds: string[]
}

type BoardData = {
  deals: Record<string, Deal>
  columns: Record<string, Column>
  columnOrder: string[]
}

// Initial Data
const initialData: BoardData = {
  deals: {
    "deal-1": { id: "deal-1", title: "Couple Balinese", client: "Rahul Sharma", value: 6500, date: "Today, 6 PM", service: "Massage" },
    "deal-2": { id: "deal-2", title: "Deep Tissue Package", client: "Priya Singh", value: 12000, date: "Tomorrow, 11 AM", service: "Package" },
    "deal-3": { id: "deal-3", title: "Bridal Spa", client: "Neha Gupta", value: 25000, date: "24 Mar, 10 AM", service: "Bridal" },
    "deal-4": { id: "deal-4", title: "Relaxation Therapy", client: "Amit Kumar", value: 3500, date: "Today, 4 PM", service: "Massage" },
    "deal-5": { id: "deal-5", title: "Aromatherapy", client: "Sneha Reddy", value: 4500, date: "25 Mar, 2 PM", service: "Massage" },
  },
  columns: {
    "col-1": {
      id: "col-1",
      title: "New Inquiry",
      dealIds: ["deal-1", "deal-2"],
    },
    "col-2": {
      id: "col-2",
      title: "Contacted",
      dealIds: ["deal-3"],
    },
    "col-3": {
      id: "col-3",
      title: "Follow Up",
      dealIds: ["deal-4"],
    },
    "col-4": {
      id: "col-4",
      title: "Booked",
      dealIds: ["deal-5"],
    },
  },
  columnOrder: ["col-1", "col-2", "col-3", "col-4"],
}

export default function PipelinePage() {
  const [data, setData] = useState(initialData)

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const startColumn = data.columns[source.droppableId]
    const finishColumn = data.columns[destination.droppableId]

    // Moving within the same column
    if (startColumn === finishColumn) {
      const newDealIds = Array.from(startColumn.dealIds)
      newDealIds.splice(source.index, 1)
      newDealIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...startColumn,
        dealIds: newDealIds,
      }

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      })
      return
    }

    // Moving from one column to another
    const startDealIds = Array.from(startColumn.dealIds)
    startDealIds.splice(source.index, 1)
    const newStartColumn = {
      ...startColumn,
      dealIds: startDealIds,
    }

    const finishDealIds = Array.from(finishColumn.dealIds)
    finishDealIds.splice(destination.index, 0, draggableId)
    const newFinishColumn = {
      ...finishColumn,
      dealIds: finishDealIds,
    }

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      },
    })
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-500">Manage your leads and bookings.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full gap-6 items-start">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId]
              const deals = column.dealIds.map((dealId) => data.deals[dealId])

              return (
                <div key={column.id} className="flex flex-col w-80 shrink-0 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{column.title}</h3>
                      <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        {deals.length}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 rounded-xl p-2 min-h-[150px] transition-colors ${
                          snapshot.isDraggingOver ? "bg-blue-50/50 border border-blue-200 border-dashed" : "bg-gray-100/50"
                        }`}
                      >
                        {deals.map((deal, index) => (
                          <Draggable key={deal.id} draggableId={deal.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-3"
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging ? 0.9 : 1,
                                }}
                              >
                                <Card className={`shadow-sm border-gray-200 ${snapshot.isDragging ? "shadow-md ring-2 ring-blue-500 ring-opacity-50" : ""}`}>
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                      <Badge variant="secondary" className="font-normal text-[10px] uppercase tracking-wider">
                                        {deal.service}
                                      </Badge>
                                      <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </button>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 mb-1">{deal.title}</h4>
                                    <div className="flex items-center gap-2 mb-4">
                                      <Avatar className="h-5 w-5">
                                        <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">
                                          {deal.client.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-gray-600">{deal.client}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                      <div className="flex items-center text-xs text-gray-500 gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {deal.date}
                                      </div>
                                      <div className="flex items-center text-sm font-medium text-gray-900">
                                        <IndianRupee className="h-3 w-3" />
                                        {deal.value.toLocaleString()}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}
