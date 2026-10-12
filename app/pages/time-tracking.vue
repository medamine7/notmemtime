<script setup lang="ts">
definePageMeta({
  title: 'Time tracking'
})

function buildTimeEntryTable(data: TimeEntry[]) {
  return data.map((entry) => ({
    id: entry.id,
    taskId: entry.taskId,
    comment: entry.comment,
    start: formatTime(entry.start),
    end: formatTime(entry.end),
    createdAt: formatDate(entry.createdAt)
  }))
}

const page = ref(1)
const perPage = ref(10)

const pagination = usePagination({
  page,
  perPage
})

const { data: timeEntries, pending, error } = useTimeEntries(pagination)

const tableData = computed(() => buildTimeEntryTable(timeEntries.value))

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'taskId', header: 'Task ID' },
  { accessorKey: 'comment', header: 'Comment' },
  { accessorKey: 'start', header: 'Start' },
  { accessorKey: 'end', header: 'End' },
  { accessorKey: 'createdAt', header: 'Created At' }
]

const handlePerPageChange = () => {
  page.value = 1
}
</script>

<template>
  <UiErrorContent v-if="error" />
  <TimeTrackingTableSkeleton v-else-if="pending" />
  <div v-else class="flex flex-col gap-2">
    <UiPerPageSelect v-model="perPage" :disabled="pending" @change="handlePerPageChange" />
    <UTable :data="tableData" :columns="columns" class="border border-default rounded-lg" />
    <UiPaginationBox>
      <UPagination
        v-model:page="page"
        :disabled="pending"
        variant="soft"
        size="md"
        :total="20"
        :items-per-page="perPage"
      />
    </UiPaginationBox>
  </div>
</template>
