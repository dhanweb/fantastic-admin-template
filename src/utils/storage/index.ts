import { StorageUtil } from '@/utils/storage/core.ts'
import Settings from '@/settings.ts'

export const Storage = StorageUtil.configure(Settings.app.prefix ?? '')

export const tokenStorage = Storage.createInstance('token')
export const avatarStorage = Storage.createInstance('avatar')
export const usernameStorage = Storage.createInstance('username')
