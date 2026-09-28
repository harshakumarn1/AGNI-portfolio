import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { testimonials } from '../../data/content'

gsap.registerPlugin(ScrollTrigger)

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const sectionRef = useRef(null)
  const total = testimonials.length

  const next = () => setCurrent((prev) => (prev + 1) % total)
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total)

  // Auto-play
  useEffect(() => {
    const interval = setInterval(next, 6000)
    return () => clearInterval(interval)
  }, [])

  // Scroll reveal
  useEffect(() => {
    if (!sectionRef.current) return

    gsap.fromTo(
      sectionRef.current.querySelector('.testimonials-carousel'),
      { opacity: 0, y: 60, scale: 0.92 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  const t = testimonials[current]

  const cardVariants = {
    enter: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 120 : -120,
      rotateY: direction > 0 ? 20 : -20,
      scale: 0.9,
    }),
    center: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      scale: 1,
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -120 : 120,
      rotateY: direction > 0 ? -20 : 20,
      scale: 0.9,
    }),
  }

  const [direction, setDirection] = useState(1)

  const goNext = () => {
    setDirection(1)
    next()
  }

  const goPrev = () => {
    setDirection(-1)
    prev()
  }

  return (
    <section className="testimonials-section section" id="testimonials" ref={sectionRef}>
      <h2 className="section-title">TESTIMONIALS</h2>
      <p className="section-subtitle">
        What people I've worked with have to say.
      </p>

      <div className="testimonials-carousel" style={{ perspective: '1200px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            className="testimonial-card"
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.4 },
            }}
          >
            <motion.img
              src={t.image}
              alt={t.name}
              className="testimonial-image"
              loading="lazy"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: 'backOut' }}
            />
            <motion.p
              className="testimonial-quote"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              {t.quote}
            </motion.p>
            <motion.p
              className="testimonial-name"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              {t.name}
            </motion.p>
            <motion.p
              className="testimonial-position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              {t.position}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        <div className="carousel-controls">
          <button className="carousel-btn" onClick={goPrev} aria-label="Previous testimonial">
            <svg viewBox="0 0 320 512" fill="currentColor">
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
            </svg>
          </button>

          <div className="carousel-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === current ? 'active' : ''}`}
                onClick={() => {
                  setDirection(i > current ? 1 : -1)
                  setCurrent(i)
                }}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button className="carousel-btn" onClick={goNext} aria-label="Next testimonial">
            <svg viewBox="0 0 320 512" fill="currentColor">
              <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5-12.5-32.8-12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
