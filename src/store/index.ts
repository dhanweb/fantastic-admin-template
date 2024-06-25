import { createPersistedState } from 'pinia-plugin-persistedstate'
import Settings from '@/settings.ts'

const pinia = createPinia()
pinia.use(createPersistedState ({
  storage: window.localStorage,
  key: id => `${Settings.app.prefix ?? ''}${id}`,
}))

export default pinia
