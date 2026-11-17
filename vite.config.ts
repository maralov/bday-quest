import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  base: './',
  plugins: [react()],
  // .claude/worktrees містить копії репо паралельних сесій
  test: { environment: 'jsdom', exclude: [...configDefaults.exclude, '.claude/**'] },
})
