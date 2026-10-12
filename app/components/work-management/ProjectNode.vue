<script lang="ts" setup>
export interface Props {
  project: Project
}

const props = defineProps<Props>()

const page = ref(1)
const perPage = ref(10)

const pagination = usePagination({
  page,
  perPage
})

const { data: tasks, status, execute, pending, error } = useTasks(props.project.id, pagination)

const allTasks = ref<Task[]>([])
const expanded = ref(false)

async function loadTasks() {
  await execute()
  if (!tasks.value.length) return
  allTasks.value.push(...tasks.value)
}

async function toggle() {
  expanded.value = !expanded.value

  if (expanded.value && status.value === 'idle') {
    await loadTasks()
  }
}

async function loadMore() {
  if (pending.value) return

  page.value++
  await loadTasks()
}
</script>

<template>
  <div class="relative border-t border-default bg-inherit">
    <li class="relative flex items-center gap-4 p-2 pl-12">
      <UButton
        icon="i-lucide-chevron-right"
        size="sm"
        color="primary"
        variant="ghost"
        :class="{ 'rotate-90': expanded }"
        @click="toggle"
      />

      <div class="flex items-center gap-8">
        <h4 class="text-sm">
          {{ project.name }}
        </h4>

        <time class="text-xs text-muted">
          {{ formatDate(project.updatedAt) }}
        </time>

        <UBadge
          class="font-mono font-light capitalize"
          :color="statusToColor(project.status)"
          variant="subtle"
          size="sm"
        >
          {{ statusHumanize(project.status) }}
        </UBadge>
      </div>
    </li>

    <div v-if="expanded">
      <WorkManagementNodeSkeleton v-if="pending && allTasks.length === 0" class="pl-24" />

      <WorkManagementNodeError
        v-else-if="error && allTasks.length === 0"
        title="Couldn't load tasks"
        message="Check your connection and try again."
        retryable
        class="pl-24"
        @retry="loadTasks"
      />

      <ul v-else class="flex flex-col overflow-hidden bg-inherit">
        <WorkManagementTaskNode v-for="task in allTasks" :key="task.id" :task="task" />

        <li v-if="tasks.length > 0" class="flex items-center border-t border-default pl-24">
          <UButton
            variant="link"
            trailing-icon="i-lucide-chevron-down"
            size="xs"
            :loading="pending"
            :disabled="pending"
            trailing
            @click="loadMore"
          >
            Show more tasks
          </UButton>
        </li>

        <WorkManagementNodeError
          v-if="error && allTasks.length > 0"
          title="Couldn't load more tasks"
          message="Check your connection and try again."
          retryable
          class="pl-24"
          @retry="loadTasks"
        />
      </ul>
    </div>
  </div>
</template>
