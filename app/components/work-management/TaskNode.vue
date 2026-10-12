<script lang="ts" setup>
export interface Props {
  task: Task
}

defineProps<Props>()
</script>

<template>
  <div class="relative pl-22 border-t border-default bg-default">
    <li class="relative flex items-center gap-4 p-2 pl-8 bg-inherit">
      <UIcon name="i-lucide-corner-down-right" size="xs" />
      <div class="flex items-center gap-8">
        <h5 class="text-xs font-bold">
          {{ task.name }}
        </h5>

        <time class="text-xs text-muted">{{ formatDate(task.updatedAt) }}</time>

        <UBadge
          class="font-mono font-light capitalize"
          :color="statusToColor(task.status)"
          variant="subtle"
          size="sm"
        >
          {{ statusHumanize(task.status) }}
        </UBadge>
      </div>
    </li>
  </div>
</template>
