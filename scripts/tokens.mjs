import { randomBytes } from 'node:crypto'
const abc = 'abcdefghijklmnopqrstuvwxyz0123456789'
for (let i = 0; i < 4; i++) console.log([...randomBytes(8)].map(b => abc[b % abc.length]).join(''))
