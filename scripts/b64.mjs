const s = process.argv[2]
if (!s) { console.error('Використання: npm run b64 -- "ТЕКСТ"'); process.exit(1) }
console.log(Buffer.from(s, 'utf8').toString('base64'))
