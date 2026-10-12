<script setup lang="ts">
const rows = 10
const columns = 6
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <USkeleton class="h-7 w-32 rounded-full" />
    </div>
    <div class="border border-default rounded-lg overflow-hidden">
      <div
        v-for="row in rows"
        :key="row"
        class="flex items-center gap-4 px-4 py-4 border-b border-default last:border-0"
      >
        <USkeleton v-for="col in columns" :key="col" class="h-4 flex-1" />
      </div>
    </div>
  </div>
</template>
