import { $fetch } from 'ofetch'

export function createClient() {
  const { apiKey, apiBaseUrl } = useRuntimeConfig()

  return $fetch.create({
    baseURL: apiBaseUrl,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`
    }
  })
}
