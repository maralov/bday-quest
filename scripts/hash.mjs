// Хешує аргумент як є (sha256 hex). Для сейфа передавай уже нормалізоване слово, напр. "ДИВО".
import { createHash } from 'node:crypto'
const s = process.argv[2]
if (!s) { console.error('Використання: npm run hash -- "ТЕКСТ"'); process.exit(1) }
console.log(createHash('sha256').update(s, 'utf8').digest('hex'))
