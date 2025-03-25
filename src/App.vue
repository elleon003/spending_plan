<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LoadingScreen from '@/components/LoadingScreen.vue'

const auth = useAuthStore()

onMounted(async () => {
  await auth.init()
})
</script>

<template>
  <LoadingScreen v-if="auth.loading" />
  <router-view v-else />
</template>
