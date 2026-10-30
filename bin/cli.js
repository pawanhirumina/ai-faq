#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const args = process.argv.slice(2)
const variant = args[0] || 'ts-tw'

const map = {
  'ts-tw': 'src/ts-tw/FaqAI.tsx',
  'ts-css': 'src/ts-css/FaqAI.tsx',
  'js-tw': 'src/js-tw/FaqAI.jsx',
  'js-css': 'src/js-css/FaqAI.jsx'
}

const sourceRel = map[variant] || map['ts-tw']
const sourcePath = path.join(__dirname, '..', sourceRel)

const destDir = path.join(process.cwd(), 'src', 'components')
const destFile = path.join(destDir, path.basename(sourceRel))

console.log(`\nai-faq -> Copying ${variant}`)
console.log(`From: ${sourcePath}`)
console.log(`To: ${destFile}\n`)

if (!fs.existsSync(sourcePath)) {
  console.error(`Source not found! Did you publish with src/ included?`)
  console.error(`Checked: ${sourcePath}`)
  process.exit(1)
}

fs.mkdirSync(destDir, { recursive: true })
fs.copyFileSync(sourcePath, destFile)

if (variant.includes('css')) {
  const cssSrc = path.join(__dirname, '..', 'src/ts-css/FaqAI.css')
  if (fs.existsSync(cssSrc)) {
    fs.copyFileSync(cssSrc, path.join(destDir, 'FaqAI.css'))
  }
}

console.log(`Copied to src/components/${path.basename(sourceRel)}`)
