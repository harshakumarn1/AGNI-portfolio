import { useEffect, useRef, useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { personalInfo } from '../../data/content'
import ProfilePhoto3D from '../../canvas/ProfilePhoto3D'
import HeroBackground from './HeroBackground'
import AboutModal from '../ui/AboutModal'

gsap.registerPlugin(ScrollTrigger)

const roles = ['Full Stack Developer', 'Editor', 'Gamer']

function RotatingText() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  return (
    <span className="rotating-text-wrapper">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          className="rotating-text"
          initial={{ opacity: 0, y: 22, filter: 'blur(8px)', rotateX: 45 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0 }}
          exit={{ opacity: 0, y: -22, filter: 'blur(8px)', rotateX: -45 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Hero() {
  const [showAbout, setShowAbout] = useState(false)
  const sectionRef = useRef(null)
  const greetingRef = useRef(null)
  const nameRef = useRef(null)
  const taglineRef = useRef(null)
  const buttonsRef = useRef(null)
  const photoRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.0 })

      // 1. Photo entrance from right - size is completely constant (no scale animation)
      tl.fromTo(
        photoRef.current,
        { opacity: 0, x: 70 },
        { opacity: 1, x: 0, duration: 1.1, ease: 'power4.out' }
      )
        // 2. Greeting badge slide & focus
        .fromTo(
          greetingRef.current,
          { opacity: 0, y: 30, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
          '-=0.6'
        )
        // 3. Name entrance - animates h1 directly so name is fully visible
        .fromTo(
          nameRef.current,
          { opacity: 0, y: 35, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power4.out' },
          '-=0.5'
        )
        // 4. Tagline slide & focus
        .fromTo(
          taglineRef.current,
          { opacity: 0, y: 25, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
          '-=0.4'
        )
        // 5. Buttons spring in directly so buttons are fully visible
        .fromTo(
          buttonsRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.8)' },
          '-=0.3'
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <section className="hero" id="hero" ref={sectionRef}>
        <HeroBackground sectionRef={sectionRef} />
        <div className="hero-container">
          <div className="hero-content">
            <div
              ref={greetingRef}
              className="hero-greeting"
            >
              <span className="hero-greeting-pill">
                <span className="hero-greeting-dot" />
                {personalInfo.greeting}
              </span>
            </div>
            <h1
              ref={nameRef}
              className="hero-name"
            >
              <span className="hero-name-word">Harsha</span>{' '}
              <span className="hero-name-word">Kumar</span>
            </h1>
            <p
              ref={taglineRef}
              className="hero-tagline"
            >
              <span className="hero-tagline-lead">I am a</span> <RotatingText />
            </p>
            <div
              ref={buttonsRef}
              className="hero-buttons"
            >
              <button
                className="btn-primary hero-btn-cta"
                onClick={() => setShowAbout(true)}
              >
                <span>About Me</span>
                <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
                </svg>
              </button>
              <a href="#skills" className="btn-outline hero-btn-secondary">
                <span>View Skills</span>
                <svg width="14" height="14" viewBox="0 0 384 512" fill="currentColor">
                  <path d="M169.4 502.6c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 402.7 224 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 370.7L86.6 329.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="hero-photo-wrapper" ref={photoRef}>
            <div className="hero-photo-aura" aria-hidden="true" />
            <div className="hero-photo-3d">
              <Suspense fallback={<div style={{ width: '100%', height: '100%' }} />}>
                <ProfilePhoto3D />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </>
  )
}
