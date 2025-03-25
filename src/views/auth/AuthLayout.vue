<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { watch } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

// Redirect if already authenticated
watch(() => auth.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    router.push('/')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
