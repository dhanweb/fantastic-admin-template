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
  private readonly key: string
  private readonly expires: number | null

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
      throw new Error(`Failed to save item: ${e}`)
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
      throw new Error(`Failed to read item: ${e}`)
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
  /** 存储前缀 */
  private readonly prefix: string
  /** 配置项 */
  private readonly options?: StorageOptions
  /** 当前创建的实例数组 */
  private readonly instances: StorageInstance[] = []
  /** 所有的实例数组 */
  static readonly utils: StorageUtil[] = []

  /**
   * 创建一个 StorageUtil 实例。
   * @param prefix 存储项的前缀。
   * @param options 可选的存储选项。
   */
  constructor(prefix: string = '', options?: StorageOptions) {
    this.prefix = prefix
    this.options = options
    StorageUtil.utils.push(this)
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
    const instance = new StorageInstance(prefixedKey, options ?? this.options)
    this.instances.push(instance)
    return instance
  }

  /**
   * 清除当前实例创建的所有存储项。
   */
  clear() {
    this.instances.forEach((instance) => {
      instance.removeItem()
    })
  }

  /**
   * 清除所有 StorageUtil 实例的存储项。
   */
  static clearAll() {
    StorageUtil.utils.forEach((storage) => {
      storage.instances.forEach((instance) => {
        instance.removeItem()
      })
    })
  }
}
