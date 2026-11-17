import raw from '../quest.json'

export type MorsePuzzle = { type: 'morse'; word: string; caption: string }
export type MirrorPuzzle = { type: 'mirror'; text: string }
export type RadioPuzzle = { type: 'radio'; min: number; max: number; target: number; text: string }
export type CipherPuzzle = { type: 'cipher'; shift: number; plain: string; keyHint: string }
export type Puzzle = MorsePuzzle | MirrorPuzzle | RadioPuzzle | CipherPuzzle
export type Level = { token: string; letter: string; hideAt: string; hints: [string, string]; puzzle: Puzzle }
export type Quest = {
  title: string; intro: string; hintDelaysSec: [number, number]; adminPasswordHash: string
  levels: Level[]; safe: { passwordHash: string }; finale: { title: string; giftPlaceB64: string }
}

export const UA_ALPHABET = 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ' // 33

const isStr = (v: unknown): v is string => typeof v === 'string' && v.trim() !== ''
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const isUaWord = (v: unknown, max: number) =>
  typeof v === 'string' && v.length >= 1 && v.length <= max && [...v].every(c => UA_ALPHABET.includes(c))

function fail(msg: string): never {
  throw new Error(`quest.json: ${msg}`)
}

// shortcut: перевіряє лише те, що ламає рівні; повну схему не валідуємо.
export function validateQuest(raw: unknown): Quest {
  const q = raw as Quest
  if (!q || typeof q !== 'object') fail('файл порожній або не є об’єктом')
  if (!isStr(q.title) || !isStr(q.intro)) fail('потрібні title та intro')
  const d = q.hintDelaysSec
  if (!Array.isArray(d) || d.length !== 2 || !d.every(isNum)) fail('hintDelaysSec має бути [число, число]')
  if (!isStr(q.adminPasswordHash) || !isStr(q.safe?.passwordHash)) fail('потрібні хеші паролів панелі та сейфа')
  if (!isStr(q.finale?.title) || !isStr(q.finale?.giftPlaceB64)) fail('потрібні finale.title та finale.giftPlaceB64')
  if (!Array.isArray(q.levels) || q.levels.length !== 4) fail('має бути рівно 4 рівні')

  const tokens = new Set<string>()
  q.levels.forEach((l, i) => {
    const n = `рівень ${i + 1}`
    if (typeof l.token !== 'string' || !/^[a-z0-9]{8}$/.test(l.token)) fail(`${n}: токен має бути 8 символів a-z0-9`)
    if (tokens.has(l.token)) fail(`${n}: токен повторюється`)
    tokens.add(l.token)
    if (!isUaWord(l.letter, 1)) fail(`${n}: letter має бути однією українською великою літерою`)
    if (!isStr(l.hideAt)) fail(`${n}: потрібне hideAt`)
    if (!Array.isArray(l.hints) || l.hints.length !== 2 || !l.hints.every(isStr)) fail(`${n}: потрібно 2 непорожні підказки`)
    const p = l.puzzle
    switch (p?.type) {
      case 'morse':
        if (!isUaWord(p.word, 4)) fail(`${n}: слово для морзянки має мати 1–4 великі українські літери`)
        if (!isStr(p.caption)) fail(`${n}: морзянці потрібен caption`)
        break
      case 'mirror':
        if (!isStr(p.text)) fail(`${n}: дзеркалу потрібен text`)
        break
      case 'radio':
        if (![p.min, p.max, p.target].every(isNum) || !(p.min < p.target && p.target < p.max))
          fail(`${n}: радіо потребує min < target < max`)
        if (!isStr(p.text)) fail(`${n}: радіо потрібен text`)
        break
      case 'cipher':
        if (!Number.isInteger(p.shift) || p.shift < 1 || p.shift > 32) fail(`${n}: зсув шифру має бути від 1 до 32`)
        if (!isStr(p.plain) || !isStr(p.keyHint)) fail(`${n}: шифру потрібні plain і keyHint`)
        break
      default:
        fail(`${n}: невідомий тип головоломки`)
    }
  })
  return q
}

export const quest: Quest = validateQuest(raw)
