<script setup lang="ts">
const page = ref(1)
const perPage = ref(10)

const pagination = usePagination({
  page,
  perPage
})

const { data: clients, error, pending } = useClients(pagination)

const handlePerPageChange = () => {
  page.value = 1
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <WorkManagementTreeSkeleton v-if="pending" />

    <UiErrorContent v-else-if="error" />

    <div v-else class="flex-1 flex flex-col gap-4">
      <UiPerPageSelect v-model="perPage" :disabled="pending" @change="handlePerPageChange" />

      <div class="flex flex-col rounded-lg border border-default overflow-hidden">
        <WorkManagementClientNode v-for="client in clients" :key="client.id" :client="client" />
      </div>
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
</template>
