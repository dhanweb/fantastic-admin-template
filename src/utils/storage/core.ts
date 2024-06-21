interface StorageOptions {
  expires?: number // 过期时间，以毫秒为单位
}

class StorageInstance {
  private key: string
  private expires: number | null

  constructor(key: string, options?: StorageOptions) {
    this.key = key
    this.expires = options?.expires ?? null
  }

  setItem(value: any) {
    const item = {
      value,
      expires: this.expires ? Date.now() + this.expires : null,
    }
    try {
      localStorage.setItem(this.key, JSON.stringify(item))
    }
    catch (e) {
      console.error('Failed to set item in localStorage:', e)
    }
  }

  getItem() {
    const itemStr = localStorage.getItem(this.key)
    if (!itemStr) {
      return null
    }

    try {
      const item = JSON.parse(itemStr)
      if (item.expires && Date.now() > item.expires) {
        this.removeItem()
        return null
      }

      return item.value
    }
    catch (e) {
      console.error('Failed to parse item from localStorage:', e)
      this.removeItem()
      return null
    }
  }

  removeItem() {
    localStorage.removeItem(this.key)
  }
}

export class StorageUtil {
  private prefix: string

  constructor(prefix: string = '') {
    this.prefix = prefix
  }

  static setPrefix(prefix: string = ''): StorageUtil {
    return new StorageUtil(prefix)
  }

  createInstance(key: string, options?: StorageOptions): StorageInstance {
    const prefixedKey = this.prefix ? `${this.prefix}_${key}` : key
    return new StorageInstance(prefixedKey, options)
  }

  clear() {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (this.prefix === '' || key.startsWith(this.prefix))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
  }
}
