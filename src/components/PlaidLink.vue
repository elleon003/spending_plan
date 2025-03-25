<script setup lang="ts">
import { onMounted } from 'vue'
import { usePlaidLink } from 'vue-plaid-link'
import { usePlaidStore } from '@/stores/plaid'

const plaidStore = usePlaidStore()
const emit = defineEmits<{
  (e: 'success'): void
  (e: 'error', error: Error): void
}>()

const { open, ready, error } = usePlaidLink({
  token: plaidStore.linkToken,
  onSuccess: async (public_token) => {
    const { error } = await plaidStore.exchangePublicToken(public_token)
    if (error) {
      emit('error', error)
    } else {
      emit('success')
    }
  },
  onExit: (err) => {
    if (err) emit('error', err)
  },
})

onMounted(async () => {
  if (!plaidStore.linkToken) {
    await plaidStore.createLinkToken()
  }
})
</script>

<template>
  <button
    @click="open"
    :disabled="!ready || plaidStore.loading"
    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
  >
    {{ plaidStore.loading ? 'Loading...' : 'Connect a bank account' }}
  </button>
  
  <div v-if="error || plaidStore.error" class="mt-2 text-red-600 text-sm">
    {{ error || plaidStore.error }}
  </div>
</template>
