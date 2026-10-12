import { api } from '~/services/api'
import type { PaginationParams } from '#shared/types'

export function useTasks(id: number, params: MaybeRefOrGetter<PaginationParams> = {}) {
  return useAsyncData<Task[]>(
    () => createCacheKey('tasks', id, toValue(params)),
    (_nuxtApp, { signal }) =>
      api.projects.getTasks(id, {
        params: toValue(params),
        signal
      }),
    {
      immediate: false,
      dedupe: 'defer',
      default: () => []
    }
  )
}
