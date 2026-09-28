import { motion } from 'framer-motion'
import { personalInfo } from '../../data/content'

export default function Loader({ onComplete }) {
  return (
    <motion.div
      className="loader-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 1.6 }}
      onAnimationComplete={onComplete}
    >
      <motion.img
        src={personalInfo.logoImage}
        alt="AGNI"
        className="loader-logo"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0.6], scale: [0.8, 1.05, 1, 1] }}
        transition={{ duration: 1.8, times: [0, 0.3, 0.6, 1] }}
      />
      <div className="loader-bar-track">
        <motion.div
          className="loader-bar-fill"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  )
}
