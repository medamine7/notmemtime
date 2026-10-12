import { api } from '~/services/api'
import type { PaginationParams } from '#shared/types'

export function useTimeEntries(params: MaybeRefOrGetter<PaginationParams> = {}) {
  return useAsyncData<TimeEntry[]>(
    () => createCacheKey('timeEntries', undefined, toValue(params)),
    (_nuxtApp, { signal }) =>
      api.timeEntries.getAll({
        params: toValue(params),
        signal
      }),
    {
      dedupe: 'defer',
      default: () => []
    }
  )
}
