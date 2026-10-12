import { api } from '~/services/api'
import type { TimeEntryInput } from '#shared/types'

export function useTimeEntryMutations(
  options: {
    refresh?: () => Promise<unknown>
  } = {}
) {
  const isPending = ref(false)
  const error = shallowRef<unknown>(null)

  async function execute<T>(request: () => Promise<T>): Promise<T | undefined> {
    if (isPending.value) {
      return
    }

    isPending.value = true
    error.value = null

    try {
      const result = await request()

      await options.refresh?.()

      return result
    } catch (err) {
      error.value = err
    } finally {
      isPending.value = false
    }
  }

  function create(input: TimeEntryInput) {
    return execute(() => api.timeEntries.create(input))
  }

  function update(id: number, input: TimeEntryInput) {
    return execute(() => api.timeEntries.update(id, input))
  }

  function remove(id: number) {
    return execute(() => api.timeEntries.delete(id))
  }

  return {
    create,
    update,
    remove,
    isPending,
    error
  }
}
