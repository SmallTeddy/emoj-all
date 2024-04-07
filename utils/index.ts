import { ElMessage, MessageHandler } from 'element-plus'

/**
 * @description 复制方法
 * @param {string} value 传入要复制的值
 * @return {string | MessageHandler }
 */
export const copy = (value: string): string | MessageHandler => {
  if (!value)
    return ElMessage.error('复制失败' + value)

  navigator.clipboard.writeText(value)
    .then(() => {
      ElMessage.success('复制成功' + value)
    })
    .catch(() => {
      ElMessage.error('复制失败' + value)
    });
  return value
}
