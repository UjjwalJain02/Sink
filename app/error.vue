<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

await navigateTo('/', {
  redirectCode: 302,
  replace: true,
})
</script>

<template>
  <div></div>
</template>
