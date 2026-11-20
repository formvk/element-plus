// 允许在 TS 中副作用导入样式文件
declare module '*.scss' {
  const content: string
  export default content
}

declare module '*.css' {
  const content: string
  export default content
}
