/**
 * 存储选项接口。
 */
interface StorageOptions {
  /**
   * 过期时间，以毫秒为单位。
   */
  expires?: number
}

/**
 * 表示一个存储实例的类。
 */
class StorageInstance {
  private key: string
  private expires: number | null

  /**
   * 创建一个 StorageInstance 实例。
   * @param key 存储项的键。
   * @param options 可选的存储选项。
   */
  constructor(key: string, options?: StorageOptions) {
    this.key = key
    this.expires = options?.expires ?? null
  }

  /**
   * 设置存储项。
   * @param value 要存储的值。
   */
  setItem(value: any) {
    const item = {
      value,
      expires: this.expires ? Date.now() + this.expires : null,
    }
    try {
      localStorage.setItem(this.key, JSON.stringify(item))
    }
    catch (e) {
      console.error('保存出错:', e)
    }
  }

  /**
   * 获取存储项。
   * @returns 存储的值，如果存储项不存在或已过期，则返回 null。
   */
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
      console.error('读取出错:', e)
      this.removeItem()
      return null
    }
  }

  /**
   * 移除存储项。
   */
  removeItem() {
    localStorage.removeItem(this.key)
  }
}

/**
 * 存储工具类，用于创建和管理存储实例。
 */
export class StorageUtil {
  private prefix: string
  private options?: StorageOptions

  /**
   * 创建一个 StorageUtil 实例。
   * @param prefix 存储项的前缀。
   * @param options 可选的存储选项。
   */
  constructor(prefix: string = '', options?: StorageOptions) {
    this.prefix = prefix
    this.options = options
  }

  /**
   * 配置 StorageUtil 实例。
   * @param prefix 存储项的前缀。
   * @param options 可选的存储选项。
   * @returns 新的 StorageUtil 实例。
   */
  static configure(prefix: string = '', options?: StorageOptions) {
    return new StorageUtil(prefix, options)
  }

  /**
   * 创建一个带有指定键和选项的 StorageInstance 实例。
   * @param key 存储项的键。
   * @param options 可选的存储选项。
   * @returns 新的 StorageInstance 实例。
   */
  createInstance(key: string, options?: StorageOptions): StorageInstance {
    const prefixedKey = this.prefix ? `${this.prefix}${key}` : key
    return new StorageInstance(prefixedKey, options ?? this.options)
  }

  /**
   * 清除所有带有指定前缀的存储项。
   */
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
