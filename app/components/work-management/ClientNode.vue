<script lang="ts" setup>
import type { Client } from '#shared/types'

export interface Props {
  client: Client
}

const props = defineProps<Props>()

const page = ref(1)
const perPage = ref(10)

const pagination = usePagination({
  page,
  perPage
})

const { data: projects, status, pending, execute, error } = useProjects(props.client.id, pagination)

const allProjects = ref<Project[]>([])
const expanded = ref(false)

async function loadProjects() {
  await execute()

  if (!projects.value.length) return
  allProjects.value.push(...projects.value)
}

async function toggle() {
  expanded.value = !expanded.value

  if (expanded.value && status.value === 'idle') {
    await loadProjects()
  }
}

async function loadMore() {
  if (pending.value) return

  page.value++
  await loadProjects()
}
</script>

<template>
  <div class="border-t border-default overflow-hidden first:border-0">
    <div class="grid grid-cols-[2fr_1fr_1fr] items-center px-4 py-2 bg-white">
      <div class="grid grid-cols-[40px_1fr] items-center grid-rows-2 gap-x-2 justify-items-start">
        <UButton
          class="row-span-2 transition-transform duration-200"
          icon="i-lucide-chevron-right"
          :class="{ 'rotate-90': expanded }"
          size="md"
          color="primary"
          variant="ghost"
          @click="toggle"
        />

        <h3 class="text-base capitalize font-bold leading-tight">
          {{ client.name }}
        </h3>
        <p class="text-xs text-muted">
          {{ client.description }}
        </p>
      </div>
      <time class="text-xs text-muted">{{ formatDate(client.updatedAt) }}</time>
      <UBadge
        class="justify-self-end font-mono font-light capitalize"
        :color="statusToColor(client.status)"
        variant="subtle"
        size="md"
      >
        {{ statusHumanize(client.status) }}
      </UBadge>
    </div>
    <div v-if="expanded">
      <WorkManagementNodeSkeleton v-if="pending && allProjects.length === 0" class="pl-12" />

      <WorkManagementNodeError
        v-else-if="error"
        title="Couldn't load projects"
        message="Check your connection and try again."
        retryable
        class="pl-12"
        @retry="loadProjects"
      />

      <ul v-else class="flex flex-col bg-default justify-start">
        <WorkManagementProjectNode
          v-for="(project, index) in allProjects"
          :key="project.id"
          :project="project"
          :is-last="index === projects.length - 1"
        />
        <div v-if="projects.length > 0" class="pl-12 border-t border-default flex items-center">
          <UButton
            variant="link"
            trailing-icon="i-lucide-chevron-down"
            loatr
            size="md"
            :loading="pending"
            :disabled="pending"
            trailing
            @click="loadMore"
          >
            Show more projects
          </UButton>
        </div>
      </ul>
    </div>
  </div>
</template>
