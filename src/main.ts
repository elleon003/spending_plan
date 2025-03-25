import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import * as icons from '@/components/icons'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

// Register icons globally
Object.entries(icons).forEach(([name, component]) => {
  app.component(name, component)
})

app.use(pinia)
app.use(router)
app.mount('#app')
