import { useRef } from 'react'
import useScrollFrames from '../../hooks/useScrollFrames'

/**
 * ProjectsBackground
 *
 * Scroll-driven frame animation background for the Projects section.
 * Renders frames at their native 1920×1080 resolution (no zoom/scaling).
 * Canvas is anchored to the bottom of the section.
 * Animation starts when the section enters the viewport and ends
 * when the user reaches the bottom of the section.
 */
export default function ProjectsBackground({ sectionRef }) {
  const canvasRef = useRef(null)

  useScrollFrames(canvasRef, sectionRef, {
    frameCount: 62,
    framePath: '/projects-frames/ezgif-frame-',
    pin: false,
    scrollStart: 'top center',
    scrollEnd: 'bottom bottom',
  })

  return (
    <>
      <canvas ref={canvasRef} className="projects-bg-canvas" aria-hidden="true" />
      <div className="section-bg-overlay" aria-hidden="true" />
    </>
  )
}
