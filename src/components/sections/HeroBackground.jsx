import { useRef } from 'react'
import useScrollFrames from '../../hooks/useScrollFrames'

/**
 * HeroBackground
 *
 * Renders the scroll-driven frame animation canvas behind the hero content.
 * Includes a dark gradient overlay so text remains readable.
 */
export default function HeroBackground({ sectionRef }) {
  const canvasRef = useRef(null)

  useScrollFrames(canvasRef, sectionRef, {
    frameCount: 117,
    framePath: '/hero-frames/frame-',
    extension: 'webp',
    pin: true,
    scrollStart: 'top top',
    scrollEnd: '+=300%',
  })

  return (
    <>
      <canvas
        ref={canvasRef}
        className="hero-bg-canvas"
        aria-hidden="true"
      />
      <div className="hero-bg-overlay" aria-hidden="true" />
    </>
  )
}
