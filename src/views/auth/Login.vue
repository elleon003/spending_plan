<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  const { error: signInError } = await auth.signInWithEmail(
    email.value,
    password.value
  )

  if (signInError) {
    error.value = signInError.message
  } else {
    router.push('/')
  }
  
  loading.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <h2 class="text-3xl font-bold text-center">Sign in</h2>
      
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              required
              v-model="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              required
              v-model="password"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>

        <div class="text-sm text-center">
          <router-link
            to="/auth/register"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Need an account? Sign up
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
