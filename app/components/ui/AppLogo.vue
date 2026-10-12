<script lang="ts" setup>
interface Props {
  small?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="relative w-full flex items-end gap-2">
    <img src="/logo.png" alt="app logo" class="w-12" />
    <h3 v-if="!small" class="text-2xl italic font-medium sans uppercase font-logo">
      <span class="text-red-400">Not</span>Mem<span class="text-primary">time</span>
    </h3>
  </div>
</template>
