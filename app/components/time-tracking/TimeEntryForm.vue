<script setup lang="ts">
import {
  CalendarDate,
  CalendarDateTime,
  Time,
  getLocalTimeZone,
  now,
  parseAbsoluteToLocal,
  toCalendarDateTime
} from '@internationalized/date'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Client } from '#shared/types'
import { api } from '~/services/api'

interface Props {
  loading?: boolean
  error?: unknown
}

const props = defineProps<Props>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  submit: [value: TimeEntryInput]
}>()

const dateTime = (message: string) =>
  z.custom<CalendarDateTime>((value) => value instanceof CalendarDateTime, message)

const schema = z
  .object({
    taskId: z.number().int().positive('Select a task'),
    comment: z.string().trim().min(1, 'Comment is required'),
    start: dateTime('Start time is required'),
    end: dateTime('End time is required')
  })
  .refine((value) => value.end.compare(value.start) > 0, {
    path: ['end'],
    message: 'End time must be after start time'
  })

type FormState = {
  taskId: number | undefined
  comment: string
  start: CalendarDateTime | undefined
  end: CalendarDateTime | undefined
}

type FormOutput = z.output<typeof schema>

const state = shallowReactive<FormState>({
  taskId: undefined,
  comment: '',
  start: undefined,
  end: undefined
})

const clients = ref<Client[]>([])
const projects = ref<Project[]>([])
const tasks = ref<Task[]>([])

const selectedClientId = ref<number | undefined>()
const selectedProjectId = ref<number | undefined>()

const clientsPending = ref(false)
const projectsPending = ref(false)
const tasksPending = ref(false)

const loadingError = ref<string | null>(null)

const editingEntry = ref<TimeEntry | null>(null)

const isEditMode = computed(() => Boolean(editingEntry.value))
const isSubmitting = computed(() => Boolean(props.loading))
const isLoading = ref(!clients.value.length)
const isBusy = computed(
  () => isSubmitting.value || clientsPending.value || projectsPending.value || tasksPending.value
)

const clientItems = computed(() => clients.value.map((c) => ({ label: c.name, value: c.id })))
const projectItems = computed(() => projects.value.map((p) => ({ label: p.name, value: p.id })))
const taskItems = computed(() => tasks.value.map((t) => ({ label: t.name, value: t.id })))

const fromIso = (iso: string) => toCalendarDateTime(parseAbsoluteToLocal(iso))
const toIso = (value: CalendarDateTime) => value.toDate(getLocalTimeZone()).toISOString()

function dateBinding(key: 'start' | 'end') {
  return computed<CalendarDate | undefined>({
    get: () => {
      const value = state[key]
      return value ? new CalendarDate(value.year, value.month, value.day) : undefined
    },
    set: (date) => {
      const current = state[key]
      if (!date || !current) return

      state[key] = new CalendarDateTime(
        date.year,
        date.month,
        date.day,
        current.hour,
        current.minute
      )
    }
  })
}

function timeBinding(key: 'start' | 'end') {
  return computed<Time>({
    get: () => {
      const value = state[key]
      return new Time(value?.hour ?? 0, value?.minute ?? 0)
    },
    set: (time) => {
      const current = state[key]
      if (!time || !current) return

      state[key] = current.set({ hour: time.hour, minute: time.minute })
    }
  })
}

const startDate = dateBinding('start')
const endDate = dateBinding('end')
const startTime = timeBinding('start')
const endTime = timeBinding('end')

function resetForm() {
  Object.assign(state, {
    taskId: undefined,
    comment: '',
    start: undefined,
    end: undefined
  })

  selectedClientId.value = undefined
  selectedProjectId.value = undefined

  projects.value = []
  tasks.value = []
  loadingError.value = null
}

async function loadClients() {
  if (clientsPending.value) return

  clientsPending.value = true
  loadingError.value = null

  try {
    clients.value = await api.clients.getAll()
  } catch (error) {
    console.error('Failed to load clients:', error)
    loadingError.value = 'Unable to load clients. Please try again.'
  } finally {
    clientsPending.value = false
  }
}

async function loadProjects(clientId: number) {
  projectsPending.value = true
  projects.value = []
  tasks.value = []
  selectedProjectId.value = undefined
  state.taskId = undefined
  loadingError.value = null

  try {
    projects.value = await api.clients.getProjects(clientId, {})
  } catch (error) {
    console.error('Failed to load projects:', error)
    loadingError.value = 'Unable to load projects. Please try again.'
  } finally {
    projectsPending.value = false
  }
}

async function loadTasks(projectId: number) {
  tasksPending.value = true
  tasks.value = []
  state.taskId = undefined
  loadingError.value = null

  try {
    tasks.value = await api.projects.getTasks(projectId, {})
  } catch (error) {
    console.error('Failed to load tasks:', error)
    loadingError.value = 'Unable to load tasks. Please try again.'
  } finally {
    tasksPending.value = false
  }
}

async function onClientChange(clientId: number | undefined) {
  selectedClientId.value = clientId

  if (clientId === undefined) {
    projects.value = []
    tasks.value = []
    selectedProjectId.value = undefined
    state.taskId = undefined
    return
  }

  await loadProjects(clientId)
}

async function onProjectChange(projectId: number | undefined) {
  selectedProjectId.value = projectId

  if (projectId === undefined) {
    tasks.value = []
    state.taskId = undefined
    return
  }

  await loadTasks(projectId)
}

async function populateForm(entry?: TimeEntry | null) {
  resetForm()

  if (entry) {
    state.taskId = entry.taskId
    state.comment = entry.comment ?? ''
    state.start = fromIso(entry.start)
    state.end = fromIso(entry.end)
  } else {
    const end = toCalendarDateTime(now(getLocalTimeZone())).set({ second: 0, millisecond: 0 })

    state.end = end
    state.start = end.subtract({ hours: 1 })
  }

  if (!clients.value.length) {
    await loadClients()
  }
}

function onSubmit(event: FormSubmitEvent<FormOutput>) {
  if (isBusy.value) return

  const { taskId, comment, start, end } = event.data

  emit('submit', {
    taskId,
    comment,
    start: toIso(start),
    end: toIso(end)
  })
}

async function openForm(entry?: TimeEntry | null) {
  editingEntry.value = entry ?? null
  open.value = true
  await populateForm(entry)
  isLoading.value = false
}

function closeForm() {
  open.value = false
}

defineExpose({ open: openForm, close: closeForm })
</script>

<template>
  <UModal
    v-model:open="open"
    :title="isEditMode ? 'Edit time entry' : 'New time entry'"
    :description="
      isEditMode ? 'Update the details of this time entry.' : 'Record time spent working on a task.'
    "
  >
    <template #body>
      <TimeTrackingFormSkeleton v-if="isLoading" class="space-y-4" />

      <UForm v-else :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Client" name="client">
          <USelect
            :model-value="selectedClientId"
            :items="clientItems"
            value-key="value"
            placeholder="Select a client"
            :loading="clientsPending"
            :disabled="isSubmitting || clientsPending"
            class="w-full"
            @update:model-value="onClientChange"
          />
        </UFormField>

        <UFormField label="Project" name="project">
          <USelect
            :model-value="selectedProjectId"
            :items="projectItems"
            value-key="value"
            placeholder="Select a project"
            :loading="projectsPending"
            :disabled="!selectedClientId || isSubmitting || projectsPending"
            class="w-full"
            @update:model-value="onProjectChange"
          />
        </UFormField>

        <UFormField label="Task" name="taskId" required>
          <USelect
            v-model.number="state.taskId"
            :items="taskItems"
            value-key="value"
            placeholder="Select a task"
            :loading="tasksPending"
            :disabled="!selectedProjectId || isSubmitting || tasksPending"
            class="w-full"
          />
        </UFormField>

        <UAlert v-if="loadingError" color="error" variant="soft" :description="loadingError">
          <template #actions>
            <UButton
              label="Retry"
              size="xs"
              color="neutral"
              variant="outline"
              @click="loadClients"
            />
          </template>
        </UAlert>

        <UFormField label="Comment" name="comment" required>
          <UTextarea
            v-model="state.comment"
            placeholder="What did you work on?"
            :rows="3"
            class="w-full"
            :disabled="isSubmitting"
          />
        </UFormField>

        <UFormField label="Start time" name="start" required>
          <div class="flex gap-2">
            <UPopover>
              <UButton
                color="neutral"
                variant="outline"
                icon="i-lucide-calendar"
                :label="startDate?.toString() ?? 'Select date'"
                :disabled="isSubmitting"
                class="min-w-0 flex-1 justify-start"
              />

              <template #content>
                <UCalendar v-model="startDate" :disabled="isSubmitting" class="p-2" />
              </template>
            </UPopover>

            <UInputTime
              v-model="startTime"
              aria-label="Start time"
              :hour-cycle="24"
              :disabled="isSubmitting"
            />
          </div>
        </UFormField>

        <UFormField label="End time" name="end" required>
          <div class="flex gap-2">
            <UPopover>
              <UButton
                color="neutral"
                variant="outline"
                icon="i-lucide-calendar"
                :label="endDate?.toString() ?? 'Select date'"
                :disabled="isSubmitting"
                class="min-w-0 flex-1 justify-start"
              />

              <template #content>
                <UCalendar v-model="endDate" :disabled="isSubmitting" class="p-2" />
              </template>
            </UPopover>

            <UInputTime
              v-model="endTime"
              aria-label="End time"
              :hour-cycle="24"
              :disabled="isSubmitting"
            />
          </div>
        </UFormField>

        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          title="Unable to save time entry"
          description="Your changes have been preserved. Please try again."
        />

        <div class="flex justify-end gap-2 pt-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="outline"
            :disabled="isSubmitting"
            @click="open = false"
          />

          <UButton
            type="submit"
            :label="isEditMode ? 'Save changes' : 'Create entry'"
            :loading="isSubmitting"
            :disabled="isBusy"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
