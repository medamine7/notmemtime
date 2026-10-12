export const createCacheKey = <T extends object>(
  resource: string,
  id?: string | number,
  params?: T
) => {
  const normalizedParams = Object.fromEntries(
    Object.entries(params ?? {})
      .filter(([, value]) => value !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
  )

  return [
    resource,
    id,
    Object.keys(normalizedParams).length ? JSON.stringify(normalizedParams) : undefined
  ]
    .filter((value) => value !== undefined)
    .join(':')
}
