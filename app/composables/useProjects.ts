import { api } from '~/services/api'
import type { PaginationParams } from '#shared/types'

export function useProjects(id: number, params: MaybeRefOrGetter<PaginationParams> = {}) {
  return useAsyncData<Project[]>(
    () => createCacheKey('projects', id, toValue(params)),
    (_nuxtApp, { signal }) =>
      api.clients.getProjects(id, {
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
