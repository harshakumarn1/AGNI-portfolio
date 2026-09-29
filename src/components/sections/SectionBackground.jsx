import { useRef } from 'react'
import useScrollFrames from '../../hooks/useScrollFrames'

/**
 * SectionBackground
 *
 * Reusable scroll-driven frame animation for non-pinned sections
 * (Skills / Projects / Contact). Unlike the hero, the section scrolls
 * naturally while the animation plays behind the content, mapped to the
 * section's own scroll range (enters viewport → leaves viewport).
 *
 * @param {React.RefObject<HTMLElement>} sectionRef - The section element
 * @param {string} framePath  - URL prefix for the frame sequence
 * @param {number} frameCount - Number of frames in the sequence
 * @param {object} [overlayStyle] - Optional inline style for the readability overlay
 */
export default function SectionBackground({ sectionRef, framePath, frameCount, overlayStyle }) {
  const canvasRef = useRef(null)

  useScrollFrames(canvasRef, sectionRef, {
    frameCount,
    framePath,
    pin: false,
    nativeSize: true,
    nativeWidth: 1920,
    nativeHeight: 1080,
    scrollStart: 'center center',
    scrollEnd: 'bottom bottom',
  })

  return (
    <>
      <canvas ref={canvasRef} className="section-bg-canvas" aria-hidden="true" />
      <div className="section-bg-overlay" style={overlayStyle} aria-hidden="true" />
    </>
  )
}
