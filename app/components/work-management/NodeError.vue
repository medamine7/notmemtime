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
  <div role="alert" class="flex items-center gap-3 bg-error-100 px-4 py-3">
    <svg
      class="h-5 w-5 shrink-0 text-error"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>

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
