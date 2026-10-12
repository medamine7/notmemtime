<script setup lang="ts">
const page = ref(1)
const perPage = ref(10)

const pagination = usePagination({
  page,
  perPage
})
const { data: clients, pending, error, refresh } = useClients(pagination)

const handlePerPageChange = () => {
  page.value = 1
}

async function retryFetch() {
  await refresh()
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <WorkManagementTreeSkeleton v-if="pending" />

    <UAlert
      v-else-if="error"
      color="error"
      variant="soft"
      title="Unable to load clients"
      description="Something went wrong while retrieving your clients."
      icon="i-lucide-alert-circle"
    >
      <template #actions>
        <UButton
          label="Retry"
          color="neutral"
          variant="outline"
          size="sm"
          @click="retryFetch"
        /> </template
    ></UAlert>

    <div v-else class="flex-1 flex flex-col gap-4">
      <UiPerPageSelect v-model="perPage" :disabled="pending" @change="handlePerPageChange" />

      <div class="flex flex-col rounded-lg border border-default overflow-hidden">
        <WorkManagementClientNode v-for="client in clients" :key="client.id" :client="client" />
      </div>

      <UiPaginationBox>
        <UPagination
          v-model:page="page"
          :disabled="pending"
          variant="soft"
          size="md"
          :total="100"
          :items-per-page="perPage"
        />
      </UiPaginationBox>
    </div>
  </div>
</template>
