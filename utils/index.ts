/**
 * @description 复制方法
 * @param {string} value 传入要复制的值
 * @return {string | MessageHandler}
 */
export const copy = (value: string): string | void => {
  if (!value)
    return alert('复制失败')

  const tag = document.createElement('textarea')
  tag.value = value
  document.body.appendChild(tag)
  tag.select()
  document.execCommand('copy')
  alert('复制成功')
  tag.remove()
  return value
}
