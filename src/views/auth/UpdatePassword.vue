<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  error.value = ''

  const { error: updateError } = await auth.updatePassword(password.value)

  if (updateError) {
    error.value = updateError.message
  } else {
    router.push('/')
  }

  loading.value = false
}
</script>

<template>
  <div>
    <h2 class="text-3xl font-bold text-center">Update Password</h2>
    <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
      <div class="space-y-4">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">New Password</label>
          <input
            id="password"
            type="password"
            required
            v-model="password"
            minlength="8"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
        </div>
        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            v-model="confirmPassword"
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
        {{ loading ? 'Updating...' : 'Update Password' }}
      </button>
    </form>
  </div>
</template>
