<script setup lang="ts">
type ErrorType = 'error' | 'warning' | 'info' | 'not-found'

interface Props {
  title?: string
  description?: string
  type?: ErrorType
  retry?: (() => void) | undefined
  homeButton?: boolean
  retryLabel?: string
  homeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  description: 'An unexpected error occurred. Please try again.',
  type: 'error',
  homeButton: true,
  retryLabel: 'Try again',
  homeLabel: 'Go home'
})

const config = computed(() => {
  const variants = {
    error: {
      icon: 'i-lucide-circle-x',
      color: 'error' as const
    },
    warning: {
      icon: 'i-lucide-triangle-alert',
      color: 'warning' as const
    },
    info: {
      icon: 'i-lucide-info',
      color: 'info' as const
    },
    'not-found': {
      icon: 'i-lucide-search-x',
      color: 'neutral' as const
    }
  }

  return variants[props.type]
})

const router = useRouter()
</script>

<template>
  <div class="flex min-h-75 items-center justify-center p-6">
    <div class="w-full max-w-md text-center">
      <div class="mb-4 flex justify-center">
        <div class="flex size-14 items-center justify-center rounded-full bg-elevated">
          <UIcon
            :name="config.icon"
            class="size-7"
            :class="{
              'text-error': type === 'error',
              'text-warning': type === 'warning',
              'text-info': type === 'info',
              'text-muted': type === 'not-found'
            }"
          />
        </div>
      </div>

      <h2 class="text-xl font-semibold text-highlighted">
        {{ title }}
      </h2>

      <p class="mt-2 text-sm leading-6 text-muted">
        {{ description }}
      </p>

      <slot name="details" />

      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <UButton
          v-if="retry"
          :label="retryLabel"
          icon="i-lucide-refresh-cw"
          :color="config.color"
          @click="retry"
        />

        <UButton
          v-if="homeButton"
          :label="homeLabel"
          icon="i-lucide-house"
          color="neutral"
          variant="outline"
          @click="router.push('/')"
        >
          {{ homeLabel }}
        </UButton>

        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
