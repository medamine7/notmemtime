import type { Client as ClientModel, PaginationParams } from '#shared/types'
import { api } from '~/services/api'

export function useClients(params: MaybeRefOrGetter<PaginationParams> = {}) {
  return useAsyncData<ClientModel[]>(
    () => createCacheKey('clients', undefined, toValue(params)),
    (_nuxtApp, { signal }) =>
      api.clients.getAll({
        params: toValue(params),
        signal
      })
  )
}
