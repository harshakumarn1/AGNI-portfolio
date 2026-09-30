import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { personalInfo } from '../../data/content'

/**
 * AboutModal
 *
 * Professional, advanced modal showcasing Harsha Kumar's profile,
 * engineering philosophy, academic background, and creative pursuits.
 */
export default function AboutModal({ isOpen, onClose }) {
  const { about, profileImage, socialLinks } = personalInfo

  // Lock body scroll and prevent page scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  const handleConnectClick = () => {
    onClose()
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          data-lenis-prevent="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          style={{ perspective: '1000px' }}
        >
          <motion.div
            className="modal-content advanced-about-modal"
            data-lenis-prevent="true"
            initial={{ opacity: 0, scale: 0.88, y: 40, rotateX: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 40, rotateX: 6 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close About Modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
              </svg>
            </button>

            {/* Profile Header */}
            <div className="modal-header-profile">
              <div className="modal-avatar-wrapper">
                <img
                  src={profileImage}
                  alt={personalInfo.name}
                  className="modal-avatar-img"
                />
                <div className="modal-avatar-aura" aria-hidden="true" />
              </div>

              <div className="modal-header-info">
                <h2 className="modal-profile-name">{personalInfo.name}</h2>
                <p className="modal-profile-role">
                  Full Stack Web Developer <span className="modal-role-divider">•</span> Content Creator
                </p>
              </div>
            </div>

            {/* Main Content Body */}
            <div className="modal-body-sections">
              {/* Section 1: Professional Bio & Philosophy */}
              <div className="modal-section-card">
                <div className="modal-section-header">
                  <span className="modal-section-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </span>
                  <h3 className="modal-section-title">ABOUT ME</h3>
                </div>

                <p className="modal-bio-text">
                  I am a passionate Full Stack Developer dedicated to designing, building, and optimizing scalable, high-performance web applications. Driven by curiosity and strong problem-solving skills, I continually expand my technical capabilities to create modern, user-centric digital experiences.
                </p>

                <div className="modal-highlights-grid">
                  <div className="modal-highlight-pill">
                    <span className="modal-pill-dot" />
                    <span>Full-Stack Architecture</span>
                  </div>
                  <div className="modal-highlight-pill">
                    <span className="modal-pill-dot" />
                    <span>Scalable & Clean Code</span>
                  </div>
                  <div className="modal-highlight-pill">
                    <span className="modal-pill-dot" />
                    <span>Interactive 3D & UI/UX</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Education */}
              <div className="modal-section-card">
                <div className="modal-section-header">
                  <span className="modal-section-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </span>
                  <h3 className="modal-section-title">EDUCATION</h3>
                </div>

                <div className="modal-education-entry">
                  <div className="modal-edu-timeline-bar" aria-hidden="true" />
                  <div className="modal-edu-details">
                    <div className="modal-edu-row">
                      <h4 className="modal-edu-degree">{about.education.degree}</h4>
                      <span className="modal-edu-badge">2020 – 2024</span>
                    </div>
                    <p className="modal-edu-institution">{about.education.university}</p>
                    <div className="modal-edu-specialization">
                      <span className="modal-spec-label">Specialization:</span>{' '}
                      <span className="modal-spec-value">{about.education.specialization}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Beyond Code (Hobbies & Content Creation) */}
              <div className="modal-section-card">
                <div className="modal-section-header">
                  <span className="modal-section-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </span>
                  <h3 className="modal-section-title">BEYOND CODE</h3>
                </div>

                <p className="modal-bio-text" style={{ marginBottom: '1rem' }}>
                  When I am not coding, I channel my energy into creative content production, competitive gaming, and outdoor sports:
                </p>

                <div className="modal-hobbies-grid">
                  <div className="modal-hobby-card">
                    <div className="modal-hobby-header">
                      <span className="modal-hobby-emoji">🎬</span>
                      <span className="modal-hobby-title">YouTube Creator</span>
                    </div>
                    <p className="modal-hobby-desc">
                      Produce engaging gaming content, tutorials, and community streams.
                    </p>
                  </div>

                  <div className="modal-hobby-card">
                    <div className="modal-hobby-header">
                      <span className="modal-hobby-emoji">🎮</span>
                      <span className="modal-hobby-title">BGMI & Esports</span>
                    </div>
                    <p className="modal-hobby-desc">
                      Tactical mobile gaming, strategic teamwork, and competitive play.
                    </p>
                  </div>

                  <div className="modal-hobby-card">
                    <div className="modal-hobby-header">
                      <span className="modal-hobby-emoji">🏏</span>
                      <span className="modal-hobby-title">Cricket Enthusiast</span>
                    </div>
                    <p className="modal-hobby-desc">
                      Active cricket player valuing focus, agility, and sportsmanship.
                    </p>
                  </div>

                  <div className="modal-hobby-card">
                    <div className="modal-hobby-header">
                      <span className="modal-hobby-emoji">🚀</span>
                      <span className="modal-hobby-title">Tech Exploration</span>
                    </div>
                    <p className="modal-hobby-desc">
                      Constantly learning emerging tech, modern frameworks, and tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer / Quick Actions */}
            <div className="modal-footer-actions">
              <div className="modal-footer-socials">
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-social-btn"
                  aria-label="GitHub"
                >
                  <svg width="17" height="17" viewBox="0 0 496 512" fill="currentColor">
                    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
                  </svg>
                </a>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-social-btn"
                  aria-label="LinkedIn"
                >
                  <svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                  </svg>
                </a>
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-social-btn"
                  aria-label="Twitter / X"
                >
                  <svg width="15" height="15" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M459.4 151.7c.3 4.5.3 9.1.3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z" />
                  </svg>
                </a>
              </div>

              <button
                className="btn-primary modal-cta-btn"
                onClick={handleConnectClick}
              >
                <span>Let&apos;s Connect</span>
                <svg width="15" height="15" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
