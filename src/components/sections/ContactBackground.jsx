import { useRef } from 'react'
import useScrollFrames from '../../hooks/useScrollFrames'

/**
 * ContactBackground
 *
 * Scroll-driven frame animation background for the Contact section.
 * Renders frames at their native 1920×1080 resolution (no zoom/scaling).
 * Canvas is anchored to the bottom of the section.
 * Animation starts when the section enters the viewport and ends
 * when the user reaches the bottom of the section.
 */
export default function ContactBackground({ sectionRef }) {
  const canvasRef = useRef(null)

  useScrollFrames(canvasRef, sectionRef, {
    frameCount: 90,
    framePath: '/contact-frames/ezgif-frame-',
    pin: false,
    scrollStart: 'top center',
    scrollEnd: 'bottom bottom',
  })

  return (
    <>
      <canvas ref={canvasRef} className="contact-bg-canvas" aria-hidden="true" />
      <div className="section-bg-overlay" aria-hidden="true" />
    </>
  )
}
