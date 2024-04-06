/**
 * @description 复制方法
 * @param {string} value 传入要复制的值
 * @return {string }
 */
export const copy = (value: string): string | void => {
  if (!value)
    return alert('复制失败')

  navigator.clipboard.writeText(value)
      .then(() => {
        alert('复制成功'+value);
      })
      .catch((error) => {
        alert('复制失败'+value);
        console.error('复制失败:', error);
      });
  return value
}
