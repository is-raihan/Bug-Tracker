import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Task, Priority, Severity } from '../lib/types'
import { useTaskStore, useAuthStore } from '../lib/store'
import { Upload } from 'lucide-react'

const taskSchema = z.object({
  defectId: z.string().min(1, 'Defect ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  stepsToReproduce: z.string().min(1, 'Steps to reproduce are required'),
  expectedResults: z.string().min(1, 'Expected results are required'),
  actualResults: z.string().min(1, 'Actual results are required'),
  priority: z.enum(['High', 'Medium', 'Low']),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low']),
  module: z.string().min(1, 'Module is required'),
  mediaUrl: z.string().optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  assignee: z.string().min(1, 'Assignee is required'),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  task?: Task
  onClose: () => void
}

export function TaskForm({ task, onClose }: TaskFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task,
  })

  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const modules = useTaskStore((state) => state.modules)
  const addModule = useTaskStore((state) => state.addModule)
  const user = useAuthStore((state) => state.user)

  const onSubmit = (data: TaskFormData) => {
    if (task) {
      updateTask(task.id, data)
    } else {
      addTask({
        ...data,
        status: 'open',
        createdBy: user?.id || '',
      })
    }
    onClose()
  }

  const handleModuleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const moduleName = e.target.value
    if (!modules.find((m) => m.name === moduleName)) {
      addModule(moduleName)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Defect ID</label>
          <input
            type="text"
            {...register('defectId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.defectId && (
            <p className="mt-1 text-sm text-red-600">{errors.defectId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Steps to Reproduce</label>
          <textarea
            {...register('stepsToReproduce')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.stepsToReproduce && (
            <p className="mt-1 text-sm text-red-600">{errors.stepsToReproduce.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Expected Results</label>
          <textarea
            {...register('expectedResults')}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.expectedResults && (
            <p className="mt-1 text-sm text-red-600">{errors.expectedResults.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Actual Results</label>
          <textarea
            {...register('actualResults')}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.actualResults && (
            <p className="mt-1 text-sm text-red-600">{errors.actualResults.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            {...register('priority')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Severity</label>
          <select
            {...register('severity')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          {errors.severity && (
            <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Module</label>
          <input
            type="text"
            list="modules"
            {...register('module')}
            onChange={handleModuleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <datalist id="modules">
            {modules.map((module) => (
              <option key={module.id} value={module.name} />
            ))}
          </datalist>
          {errors.module && (
            <p className="mt-1 text-sm text-red-600">{errors.module.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Media URL</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              {...register('mediaUrl')}
              className="block w-full rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="button"
              className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
            >
              <Upload className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Deadline</label>
          <input
            type="datetime-local"
            {...register('deadline')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.deadline && (
            <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Assignee</label>
          <input
            type="text"
            {...register('assignee')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.assignee && (
            <p className="mt-1 text-sm text-red-600">{errors.assignee.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}