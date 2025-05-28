export type Priority = 'High' | 'Medium' | 'Low'
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low'

export interface Task {
  id: string
  defectId: string
  title: string
  description: string
  stepsToReproduce: string
  expectedResults: string
  actualResults: string
  priority: Priority
  severity: Severity
  module: string
  mediaUrl?: string
  deadline: string
  assignee: string
  status: 'open' | 'completed'
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface User {
  id: string
  name: string
  email: string
  orgName: string
  role: 'user' | 'admin' | 'superadmin'
  isEnabled: boolean
}

export interface Module {
  id: string
  name: string
}

export interface ActivityLog {
  id: string
  userId: string
  action: 'create' | 'update' | 'delete'
  resourceType: 'task' | 'user'
  resourceId: string
  details: string
  timestamp: string
}