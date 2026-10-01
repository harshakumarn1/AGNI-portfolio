import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * SectionHeader
 *
 * Creative scrollbar-triggered transition and animation for section headings
 * and descriptions. Includes 3D de-blur glide, animated glowing accent line,
 * and staggered subtitle reveal.
 */
export default function SectionHeader({ title, subtitle, className = '' }) {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const lineRef = useRef(null)
  const subtitleRef = useRef(null)
  const flareRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          end: 'bottom 10%',
          toggleActions: 'play reverse play reverse',
        },
      })

      // 1. Heading de-blur glide with letter-spacing settling
      tl.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 42,
          scale: 0.93,
          letterSpacing: '0.2em',
          filter: 'blur(12px)',
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          letterSpacing: '0.08em',
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power4.out',
        }
      )

      // 2. Light flare sweep across heading
      if (flareRef.current) {
        tl.fromTo(
          flareRef.current,
          { x: '-120%', opacity: 0 },
          { x: '120%', opacity: 0.9, duration: 1.1, ease: 'power2.inOut' },
          '-=0.7'
        )
      }

      // 3. Glowing accent line expansion
      if (lineRef.current) {
        tl.fromTo(
          lineRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.75, ease: 'power3.out' },
          '-=0.7'
        )
      }

      // 4. Description float up with de-blur
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          {
            opacity: 0,
            y: 24,
            filter: 'blur(8px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.75,
            ease: 'power3.out',
          },
          '-=0.5'
        )
      }
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div className={`section-header-wrapper ${className}`} ref={containerRef}>
      <div className="section-title-box">
        <span className="section-title-flare" ref={flareRef} aria-hidden="true" />
        <h2 className="section-title" ref={titleRef}>
          {title}
        </h2>
      </div>

      <div className="section-title-accent" ref={lineRef} aria-hidden="true">
        <span className="accent-line-track" />
        <span className="accent-line-core" />
        <span className="accent-line-spark" />
      </div>

      {subtitle && (
        <p className="section-subtitle" ref={subtitleRef}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
