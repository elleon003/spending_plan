<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTransitionComputed } from '@vueuse/core'
import { IconMenu, IconClose } from '@/components/icons'

const auth = useAuthStore()
const isSidebarOpen = ref(false)

const sidebarWidth = useTransitionComputed(() => 
  isSidebarOpen.value ? 'w-64' : 'w-16'
)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside :class="[
      'fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out',
      sidebarWidth
    ]">
      <div class="p-4">
        <button
          @click="isSidebarOpen = !isSidebarOpen"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <icon-menu v-if="!isSidebarOpen" class="w-6 h-6" />
          <icon-close v-else class="w-6 h-6" />
        </button>
      </div>
      
      <nav class="mt-4">
        <slot name="navigation" />
      </nav>
    </aside>

    <!-- Main content -->
    <main :class="[
      'transition-all duration-300 ease-in-out',
      isSidebarOpen ? 'ml-64' : 'ml-16'
    ]">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-900">
            <slot name="header" />
          </h1>
          
          <div class="flex items-center space-x-4">
            <slot name="actions" />
            <!-- User menu -->
            <div class="relative" v-if="auth.user">
              <button
                type="button"
                class="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span class="sr-only">Open user menu</span>
                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {{ auth.user.email?.[0].toUpperCase() }}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </div>
    </main>
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
