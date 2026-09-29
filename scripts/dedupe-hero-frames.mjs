import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const FRAMES_DIR = path.resolve(__dirname, '..', 'public', 'hero-frames')
const TEMP_DIR = path.resolve(__dirname, '..', 'public', 'hero-frames-deduped')
const TARGET_MIN = 80
const TARGET_MAX = 90

/**
 * Downscale a frame to grayscale and return raw pixel buffer for comparison.
 * Using 480x270 for speed — enough fidelity to detect near-duplicates.
 */
async function getPixelBuffer(filePath) {
  const { data } = await sharp(filePath)
    .grayscale()
    .resize(480, 270, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true })
  return data
}

/**
 * Compute Root Mean Square Error between two pixel buffers.
 * Lower RMSE = more similar frames.
 */
function computeRMSE(buf1, buf2) {
  let sumSq = 0
  const len = Math.min(buf1.length, buf2.length)
  for (let i = 0; i < len; i++) {
    const diff = buf1[i] - buf2[i]
    sumSq += diff * diff
  }
  return Math.sqrt(sumSq / len)
}

/**
 * Given a threshold, walk through frames sequentially and keep only those
 * whose cumulative RMSE vs the last-kept frame exceeds the threshold.
 * Always keeps the first and last frame.
 */
function selectFrames(diffs, totalFrames, threshold) {
  const kept = [0]
  let lastKeptIdx = 0

  for (let i = 1; i < totalFrames - 1; i++) {
    let cumulativeRMSE = 0
    for (let j = lastKeptIdx + 1; j <= i; j++) {
      cumulativeRMSE += diffs[j - 1]
    }

    if (cumulativeRMSE >= threshold) {
      kept.push(i)
      lastKeptIdx = i
    }
  }

  kept.push(totalFrames - 1)
  return kept
}

async function main() {
  const files = fs.readdirSync(FRAMES_DIR)
    .filter(f => f.endsWith('.jpg'))
    .sort()

  console.log(`\n  Found ${files.length} frames in ${FRAMES_DIR}`)
  console.log(`  Target: ${TARGET_MIN}-${TARGET_MAX} frames\n`)

  // Step 1: Compute RMSE between every consecutive pair
  console.log('  Computing frame differences...')
  const diffs = []
  const buffers = []

  buffers[0] = await getPixelBuffer(path.join(FRAMES_DIR, files[0]))

  for (let i = 1; i < files.length; i++) {
    buffers[i] = await getPixelBuffer(path.join(FRAMES_DIR, files[i]))
    const rmse = computeRMSE(buffers[i - 1], buffers[i])
    diffs.push(rmse)

    if (i % 20 === 0) {
      process.stdout.write(`  Processed ${i}/${files.length} frames\r`)
    }
  }

  console.log(`  Processed ${files.length}/${files.length} frames`)

  const minDiff = Math.min(...diffs)
  const maxDiff = Math.max(...diffs)
  const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length
  console.log(`\n  RMSE stats: min=${minDiff.toFixed(2)}, max=${maxDiff.toFixed(2)}, avg=${avgDiff.toFixed(2)}`)

  // Step 2: Binary search for the right threshold
  console.log('\n  Finding optimal threshold...')
  let lo = 0
  let hi = diffs.reduce((a, b) => a + b, 0)
  let bestThreshold = 0
  let bestKept = null

  for (let iter = 0; iter < 100; iter++) {
    const mid = (lo + hi) / 2
    const kept = selectFrames(diffs, files.length, mid)

    if (kept.length >= TARGET_MIN && kept.length <= TARGET_MAX) {
      bestThreshold = mid
      bestKept = kept
      break
    } else if (kept.length > TARGET_MAX) {
      lo = mid
    } else {
      hi = mid
    }

    if (!bestKept || Math.abs(kept.length - 85) < Math.abs(bestKept.length - 85)) {
      bestThreshold = mid
      bestKept = kept
    }
  }

  console.log(`  Threshold: ${bestThreshold.toFixed(4)}`)
  console.log(`  Frames kept: ${bestKept.length}`)

  // Step 3: Copy kept frames to temp directory with sequential naming
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true })
  }
  fs.mkdirSync(TEMP_DIR, { recursive: true })

  console.log(`\n  Copying ${bestKept.length} frames...`)
  for (let newIdx = 0; newIdx < bestKept.length; newIdx++) {
    const origIdx = bestKept[newIdx]
    const src = path.join(FRAMES_DIR, files[origIdx])
    const dest = path.join(TEMP_DIR, `ezgif-frame-${String(newIdx + 1).padStart(3, '0')}.jpg`)
    fs.copyFileSync(src, dest)
  }

  // Step 4: Replace original frames
  console.log('  Replacing original frames...')
  for (const f of files) {
    fs.unlinkSync(path.join(FRAMES_DIR, f))
  }

  const newFiles = fs.readdirSync(TEMP_DIR).sort()
  for (const f of newFiles) {
    fs.renameSync(path.join(TEMP_DIR, f), path.join(FRAMES_DIR, f))
  }

  fs.rmSync(TEMP_DIR, { recursive: true })

  console.log(`\n  Done! Reduced from ${files.length} to ${bestKept.length} frames.`)
  console.log(`\n  UPDATE HeroBackground.jsx frameCount to: ${bestKept.length}`)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
