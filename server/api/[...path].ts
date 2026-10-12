export default defineEventHandler(async (event) => {
  const client = createClient()
  const path = getRouterParam(event, 'path')!

  return client(path, {
    method: event.method,
    query: getQuery(event),
    body: ['GET', 'HEAD'].includes(event.method) ? undefined : await readBody(event)
  })
})
