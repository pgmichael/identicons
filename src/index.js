const express = require('express')
const { createCanvas, loadImage } = require('canvas')
const { generateHash, intToRGB, paint } = require('./utils')
const dotenv = require('dotenv')

dotenv.config()
const app = express()
const port = process.env.PORT || 3003

app.get('/', (req, res) => {
  // Setup canvas and context
  const size = req.query.size ? parseInt(req.query.size) : 200
  if (size < 0) {
    res.status(400).send('Size must be a positive integer')
    return
  }

  if (size > 1000) {
    res.status(400).send('Size must be less than 1000 to prevent CPU exhaustion')
    return
  }

  const seed = req.query.seed || Math.random().toString(36).substring(7)
  const hash = generateHash(seed)
  const color = `#${intToRGB(hash)}`
  const blockSize = size / 5
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Paint
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (i > 2) continue

      if (((hash >> (i * 5 + j)) & 1) === 1) {
        ctx.fillStyle = color

        // Generate random pattern on the left side and mirror it on the right side
        ctx.fillRect(i * blockSize, j * blockSize, blockSize, blockSize)
        ctx.fillRect((4 - i) * blockSize, j * blockSize, blockSize, blockSize)
      }
    }
  }

  // Convert canvas to buffer
  const buffer = canvas.toBuffer('image/png')

  // Set content type and send the image
  res.set('Content-Type', 'image/png')
  res.send(buffer)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
