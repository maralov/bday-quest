const TWINS: Record<string, string> = {
  A: 'А', B: 'В', C: 'С', E: 'Е', H: 'Н', I: 'І', K: 'К', M: 'М', O: 'О', P: 'Р', T: 'Т', X: 'Х',
}

export function normalizeAnswer(s: string): string {
  return s.replace(/\s+/g, '').toUpperCase().replace(/[ABCEHIKMOPTX]/g, c => TWINS[c])
}

export async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

export function decodeB64Utf8(b64: string): string {
  return new TextDecoder().decode(Uint8Array.from(atob(b64), c => c.charCodeAt(0)))
}
