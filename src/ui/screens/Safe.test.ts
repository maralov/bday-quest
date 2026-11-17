import { expect, it } from 'vitest'
import quest from '../../quest.json'
import { checkSafe } from './Safe'

it('checkSafe приймає ДИВО в будь-якому написанні', async () => {
  const h = quest.safe.passwordHash
  for (const v of ['диво', ' Диво ', 'ДИВO', 'ДИВО']) expect(await checkSafe(v, h)).toBe(true)
  expect(await checkSafe('ДИВА', h)).toBe(false)
})
