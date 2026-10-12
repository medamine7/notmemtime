const colorMap = {
  completed: 'success',
  'in-progress': 'primary',
  pending: 'warning',
  active: 'error'
} as const

export const statusToColor = (status: Status) => colorMap[status]

export const statusHumanize = (status: Status) => {
  if (!status) return status

  return status.replace('-', ' ')
}
