import { create } from 'zustand'
import { Task, User, Module, ActivityLog, Priority, Severity } from './types'

interface TaskState {
  tasks: Task[]
  modules: Module[]
  activityLogs: ActivityLog[]
  sortField: 'priority' | 'deadline' | 'module'
  sortOrder: 'asc' | 'desc'
  filterStatus: 'all' | 'open' | 'completed'
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskStatus: (id: string) => void
  setSortField: (field: 'priority' | 'deadline' | 'module') => void
  setSortOrder: (order: 'asc' | 'desc') => void
  setFilterStatus: (status: 'all' | 'open' | 'completed') => void
  addModule: (name: string) => void
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  users: User[]
  login: (user: User) => void
  logout: () => void
  addUser: (user: Omit<User, 'id'>) => void
  toggleUserStatus: (userId: string) => void
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  modules: [],
  activityLogs: [],
  sortField: 'deadline',
  sortOrder: 'asc',
  filterStatus: 'all',
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }],
  })),

  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ),
  })),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),

  toggleTaskStatus: (id) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            status: task.status === 'open' ? 'completed' : 'open',
            updatedAt: new Date().toISOString(),
          }
        : task
    ),
  })),

  setSortField: (field) => set({ sortField: field }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setFilterStatus: (status) => set({ filterStatus: status }),

  addModule: (name) => set((state) => ({
    modules: [...state.modules, { id: crypto.randomUUID(), name }],
  })),
}))

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  users: [],

  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),

  addUser: (user) => set((state) => ({
    users: [...state.users, { ...user, id: crypto.randomUUID() }],
  })),

  toggleUserStatus: (userId) => set((state) => ({
    users: state.users.map((user) =>
      user.id === userId
        ? { ...user, isEnabled: !user.isEnabled }
        : user
    ),
  })),
}))