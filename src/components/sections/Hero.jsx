import { useEffect, useRef, useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { personalInfo } from '../../data/content'
import ProfilePhoto3D from '../../canvas/ProfilePhoto3D'
import HeroBackground from './HeroBackground'

function AboutModal({ isOpen, onClose }) {
  const { about } = personalInfo

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.85, y: 50, rotateX: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50, rotateX: 8 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ perspective: '800px' }}
          >
            <button className="modal-close" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
              </svg>
            </button>

            <h3 className="modal-title">ABOUT ME</h3>
            <p className="modal-text">
              {about.description}
              <br /><br />
              {about.extra}
            </p>

            <h3 className="modal-subtitle">EDUCATION</h3>
            <p className="modal-education">
              {about.education.degree}<br />
              {about.education.university}<br />
              Specialization — {about.education.specialization}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
    const tl = gsap.timeline({ delay: 2.2 })

    // Photo fades in first from the right
    tl.fromTo(
      photoRef.current,
      { opacity: 0, scale: 0.8, x: 80 },
      { opacity: 1, scale: 1, x: 0, duration: 1, ease: 'power4.out' }
    )
      // Then text elements stagger in
      .fromTo(
        greetingRef.current,
        { opacity: 0, y: 50, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power4.out' },
        '-=0.5'
      )
      .fromTo(
        nameRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power4.out' },
        '-=0.4'
      )
      .fromTo(
        taglineRef.current,
        { opacity: 0, y: 40, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(
        buttonsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      )

    return () => tl.kill()
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
              style={{ opacity: 0 }}
            >
              {personalInfo.greeting}
            </div>
            <h1
              ref={nameRef}
              className="hero-name"
              style={{ opacity: 0 }}
            >
              {personalInfo.name}
            </h1>
            <p
              ref={taglineRef}
              className="hero-tagline"
              style={{ opacity: 0 }}
            >
              I am a <span>{personalInfo.tagline}</span>
            </p>
            <div
              ref={buttonsRef}
              className="hero-buttons"
              style={{ opacity: 0 }}
            >
              <button
                className="btn-primary"
                onClick={() => setShowAbout(true)}
              >
                <span>About Me</span>
                <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
                </svg>
              </button>
              <a href="#skills" className="btn-outline">
                <span>View Skills</span>
                <svg width="14" height="14" viewBox="0 0 384 512" fill="currentColor">
                  <path d="M169.4 502.6c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 402.7 224 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 370.7L86.6 329.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="hero-photo-wrapper" ref={photoRef} style={{ opacity: 0 }}>
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
