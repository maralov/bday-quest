import type { ComponentType } from 'react'
import type { Puzzle } from '../core/quest'
import Anagram from './Anagram'
import Cipher from './Cipher'
import Mirror from './Mirror'
import Radio from './Radio'

export const puzzles: { [K in Puzzle['type']]: ComponentType<{ data: Extract<Puzzle, { type: K }> }> } = {
  anagram: Anagram,
  mirror: Mirror,
  radio: Radio,
  cipher: Cipher,
}
