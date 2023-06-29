import { message } from 'antd'

export const waitTimePromise = async (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICrudApi<C = any, R = any, U = any, D = any> {
  create: (data: C) => Promise<any>
  read: (params: R) => Promise<any>
  update: (data: U) => Promise<any>
  delete: (params: D) => Promise<any>
}

const useCrud = <C, R, U, D>(crudApi: Partial<ICrudApi<C, R, U, D>>) => {
  /**
   * 添加节点
   * @param data
   */
  const handleCreate = async (data: C): Promise<any> => {
    console.log('🚀 ~ file: index.tsx ~ line 26 ~ handleAdd ~ values', data)
    const hide = message.loading('正在添加')
    try {
      await crudApi.create?.(data)
      // await waitTimePromise(1000);
      hide()
      message.success('添加成功')
      return true
    } catch (error) {
      hide()
      message.error('添加失败请重试！')
      return false
    }
  }
  /**
   *  删除节点
   * @param selectedRows
   */
  const handleDelete = async (params: D): Promise<any> => {
    console.log('🚀 ~ file: index.tsx ~ line 45 ~ handleRemove ~ selectedRows', params)
    const hide = message.loading('正在删除')
    // await waitTimePromise(1000);

    if (!params) return true
    try {
      await crudApi.delete?.(params)
      hide()
      message.success('删除成功')
      return true
    } catch (error) {
      hide()
      message.error('删除失败，请重试')
      return false
    }
  }
  return {
    handleCreate,
    handleDelete
  }
}

export default useCrud
