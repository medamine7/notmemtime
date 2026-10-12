<script setup lang="ts">
const page = ref(1)
const perPage = ref(10)

const pagination = usePagination({
  page,
  perPage
})

const { data: clients, error, pending } = useClients(pagination)

const perPageOptions = [
  { label: '10 per page', value: 10 },
  { label: '25 per page', value: 25 },
  { label: '50 per page', value: 50 },
  { label: '100 per page', value: 100 }
]

const handlePerPageChange = () => {
  page.value = 1
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <WorkManagementTreeSkeleton v-if="pending" />

    <div v-else-if="error">Failed to load clients.</div>

    <div v-else class="flex-1 flex flex-col gap-4">
      <USelect
        v-model="perPage"
        :items="perPageOptions"
        value-key="value"
        class="w-36 ml-auto"
        :disabled="pending"
        @update:model-value="handlePerPageChange"
      />

      <div class="flex flex-col rounded-lg border border-default overflow-hidden">
        <WorkManagementClientNode v-for="client in clients" :key="client.id" :client="client" />
      </div>
    </div>

    <UPagination
      v-model:page="page"
      :disabled="pending"
      variant="soft"
      class="ml-auto"
      size="md"
      :total="100"
      :items-per-page="perPage"
    />
  </div>
</template>
