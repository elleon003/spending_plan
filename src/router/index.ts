import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/auth',
      component: () => import('@/views/auth/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          component: () => import('@/views/auth/Login.vue'),
          meta: { requiresAuth: false }
        },
        {
          path: 'register',
          component: () => import('@/views/auth/Register.vue'),
          meta: { requiresAuth: false }
        },
        {
          path: 'reset-password',
          component: () => import('@/views/auth/ResetPassword.vue'),
          meta: { requiresAuth: false }
        },
        {
          path: 'callback',
          component: () => import('@/views/auth/AuthCallback.vue'),
          meta: { requiresAuth: false }
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  
  if (auth.loading) {
    // Wait for auth to initialize
    await new Promise(resolve => {
      const unwatch = watch(
        () => auth.loading,
        (loading) => {
          if (!loading) {
            unwatch()
            resolve(true)
          }
        }
      )
    })
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/auth/login')
  } else if (to.path.startsWith('/auth/') && auth.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
