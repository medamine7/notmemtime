import type { AsyncDataOptions } from '#app'

export function useApiData<T>(
  key: MaybeRefOrGetter<string>,
  fetcher: (signal: AbortSignal) => Promise<T>,
  options: AsyncDataOptions<T> = {}
) {
  return useAsyncData<T>(
    () => toValue(key),
    (_nuxtApp, { signal }) => fetcher(signal),
    options
  )
}
