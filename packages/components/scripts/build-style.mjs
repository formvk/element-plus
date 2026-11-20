import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import * as sass from 'sass'

const rootDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const sourceFile = path.resolve(rootDir, 'src/style/index.scss')
const distDir = path.resolve(rootDir, 'dist')

mkdirSync(distDir, { recursive: true })

// 默认 el namespace 的编译产物，供应用层直接引入
const { css } = sass.compile(sourceFile, { style: 'expanded' })
writeFileSync(path.resolve(distDir, 'style.css'), `/* @formvk/element-plus styles */\n${css}`)

// scss 源文件随包发布，便于应用层通过 $namespace 对齐 Element Plus 自定义前缀
writeFileSync(path.resolve(distDir, 'style.scss'), readFileSync(sourceFile))
