import { useEffect, useCallback, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useScrollFrames
 *
 * Preloads a sequence of animation frames, renders them on a <canvas>,
 * and wires up GSAP ScrollTrigger so scroll position maps to frame index.
 * Scroll down = forward, scroll up = reverse — handled automatically by scrub.
 *
 * Configurable so it can drive both the pinned hero animation and the
 * non-pinned section backgrounds (Skills / Projects / Contact).
 *
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef
 * @param {React.RefObject<HTMLElement>} sectionRef - The section element to trigger on
 * @param {object} [config]
 * @param {number} [config.frameCount=147]      - Number of frames in the sequence
 * @param {string} [config.framePath='/hero-frames/ezgif-frame-'] - URL prefix for frames
 * @param {boolean} [config.pin=true]           - Pin the section while animating
 * @param {number} [config.scrub=0.5]           - ScrollTrigger scrub smoothing (seconds)
 * @param {string} [config.scrollStart='top top'] - ScrollTrigger start position
 * @param {string} [config.scrollEnd='+=300%']  - ScrollTrigger end position
 */
export default function useScrollFrames(canvasRef, sectionRef, config = {}) {
  const {
    frameCount = 147,
    framePath = '/hero-frames/frame-',
    extension = 'webp',
    pin = true,
    scrub = 0.5,
    scrollStart = 'top top',
    scrollEnd = '+=300%',
    nativeSize = false,
    nativeWidth = 0,
    nativeHeight = 0,
  } = config

  const imagesRef = useRef([])
  const currentFrameRef = useRef(0)
  const targetFrameRef = useRef(0)
  const loadedCountRef = useRef(0)

  /**
   * Draw a specific frame onto the canvas, cover-fitting it
   * similar to CSS `object-fit: cover`.
   */
  const render = useCallback((frameIndex) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    const clampedIndex = Math.max(0, Math.min(frameCount - 1, frameIndex))
    targetFrameRef.current = clampedIndex

    // Check if target frame is loaded; if not, fallback to nearest available frame
    let img = imagesRef.current[clampedIndex]
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < frameCount; offset++) {
        const prev = imagesRef.current[clampedIndex - offset]
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev
          break
        }
        const next = imagesRef.current[clampedIndex + offset]
        if (next && next.complete && next.naturalWidth > 0) {
          img = next
          break
        }
      }
      // If absolutely no frame has loaded yet, wait for first frame
      if (!img || !img.complete || img.naturalWidth === 0) return
    }

    // Enable high-quality smoothing for crisp, anti-aliased visual rendering
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (nativeSize) {
      // 1:1 rendering — no scaling, preserves original frame quality
      ctx.drawImage(img, 0, 0)
    } else {
      // Contain-fit: show the full frame at original proportions, no cropping
      const canvasW = canvas.width
      const canvasH = canvas.height
      const imgW = img.naturalWidth
      const imgH = img.naturalHeight

      const scale = Math.min(canvasW / imgW, canvasH / imgH)
      const drawW = imgW * scale
      const drawH = imgH * scale
      const drawX = (canvasW - drawW) / 2
      const drawY = (canvasH - drawH) / 2

      ctx.drawImage(img, drawX, drawY, drawW, drawH)
    }

    currentFrameRef.current = clampedIndex
  }, [canvasRef, nativeSize, frameCount])

  /**
   * Size the canvas to match its container, accounting for device pixel ratio.
   * Cap DPR at 2 to balance quality vs performance.
   */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (nativeSize && nativeWidth && nativeHeight) {
      // Use frame's native resolution — no DPR scaling needed
      canvas.width = nativeWidth
      canvas.height = nativeHeight
      canvas.style.width = `${nativeWidth}px`
      canvas.style.height = `${nativeHeight}px`
    } else {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.parentElement.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    // Redraw the current frame at the new size
    render(targetFrameRef.current)
  }, [canvasRef, render, nativeSize, nativeWidth, nativeHeight])

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const images = []
    let scrollTriggerInstance = null

    // Builds a zero-padded frame URL, e.g. index 0 → "<framePath>001.webp"
    const getFrameSrc = (index) =>
      `${framePath}${String(index + 1).padStart(3, '0')}.${extension}`

    // --- 1. Preload all frames with prioritized scheduling ---
    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      
      // Prioritize initial frames for instant load and immediate scroll readiness
      if ('fetchPriority' in img) {
        img.fetchPriority = i === 0 ? 'high' : i < 15 ? 'auto' : 'low'
      }

      img.src = getFrameSrc(i)

      img.onload = () => {
        loadedCountRef.current++

        // Draw the very first frame as soon as it's ready
        if (i === 0 && targetFrameRef.current === 0) {
          resizeCanvas()
          render(0)
          ScrollTrigger.refresh()
        } else if (targetFrameRef.current === i || Math.abs(targetFrameRef.current - i) <= 1) {
          render(targetFrameRef.current)
        }
      }

      images.push(img)
    }

    imagesRef.current = images

    // --- 2. Size the canvas ---
    resizeCanvas()

    // --- 3. Setup GSAP ScrollTrigger ---
    const frameObj = { value: 0 }

    scrollTriggerInstance = gsap.to(frameObj, {
      value: frameCount - 1,
      snap: 'value',       // Snap to whole frame numbers
      ease: 'none',        // Linear mapping: scroll position ↔ frame
      scrollTrigger: {
        trigger: section,
        start: scrollStart,
        end: scrollEnd,
        scrub,                      // Smooth catch-up (seconds)
        pin,                        // Pin the section while animating (hero only)
        anticipatePin: pin ? 1 : 0, // Smooth pin entry when pinning
        invalidateOnRefresh: true,  // Recalculate accurately on orientation / resize
      },
      onUpdate: () => {
        const frameIndex = Math.max(0, Math.min(frameCount - 1, Math.round(frameObj.value)))
        targetFrameRef.current = frameIndex
        // Only redraw if the frame actually changed
        if (frameIndex !== currentFrameRef.current) {
          render(frameIndex)
        }
      },
    })

    // --- 4. Handle window resize ---
    window.addEventListener('resize', resizeCanvas)

    // --- 5. Cleanup ---
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (scrollTriggerInstance) {
        scrollTriggerInstance.scrollTrigger?.kill()
        scrollTriggerInstance.kill()
      }
      imagesRef.current = []
    }
  }, [
    canvasRef,
    sectionRef,
    render,
    resizeCanvas,
    frameCount,
    framePath,
    extension,
    pin,
    scrub,
    scrollStart,
    scrollEnd,
    nativeSize,
    nativeWidth,
    nativeHeight,
  ])
}
