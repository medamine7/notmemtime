<template>
  <div class="space-y-4">
    <div class="divide-y divide-default rounded-xl border border-default overflow-hidden">
      <div v-for="i in 8" :key="i" class="flex items-center gap-4 px-4 py-4">
        <div class="flex-1 space-y-2">
          <USkeleton class="h-6 w-32" />
          <USkeleton class="h-3 w-48 max-w-full opacity-60" />
        </div>

        <USkeleton class="h-6 w-20 rounded-full shrink-0" />

        <USkeleton class="hidden sm:block h-4 w-24 shrink-0" />

        <USkeleton class="size-8 rounded-lg shrink-0" />
      </div>
    </div>
  </div>
</template>
