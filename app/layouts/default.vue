<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(true)

const items: NavigationMenuItem[] = [
  {
    label: 'Work management',
    icon: 'i-lucide-briefcase',
    to: 'work-management'
  },
  {
    label: 'Time tracking',
    icon: 'i-lucide-clock',
    to: 'time-tracking'
  }
]

const route = useRoute()
const title = computed(() => (route.meta.title as string) ?? '')

const active = ref()
</script>

<template>
  <div class="flex h-svh overflow-hidden">
    <USidebar
      v-model:open="open"
      collapsible="icon"
      :ui="{
        container: 'h-full'
      }"
    >
      <template #header="{ state }">
        <UiAppLogo :small="state === 'collapsed'" class="w-8" />
      </template>

      <UNavigationMenu
        v-model="active"
        :items="items"
        orientation="vertical"
        :ui="{ link: 'p-1.5 overflow-hidden' }"
      />
    </USidebar>

    <div
      class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=floating]:my-4 peer-data-[variant=inset]:m-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring peer-data-[variant=inset]:ring-default bg-default"
    >
      <div
        class="h-(--ui-header-height) border-b border-default shrink-0 flex items-center px-4 gap-4"
      >
        <UButton
          icon="i-lucide-panel-right"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          @click="open = !open"
        />

        <h1 class="text-xl font-bold">
          {{ title }}
        </h1>
      </div>

      <div
        class="flex flex-col flex-1 p-4 bg-white dark:bg-default overflow-x-hidden overflow-y-auto"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
