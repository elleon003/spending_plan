import { defineStore } from 'pinia'
import { ref } from 'vue'
import { plaidClient } from '@/lib/plaid'
import { supabase } from '@/lib/supabase'
import type { BankAccount } from '@/types/database'

export const usePlaidStore = defineStore('plaid', () => {
  const linkToken = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createLinkToken = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await plaidClient.linkTokenCreate({
        user: { client_user_id: (await supabase.auth.getUser()).data.user?.id || '' },
        client_name: 'Spending Plan',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
      })
      
      linkToken.value = response.data.link_token
    } catch (err) {
      error.value = 'Failed to create link token'
      console.error('Plaid error:', err)
    } finally {
      loading.value = false
    }
  }

  const exchangePublicToken = async (publicToken: string) => {
    loading.value = true
    error.value = null
    
    try {
      const exchangeResponse = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken
      })

      const { access_token, item_id } = exchangeResponse.data

      // Store tokens securely in Supabase
      await supabase.from('plaid_tokens').insert({
        access_token,
        item_id
      })

      return { error: null }
    } catch (err) {
      error.value = 'Failed to exchange public token'
      console.error('Plaid error:', err)
      return { error: err as Error }
    } finally {
      loading.value = false
    }
  }

  const syncAccounts = async (accessToken: string) => {
    try {
      const response = await plaidClient.accountsGet({ access_token: accessToken })
      
      const accounts = response.data.accounts.map(account => ({
        plaid_account_id: account.account_id,
        name: account.name,
        mask: account.mask,
        type: account.type,
        subtype: account.subtype,
      }))

      await supabase.from('bank_accounts').insert(accounts)
      
      return { accounts, error: null }
    } catch (err) {
      console.error('Failed to sync accounts:', err)
      return { accounts: null, error: err as Error }
    }
  }

  const syncTransactions = async (accessToken: string, startDate: string, endDate: string) => {
    try {
      const response = await plaidClient.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        options: {
          include_personal_finance_category: true
        }
      })

      const transactions = response.data.transactions.map(transaction => ({
        plaid_transaction_id: transaction.transaction_id,
        account_id: transaction.account_id,
        amount: transaction.amount,
        category: transaction.personal_finance_category?.primary,
        date: transaction.date,
        description: transaction.name,
        pending: transaction.pending,
      }))

      // Batch insert transactions
      const { error } = await supabase.from('transactions').upsert(
        transactions,
        { onConflict: 'plaid_transaction_id' }
      )

      if (error) throw error
      return { transactions, error: null }
    } catch (err) {
      console.error('Failed to sync transactions:', err)
      return { transactions: null, error: err as Error }
    }
  }

  const refreshTransactions = async () => {
    loading.value = true
    error.value = null

    try {
      // Get all user's Plaid tokens
      const { data: tokens } = await supabase
        .from('plaid_tokens')
        .select('access_token')

      if (!tokens?.length) {
        return { error: new Error('No linked accounts found') }
      }

      // Calculate date range (last 30 days)
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]

      // Sync transactions for each linked account
      const results = await Promise.all(
        tokens.map(({ access_token }) =>
          syncTransactions(access_token, startDate, endDate)
        )
      )

      const errors = results.filter(result => result.error)
      if (errors.length) {
        throw new Error('Some transactions failed to sync')
      }

      return { error: null }
    } catch (err) {
      error.value = 'Failed to refresh transactions'
      return { error: err as Error }
    } finally {
      loading.value = false
    }
  }

  return {
    linkToken,
    loading,
    error,
    createLinkToken,
    exchangePublicToken,
    syncAccounts,
    syncTransactions,
    refreshTransactions,
  }
})
