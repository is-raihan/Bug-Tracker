import React, { useState } from 'react'
import { Task } from '../lib/types'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import { Plus } from 'lucide-react'

export function Dashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>()

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedTask(undefined)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bug Tracker</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Task
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <TaskForm task={selectedTask} onClose={handleCloseForm} />
          </div>
        </div>
      )}

      <TaskList onEditTask={handleEditTask} />
    </div>
  )
}