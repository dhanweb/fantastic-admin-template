/**
 * 响应参数类型
 */
declare interface BaseResult<T = any> {
  data: T
  msg: string
  code: number
}
/**
 * 响应参数类型 Promise
 */
declare type Result<T = any> = Promise<BaseResult<T>>

/**
 * 响应参数类型 带分页
 */
declare interface BasePage<T> extends BaseResult<T> {
  totalPage: number
  totals: number
}

/**
 * 响应参数类型 带分页 Promise
 */
declare type PageResult<T = any> = Promise<BasePage<T>>

/**
 * 分页请求参数类型
 */
declare interface PageParams {
  pageNum: number
  pageSize: number
}

/**
 * 文件下载响应参数类型 （非后端返回，而是在响应拦截器定义的）
 */
declare interface BaseFileResult {
  file: Blob
  filename: string
}

/**
 * 文件下载响应参数类型 （非后端返回，而是在响应拦截器定义的）Promise
 */
declare type FileResult = Promise<BaseFileResult>
