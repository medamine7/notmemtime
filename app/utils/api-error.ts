export function getApiErrorMessage(error: unknown): string {
  const err = error as {
    statusCode?: number
    status?: number
    statusMessage?: string
    message?: string
    data?: {
      statusMessage?: string
      message?: string
    }
  }

  const status = err.statusCode ?? err.status ?? 0

  switch (status) {
    case 400:
      return 'Please check the submitted information.'
    case 401:
      return 'Your session is no longer valid. Please sign in again.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'The requested resource could not be found.'
    case 429:
      return 'Too many requests. Please wait before trying again.'
    default:
      if (status >= 500) {
        return 'The server encountered an error. Please try again.'
      }

      if (!status) {
        return 'Unable to connect. Check your connection and try again.'
      }

      return 'Something went wrong. Please try again.'
  }
}
