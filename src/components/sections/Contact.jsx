import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import emailjs from '@emailjs/browser'
import ContactBackground from './ContactBackground'
import SectionHeader from '../common/SectionHeader'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [statusMessage, setStatusMessage] = useState('')
  const formRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return

    gsap.fromTo(
      sectionRef.current.querySelectorAll('.form-group, .submit-btn, .contact-header'),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  const validateField = (name, value) => {
    switch (name) {
      case 'name': {
        const trimmed = value.trim()
        if (!trimmed) {
          return 'Name is required'
        }
        if (trimmed.length < 2) {
          return 'Name must be at least 2 characters'
        }
        if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
          return 'Name can only contain letters and spaces'
        }
        return ''
      }
      case 'email': {
        const trimmed = value.trim()
        if (!trimmed) {
          return 'Email address is required'
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(trimmed)) {
          return 'Please enter a valid email (e.g. name@domain.com)'
        }
        return ''
      }
      case 'message': {
        const trimmed = value.trim()
        if (!trimmed) {
          return 'Message is required'
        }
        if (trimmed.length < 10) {
          return `Please enter at least 10 characters (${trimmed.length}/10 entered)`
        }
        return ''
      }
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const fieldError = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: fieldError }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const fieldError = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: fieldError }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newTouched = { name: true, email: true, message: true }
    setTouched(newTouched)

    const nameError = validateField('name', formData.name)
    const emailError = validateField('email', formData.email)
    const messageError = validateField('message', formData.message)

    const newErrors = {
      name: nameError,
      email: emailError,
      message: messageError,
    }
    setErrors(newErrors)

    if (nameError || emailError || messageError) {
      const firstInvalidId = nameError ? 'name' : emailError ? 'email' : 'message'
      document.getElementById(firstInvalidId)?.focus()
      return
    }

    setStatus('sending')
    setStatusMessage('')

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    // Check if EmailJS keys are mock or placeholder
    if (
      !serviceId ||
      !templateId ||
      !publicKey ||
      serviceId.includes('your_') ||
      templateId.includes('your_') ||
      publicKey.includes('your_')
    ) {
      setTimeout(() => {
        setStatus('error')
        setStatusMessage(
          'Email service credentials are being configured. Please connect with me directly via LinkedIn or GitHub!'
        )
      }, 700)
      return
    }

    try {
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey)
      setStatus('success')
      setStatusMessage('Thank you! Your message has been sent successfully. I will get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
      setTouched({})
      setErrors({})
      setTimeout(() => setStatus('idle'), 6000)
    } catch (err) {
      console.error('Failed to send email:', err)
      setStatus('error')
      setStatusMessage(
        err?.text || 'Failed to send message. Please check your network and try again.'
      )
      setTimeout(() => setStatus('idle'), 6000)
    }
  }

  return (
    <section className="contact-section section" id="contact" ref={sectionRef}>
      <ContactBackground sectionRef={sectionRef} />
      <SectionHeader
        title="CONTACT"
        subtitle="Have a project in mind or want to collaborate? Send a message!"
      />

      <div className="contact-container">
        <div className="contact-header">
          <motion.div
            className="contact-badge"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Let&apos;s Connect
          </motion.div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M406.5 399.6C387.4 352.9 341.5 320 288 320l-64 0c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3l64 0c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z" />
              </svg>
              <span>Name</span>
              <span className="required-star" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={!!(touched.name && errors.name)}
              aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
              className={`form-input ${touched.name && errors.name ? 'has-error' : ''}`}
              placeholder="e.g. Harsha"
            />
            <AnimatePresence>
              {touched.name && errors.name && (
                <motion.span
                  id="name-error"
                  className="form-error-msg"
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.name}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z" />
              </svg>
              <span>Your Email</span>
              <span className="required-star" aria-hidden="true">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={!!(touched.email && errors.email)}
              aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
              className={`form-input ${touched.email && errors.email ? 'has-error' : ''}`}
              placeholder="xyz@gmail.com"
            />
            <AnimatePresence>
              {touched.email && errors.email && (
                <motion.span
                  id="email-error"
                  className="form-error-msg"
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.email}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Message Field */}
          <div className="form-group">
            <label htmlFor="message" className="form-label">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M160 368c26.5 0 48 21.5 48 48l0 16 72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6L448 368c8.8 0 16-7.2 16-16l0-288c0-8.8-7.2-16-16-16L64 48c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16l96 0zm48 124l-.2.2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3l0-21.3 0-6.4 0-.3 0-4 0-48-48 0-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L448 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-138.7 0L208 492z" />
              </svg>
              <span>Message</span>
              <span className="required-star" aria-hidden="true">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              required
              aria-required="true"
              aria-invalid={!!(touched.message && errors.message)}
              aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
              rows="4"
              className={`form-textarea ${touched.message && errors.message ? 'has-error' : ''}`}
              placeholder="Write your message here..."
            />
            <div className="form-textarea-footer">
              <AnimatePresence>
                {touched.message && errors.message ? (
                  <motion.span
                    id="message-error"
                    className="form-error-msg"
                    role="alert"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{errors.message}</span>
                  </motion.span>
                ) : (
                  <span />
                )}
              </AnimatePresence>
              <span className={`char-counter ${formData.message.trim().length >= 10 ? 'valid' : ''}`}>
                {formData.message.trim().length} / 10 min
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="submit-btn"
            disabled={status === 'sending'}
            whileHover={status !== 'sending' ? { scale: 1.02 } : {}}
            whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
          >
            {status === 'sending' ? (
              'Sending Message...'
            ) : status === 'success' ? (
              <>
                <svg viewBox="0 0 512 512" fill="currentColor" width="18" height="18">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                </svg>
                Message Sent!
              </>
            ) : (
              <>
                <svg viewBox="0 0 512 512" fill="currentColor" width="18" height="18">
                  <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376l0 103.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                </svg>
                Send Message
              </>
            )}
          </motion.button>

          {/* Status Notifications */}
          <AnimatePresence>
            {status === 'error' && (
              <motion.div
                className="form-status-alert error"
                role="alert"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{statusMessage || 'Failed to send. Please try again.'}</span>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                className="form-status-alert success"
                role="status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{statusMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  )
}

