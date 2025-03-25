<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const email = ref('')
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''

  const { error: resetError } = await auth.resetPassword(email.value)

  if (resetError) {
    error.value = resetError.message
  } else {
    successMessage.value = 'Password reset instructions have been sent to your email'
    email.value = ''
  }

  loading.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <div>
        <h2 class="text-3xl font-bold text-center">Reset Password</h2>
        <p class="mt-2 text-center text-gray-600">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
          <input
            id="email"
            type="email"
            required
            v-model="email"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
        </div>

        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
        <div v-if="successMessage" class="text-green-600 text-sm">{{ successMessage }}</div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {{ loading ? 'Sending...' : 'Send Reset Instructions' }}
        </button>

        <div class="text-sm text-center">
          <router-link
            to="/auth/login"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Back to login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
