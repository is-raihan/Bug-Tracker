import React, { useState } from 'react'
import { useTaskStore } from '../lib/store'
import { Task } from '../lib/types'
import { CheckCircle, XCircle, Edit, Trash2, AlertTriangle } from 'lucide-react'

interface TaskListProps {
  onEditTask: (task: Task) => void
}

export function TaskList({ onEditTask }: TaskListProps) {
  const tasks = useTaskStore((state) => state.tasks)
  const sortField = useTaskStore((state) => state.sortField)
  const sortOrder = useTaskStore((state) => state.sortOrder)
  const filterStatus = useTaskStore((state) => state.filterStatus)
  const setSortField = useTaskStore((state) => state.setSortField)
  const setSortOrder = useTaskStore((state) => state.setSortOrder)
  const setFilterStatus = useTaskStore((state) => state.setFilterStatus)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'High':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'Medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'Low':
        return <AlertTriangle className="h-5 w-5 text-green-600" />
      default:
        return null
    }
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortField === 'priority') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 }
      return sortOrder === 'asc'
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    if (sortField === 'deadline') {
      return sortOrder === 'asc'
        ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        : new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    }
    if (sortField === 'module') {
      return sortOrder === 'asc'
        ? a.module.localeCompare(b.module)
        : b.module.localeCompare(a.module)
    }
    return 0
  }).filter((task) => {
    if (filterStatus === 'all') return true
    return task.status === filterStatus
  })

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="priority">Sort by Priority</option>
              <option value="deadline">Sort by Deadline</option>
              <option value="module">Sort by Module</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="open">Open Tasks</option>
            <option value="completed">Completed Tasks</option>
          </select>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 ${
              task.status === 'completed' ? 'bg-gray-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                  {getSeverityIcon(task.severity)}
                  <h3
                    className={`text-lg font-medium ${
                      task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </h3>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  <p>Defect ID: {task.defectId}</p>
                  <p>Module: {task.module}</p>
                  <p>
                    Deadline:{' '}
                    {new Date(task.deadline).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`p-1 rounded-full ${
                    task.status === 'completed'
                      ? 'text-green-600 hover:text-green-800'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {task.status === 'completed' ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <XCircle className="h-6 w-6" />
                  )}
                </button>
                <button
                  onClick={() => onEditTask(task)}
                  className="p-1 text-blue-600 hover:text-blue-800 rounded-full"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 text-red-600 hover:text-red-800 rounded-full"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}