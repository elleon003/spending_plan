<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import type { User } from '@supabase/supabase-js'

const users = ref<User[]>([])
const totalTransactions = ref(0)
const activeAccounts = ref(0)
const loading = ref(true)

const fetchAnalytics = async () => {
  loading.value = true
  try {
    const [usersResponse, transactionsCount, accountsCount] = await Promise.all([
      supabase.auth.admin.listUsers(),
      supabase.from('transactions').count(),
      supabase.from('bank_accounts').count()
    ])

    users.value = usersResponse.data.users
    totalTransactions.value = transactionsCount.count ?? 0
    activeAccounts.value = accountsCount.count ?? 0
  } catch (error) {
    console.error('Error fetching analytics:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchAnalytics)
</script>

<template>
  <DashboardLayout>
    <template #header>Admin Dashboard</template>
    
    <template #navigation>
      <nav-link to="/admin/users" icon="users">Users</nav-link>
      <nav-link to="/admin/analytics" icon="chart">Analytics</nav-link>
      <nav-link to="/admin/settings" icon="settings">Settings</nav-link>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Analytics Cards -->
      <div v-for="(stat, index) in [
        { label: 'Total Users', value: users.length, icon: 'users' },
        { label: 'Total Transactions', value: totalTransactions, icon: 'receipt' },
        { label: 'Active Accounts', value: activeAccounts, icon: 'bank' }
      ]" :key="index"
      class="bg-white rounded-lg shadow p-6 transition-transform hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
            <p class="mt-1 text-3xl font-semibold text-gray-900">
              {{ stat.value }}
            </p>
          </div>
          <div class="p-3 bg-blue-500 rounded-full text-white">
            <component :is="`icon-${stat.icon}`" class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">Recent Users</h3>
        <router-link
          to="/admin/users"
          class="text-sm text-blue-600 hover:text-blue-500"
        >
          View all
        </router-link>
      </div>
      
      <div class="border-t border-gray-200">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="user in users.slice(0, 5)" :key="user.id"
            class="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {{ user.email?.[0].toUpperCase() }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.email }}
                  </div>
                  <div class="text-sm text-gray-500">
                    Joined {{ new Date(user.created_at).toLocaleDateString() }}
                  </div>
                </div>
              </div>
              <div>
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  user.confirmed_at
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ user.confirmed_at ? 'Active' : 'Pending' }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </DashboardLayout>
</template>
