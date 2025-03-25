import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Transaction } from '@/types/database'
import { usePlaidStore } from './plaid'

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const plaidStore = usePlaidStore()

  const getTransactions = async (startDate?: string, endDate?: string) => {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('transactions')
        .select('*, bank_accounts(name)')
        .order('date', { ascending: false })

      if (startDate) {
        query = query.gte('date', startDate)
      }
      if (endDate) {
        query = query.lte('date', endDate)
      }

      const { data, error: queryError } = await query

      if (queryError) throw queryError
      transactions.value = data
      return { data, error: null }
    } catch (err) {
      error.value = 'Failed to fetch transactions'
      return { data: null, error: err as Error }
    } finally {
      loading.value = false
    }
  }

  const refreshTransactions = async () => {
    loading.value = true
    error.value = null

    try {
      const { error: syncError } = await plaidStore.refreshTransactions()
      if (syncError) throw syncError

      await getTransactions()
      return { error: null }
    } catch (err) {
      error.value = 'Failed to refresh transactions'
      return { error: err as Error }
    } finally {
      loading.value = false
    }
  }

  const totalExpenses = computed(() => 
    transactions.value.reduce((sum, t) => t.amount > 0 ? sum + t.amount : sum, 0)
  )

  const totalIncome = computed(() => 
    transactions.value.reduce((sum, t) => t.amount < 0 ? sum - t.amount : sum, 0)
  )

  return {
    transactions,
    loading,
    error,
    getTransactions,
    refreshTransactions,
    totalExpenses,
    totalIncome,
  }
})
