function generateHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  return hash
}

function intToRGB(i) {
  let c = (i & 0x00ffffff).toString(16).toUpperCase()
  return '00000'.substring(0, 6 - c.length) + c
}

function lighten(color, factor = 175) {
  const [r, g, b] = [
    Math.min(parseInt(color.slice(1, 3), 16) + factor, 255),
    Math.min(parseInt(color.slice(3, 5), 16) + factor, 255),
    Math.min(parseInt(color.slice(5, 7), 16) + factor, 255),
  ]

  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

module.exports = {
  generateHash,
  intToRGB,
  lighten,
}
