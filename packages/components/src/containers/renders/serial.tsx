/** 序号渲染：按当前页的行索引生成 1 起始的序号 */
export function serial() {
  return (_text: unknown, _record: unknown, index: number) => index + 1
}
