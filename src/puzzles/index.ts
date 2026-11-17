import type { ComponentType } from 'react'
import type { Puzzle } from '../core/quest'
import Cipher from './Cipher'
import Mirror from './Mirror'
import Morse from './Morse'
import Radio from './Radio'

export const puzzles: { [K in Puzzle['type']]: ComponentType<{ data: Extract<Puzzle, { type: K }> }> } = {
  morse: Morse,
  mirror: Mirror,
  radio: Radio,
  cipher: Cipher,
}
