import express from 'express'
import { createCanvas } from 'canvas'
import {
  generateHash,
  intToRGB,
  lighten,
  getDarkThemeColors,
  loggingMiddleware,
} from './utils.js'
import dotenv from 'dotenv'

// Setup ----------------------------------------
dotenv.config()

const app = express()
const port = process.env.PORT || 3003

app.use(loggingMiddleware)
app.listen(port, console.log(`Identicons server listening on port ${port}...`))

// Routes ---------------------------------------
app.get('/', (req, res) => {
  const size = req.query.size ? parseInt(req.query.size) : 200
  if (size < 0) {
    res.status(400).send('Size must be a positive integer')
    return
  }

  if (size > 1000) {
    res
      .status(400)
      .send('Size must be less than 1000 to prevent CPU exhaustion')
    return
  }

  if (
    req.query.theme &&
    req.query.theme !== 'light' &&
    req.query.theme !== 'dark'
  ) {
    res.status(400).send('Theme must be either "light" or "dark"')
    return
  }

  const seed = req.query.seed || Math.random().toString(36).substring(7)
  const theme = req.query.theme || 'light'
  const hash = generateHash(seed)
  let foregroundColor, backgroundColor

  if (theme === 'dark') {
    const colors = getDarkThemeColors(`#${intToRGB(hash)}`)
    foregroundColor = colors.foreground
    backgroundColor = colors.background
  } else {
    foregroundColor = `#${intToRGB(hash)}`
    backgroundColor = lighten(foregroundColor)
  }

  const blockSize = size / 5
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (i > 2) continue

      if (((hash >> (i * 5 + j)) & 1) === 1) {
        ctx.fillStyle = foregroundColor

        // Generate random pattern on the left side and mirror it on the right side
        ctx.fillRect(i * blockSize, j * blockSize, blockSize, blockSize)
        ctx.fillRect((4 - i) * blockSize, j * blockSize, blockSize, blockSize)
      }
    }
  }

  res.set('Content-Type', 'image/png')
  res.send(canvas.toBuffer('image/png'))
})
