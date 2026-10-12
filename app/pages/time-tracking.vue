<script setup lang="ts">
import type { TableRow } from '@nuxt/ui'
import type { TimeEntry, TimeEntryInput } from '#shared/types'

import { getApiErrorMessage } from '~/utils/api-error'

definePageMeta({
  title: 'Time tracking'
})

useSeoMeta({
  title: 'Time tracking'
})

function buildTimeEntryTable(data: TimeEntry[]) {
  return data.map((entry) => ({
    id: entry.id,
    taskId: entry.taskId,
    comment: entry.comment,
    start: formatTime(entry.start),
    end: formatTime(entry.end),
    createdAt: formatDate(entry.createdAt),
    original: entry
  }))
}

type TimeEntryTableRow = ReturnType<typeof buildTimeEntryTable>[number]

const page = ref(1)
const perPage = ref(10)

const pagination = usePagination({
  page,
  perPage
})

const { data: timeEntries, pending, refresh, error } = useTimeEntries(pagination)

const tableData = computed(() => buildTimeEntryTable(timeEntries.value))

const { create, update, isPending: isSaving, error: saveError } = useTimeEntryMutations()

const toast = useToast()

const selectedEntry = ref<TimeEntry | null>(null)

const columns = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'taskId',
    header: 'Task ID'
  },
  {
    accessorKey: 'comment',
    header: 'Comment'
  },
  {
    accessorKey: 'start',
    header: 'Start'
  },
  {
    accessorKey: 'end',
    header: 'End'
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At'
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }: { row: TableRow<TimeEntryTableRow> }) =>
      h(
        resolveComponent('UTooltip'),
        {
          text: 'Edit time entry'
        },
        () =>
          h(resolveComponent('UButton'), {
            icon: 'i-lucide-pencil',
            size: 'sm',
            variant: 'ghost',
            color: 'neutral',
            onClick: () => editEntry(row.original.original)
          })
      )
  }
]

const handlePerPageChange = () => {
  page.value = 1
}

const entryForm = useTemplateRef('entryForm')

function createEntry() {
  selectedEntry.value = null
  entryForm.value?.open()
}

function editEntry(entry: TimeEntry) {
  selectedEntry.value = entry
  entryForm.value?.open(entry)
}

async function saveEntry(input: TimeEntryInput) {
  if (isSaving.value) return

  const existingEntry = selectedEntry.value
  const isCreate = existingEntry === null

  try {
    const savedEntry = isCreate ? await create(input) : await update(existingEntry.id, input)

    if (!savedEntry) return

    toast.add({
      title: isCreate ? 'Time entry created' : 'Time entry updated',
      description: `Time entry #${savedEntry.id} saved successfully.`,
      color: 'success'
    })

    entryForm.value?.close()
    selectedEntry.value = null

    if (isCreate) page.value = 1

    await refresh()
  } catch (err) {
    toast.add({
      title: 'Unable to save time entry',
      description: getApiErrorMessage(err),
      color: 'error'
    })
  }
}

async function retryFetch() {
  await refresh()
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <TimeTrackingTableSkeleton v-if="pending" />

    <UAlert
      v-else-if="error"
      color="error"
      variant="soft"
      title="Unable to load time entries"
      description="Something went wrong while retrieving your time entries."
      icon="i-lucide-alert-circle"
    >
      <template #actions>
        <UButton label="Retry" color="neutral" variant="outline" size="sm" @click="retryFetch" />
      </template>
    </UAlert>
    <template v-else>
      <div class="flex items-center gap-3">
        <UiPerPageSelect
          v-model="perPage"
          :disabled="pending || isSaving"
          @change="handlePerPageChange"
        />

        <UTooltip text="New time entry">
          <UButton icon="i-lucide-plus" label="New entry" @click="createEntry" />
        </UTooltip>
      </div>

      <div class="overflow-hidden rounded-lg border border-default">
        <UTable :data="tableData" :columns="columns" :loading="pending" />
      </div>

      <div class="flex justify-end">
        <UiPaginationBox>
          <UPagination
            v-model:page="page"
            :disabled="pending || isSaving"
            variant="soft"
            size="md"
            :total="20"
            :items-per-page="perPage"
          />
        </UiPaginationBox>
      </div>
    </template>

    <TimeTrackingTimeEntryForm
      ref="entryForm"
      :loading="isSaving"
      :error="saveError"
      @submit="saveEntry"
    />
  </div>
</template>
