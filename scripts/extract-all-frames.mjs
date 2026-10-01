import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import ffmpeg from 'ffmpeg-static'

const tasks = [
  {
    section: 'hero',
    dir: 'public/hero-frames',
    video: 'AtoS.MOV',
    fps: 24, // 4.88s * 24 ≈ 117 frames (smooth cinema scrub)
  },
  {
    section: 'skills',
    dir: 'public/skills-frames',
    video: 'DE.MOV',
    fps: 30, // 3.30s * 30 = 99 frames (matches original exactly)
  },
  {
    section: 'projects',
    dir: 'public/projects-frames',
    video: 'CF.MOV',
    fps: 30, // 2.07s * 30 = 62 frames (matches original exactly)
  },
  {
    section: 'contact',
    dir: 'public/contact-frames',
    video: 'FA.MOV',
    fps: 30, // 3.00s * 30 = 90 frames (matches original exactly)
  },
]

// 1. Ensure backup directory
const backupBase = 'public/_backup_jpg_frames'
if (!fs.existsSync(backupBase)) {
  fs.mkdirSync(backupBase, { recursive: true })
}

// Clean up any test files
['public/hero-frames/test-q85.webp', 'public/hero-frames/test-q90.webp'].forEach(f => {
  if (fs.existsSync(f)) fs.unlinkSync(f)
})

const results = []

for (const task of tasks) {
  const dirPath = task.dir
  const videoPath = path.join(dirPath, task.video)
  const backupDir = path.join(backupBase, task.section)

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  // Backup existing ezgif jpg frames if not backed up yet
  const existingFiles = fs.readdirSync(dirPath)
  for (const f of existingFiles) {
    if (f.startsWith('ezgif-frame-') && f.endsWith('.jpg')) {
      const src = path.join(dirPath, f)
      const dst = path.join(backupDir, f)
      if (!fs.existsSync(dst)) {
        fs.copyFileSync(src, dst)
      }
    }
  }

  // Remove existing .webp frames in output dir if re-running
  for (const f of existingFiles) {
    if (f.startsWith('frame-') && f.endsWith('.webp')) {
      fs.unlinkSync(path.join(dirPath, f))
    }
  }

  console.log(`\n[Extracting] ${task.section} (${task.video}) at ${task.fps} FPS, WebP Quality 90...`)

  const outputPattern = path.join(dirPath, 'frame-%03d.webp')
  const cmd = `"${ffmpeg}" -i "${videoPath}" -vf "fps=${task.fps}" -c:v libwebp -quality 90 -preset photo -compression_level 4 "${outputPattern}" -y`

  execSync(cmd, { stdio: 'inherit' })

  // Count extracted frames
  const webpFrames = fs.readdirSync(dirPath).filter(f => f.startsWith('frame-') && f.endsWith('.webp'))
  let totalBytes = 0
  webpFrames.forEach(f => {
    totalBytes += fs.statSync(path.join(dirPath, f)).size
  })

  results.push({
    section: task.section,
    frameCount: webpFrames.length,
    totalMB: (totalBytes / (1024 * 1024)).toFixed(2),
    avgKB: (totalBytes / webpFrames.length / 1024).toFixed(1),
  })
}

console.log('\n=== EXTRACTION COMPLETED SUCCESSFULLY ===')
console.table(results)
