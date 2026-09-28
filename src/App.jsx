import { useState, useEffect } from 'react'
import SmoothScroll from './components/layout/SmoothScroll'
import Loader from './components/layout/Loader'
import CustomCursor from './components/layout/CustomCursor'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Testimonials from './components/sections/Testimonials'
import Contact from './components/sections/Contact'
import Footer from './components/layout/Footer'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      <CustomCursor />
      <SmoothScroll>
        <Navbar />
        <main>
          <Hero />
          <Skills />
          <Projects />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  )
}
