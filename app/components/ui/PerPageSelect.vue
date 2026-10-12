<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()

const perPage = defineModel<number>()

const emit = defineEmits<{
  change: [value: number]
}>()

function handleChange(value: number) {
  emit('change', value)
}

const perPageOptions = [
  { label: '10 per page', value: 10 },
  { label: '25 per page', value: 25 },
  { label: '50 per page', value: 50 },
  { label: '100 per page', value: 100 }
]
</script>

<template>
  <USelect
    v-model="perPage"
    :items="perPageOptions"
    value-key="value"
    variant="outline"
    class="w-36 ml-auto"
    :disabled="disabled"
    @update:model-value="handleChange"
  />
</template>
