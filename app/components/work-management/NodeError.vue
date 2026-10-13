<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  retryable: {
    type: Boolean,
    default: false
  }
})

defineEmits(['retry'])
</script>

<template>
  <div role="alert" class="flex items-center gap-4 bg-error-100 px-4 py-3">
    <UIcon name="i-lucide-circle-alert" class="text-error size-5" />
    <div class="min-w-0 flex-1">
      <h6 class="text-base font-medium text-error">
        {{ title }}
      </h6>
      <p class="text-sm text-default">
        {{ message }}
      </p>
    </div>

    <UButton
      v-if="retryable"
      icon="i-lucide-rotate-ccw"
      variant="outline"
      color="neutral"
      @click="$emit('retry')"
    >
      Retry
    </UButton>
  </div>
</template>
