type Params = {
  page: MaybeRefOrGetter<number>
  perPage?: MaybeRefOrGetter<number>
}

export const usePagination = ({ page, perPage = 10 }: Params) => {
  return computed(() => ({
    offset: (toValue(page) - 1) * toValue(perPage),
    limit: toValue(perPage)
  }))
}
