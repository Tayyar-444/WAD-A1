import { chmodSync, copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const gitDirectory = resolve(rootDirectory, '.git')
const hooksDirectory = resolve(gitDirectory, 'hooks')
const sourceHook = resolve(rootDirectory, 'githooks', 'pre-commit')
const targetHook = resolve(hooksDirectory, 'pre-commit')

if (!existsSync(gitDirectory)) {
  console.log(
    'Skipping git hook install because this folder is not a Git repository.'
  )
  process.exit(0)
}

mkdirSync(hooksDirectory, { recursive: true })
copyFileSync(sourceHook, targetHook)
chmodSync(targetHook, 0o755)

console.log('Installed the pre-commit hook.')
