import { cloneDeep } from 'lodash-es'
import type { Reactive } from 'vue'
import type { ComponentRef } from '#/global'

type UseReactiveResult<T> = [Reactive<T>, () => void]

/**
 * 获取组件类型的ref
 * @param _comp 组件实例
 */
export function useComponentRef<T extends ComponentRef>(
  _comp: T,
) {
  return ref<InstanceType<T>>()
}

/**
 * 设置reactive对象
 * @param initVal 初始值
 * @return [data, resetVal] data响应式对象  resetVal重置函数
 */
export function useReactive<T extends object>(initVal: T): UseReactiveResult<T> {
  function getInitVal() {
    return cloneDeep(initVal)
  }

  const data = reactive<T>(getInitVal())

  function resetVal() {
    for (const k in data) {
      const key = k as keyof Reactive<T>
      delete data[key]
    }
    Object.assign(data, getInitVal())
  }

  return [data, resetVal]
}
