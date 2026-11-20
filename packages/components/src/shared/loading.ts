import { ElLoading } from 'element-plus'
import type { VNodeChild } from 'vue'

export const loading = async (title: VNodeChild = 'Loading...', processor: () => Promise<any>) => {
  let instance: ReturnType<typeof ElLoading.service> | undefined
  const timer = setTimeout(() => {
    instance = ElLoading.service({
      lock: true,
      text: typeof title === 'string' ? title : 'Loading...',
    })
  }, 100)
  try {
    return await processor()
  } finally {
    clearTimeout(timer)
    instance?.close()
  }
}
