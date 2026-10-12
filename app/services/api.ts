import type {
  Client,
  Project,
  Task,
  TimeEntry,
  TimeEntryInput,
  PaginationParams
} from '#shared/types'

type RequestOptions = {
  params?: PaginationParams
  signal?: AbortSignal
}

export const api = {
  clients: {
    getAll: ({ params, signal }: RequestOptions) =>
      $fetch<Client[]>('/api/clients', {
        query: params,
        signal
      }),

    getById: (id: number, { signal }: RequestOptions) =>
      $fetch<Client>(`/api/clients/${id}`, {
        signal
      }),

    getProjects: (id: number, { signal, params }: RequestOptions) =>
      $fetch<Project[]>(`/api/clients/${id}/projects`, {
        query: params,
        signal
      })
  },

  projects: {
    getById: (id: number, { signal }: RequestOptions) =>
      $fetch<Project>(`/api/projects/${id}`, {
        signal
      }),

    getTasks: (id: number, { params, signal }: RequestOptions) =>
      $fetch<Task[]>(`/api/projects/${id}/tasks`, {
        query: params,
        signal
      })
  },

  tasks: {
    getById: (id: number, { signal }: RequestOptions) =>
      $fetch<Task>(`/api/tasks/${id}`, {
        signal
      })
  },

  timeEntries: {
    getAll: ({ params, signal }: RequestOptions) =>
      $fetch<TimeEntry[]>('/api/time-entries', {
        query: params,
        signal
      }),

    getById: (id: number, { signal }: RequestOptions) =>
      $fetch<TimeEntry>(`/api/time-entries/${id}`, {
        signal
      }),

    create: (body: TimeEntryInput, { signal }: RequestOptions) =>
      $fetch<TimeEntry>('/api/time-entries', {
        method: 'POST',
        body,
        signal
      }),

    update: (id: number, body: TimeEntryInput, { signal }: RequestOptions) =>
      $fetch<TimeEntry>(`/api/time-entries/${id}`, {
        method: 'PUT',
        body,
        signal
      }),

    delete: (id: number, { signal }: RequestOptions) =>
      $fetch<{ message: string }>(`/api/time-entries/${id}`, {
        method: 'DELETE',
        signal
      })
  }
}
