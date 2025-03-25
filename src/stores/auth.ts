import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, AuthError } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const init = async () => {
    loading.value = true
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      user.value = currentUser
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      user.value = data.user
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const isAuthenticated = computed(() => !!user.value)

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  // Initialize auth state listener
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user ?? null
  })

  return {
    user,
    loading,
    init,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    isAuthenticated,
    updatePassword,
  }
})
