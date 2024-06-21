import { StorageUtil } from '@/utils/storage/core.ts'
import Settings from '@/settings.ts'

export const Storage = StorageUtil.setPrefix(Settings.app.prefix ?? '')

export const tokenStorage = Storage.createInstance('token')
