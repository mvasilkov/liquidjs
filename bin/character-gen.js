#!/usr/bin/env node

const isQuote = c => c === '"' || c === "'"
const isOperator = c => '!=<>'.includes(c)
const isNumber = c => c >= '0' && c <= '9'
const isCharacter = c => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
const isWord = c => '_-?'.includes(c) || isCharacter(c) || isNumber(c)
const isBlank = c => '\n\t \r\v\f'.includes(c)
const isInlineBlank = c => c === '\t' || c === ' ' || c === '\r'
const isSign = c => c === '-' || c === '+'
// See https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp
const unicodeBlanks = '\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000'
const unicodePunctuation = '“”'

const types = []
for (let i = 0; i < 128; i++) {
  const c = String.fromCharCode(i)
  let n = 0
  if (isWord(c)) n |= 1
  if (isOperator(c)) n |= 2
  if (isBlank(c)) n |= 4
  if (isQuote(c)) n |= 8
  if (isInlineBlank(c)) n |= 16
  if (isNumber(c)) n |= 32
  if (isSign(c)) n |= 64
  types.push(n)
}

console.log(`
// **DO NOT CHANGE THIS FILE**
//
// This file is generated by bin/character-gen.js
// bitmask character types to boost performance
export const TYPES = [${types.join(', ')}]
export const WORD = 1
export const OPERATOR = 2
export const BLANK = 4
export const QUOTE = 8
export const INLINE_BLANK = 16
export const NUMBER = 32
export const SIGN = 64
export const PUNCTUATION = 128

export function isWord (char: string): boolean {
  const code = char.charCodeAt(0)
  return code >= 128 ? !TYPES[code] : !!(TYPES[code] & WORD)
}
`.trim())

console.log([...unicodeBlanks].map(char => `TYPES[${char.charCodeAt(0)}]`).join(' = ') + ' = BLANK')
console.log([...unicodePunctuation].map(char => `TYPES[${char.charCodeAt(0)}]`).join(' = ') + ' = PUNCTUATION')
