import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { personalInfo } from '../../data/content'
import SocialIcons from '../ui/SocialIcons'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScroll, setLastScroll] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY

      setScrolled(current > 50)

      if (current > lastScroll && current > 200) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      setLastScroll(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScroll])

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      <a href="#hero" className="navbar-logo">
        <img src={personalInfo.logoImage} alt="AGNI" />
      </a>
      <div className="navbar-socials">
        <SocialIcons />
      </div>
    </motion.nav>
  )
}
