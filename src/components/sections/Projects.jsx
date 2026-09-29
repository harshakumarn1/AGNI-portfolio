import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../../data/content'
import SectionHeader from '../common/SectionHeader'
import ProjectsBackground from './ProjectsBackground'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const progressLineRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animate central vertical timeline progress bar on scroll
      if (progressLineRef.current && containerRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 70%',
              end: 'bottom 85%',
              scrub: 1.2,
            },
          }
        )
      }

      // 2. Animate each project card, visual, text, node, and connecting branch
      cardsRef.current.forEach((card, i) => {
        if (!card) return

        const isEven = i % 2 === 1
        const visual = card.querySelector('.project-visual')
        const info = card.querySelector('.project-info')
        const techTags = card.querySelectorAll('.project-tech span')
        const node = card.querySelector('.connector-node')
        const branch = card.querySelector('.connector-branch')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            end: 'top 30%',
            toggleActions: 'play none none reverse',
          },
        })

        // Card visual reveal
        tl.fromTo(
          visual,
          { opacity: 0, x: isEven ? 90 : -90, scale: 0.9, rotateY: isEven ? 8 : -8 },
          { opacity: 1, x: 0, scale: 1, rotateY: 0, duration: 1, ease: 'power4.out' }
        )

        // Connector node spring pop
        if (node) {
          tl.fromTo(
            node,
            { scale: 0, opacity: 0, rotate: -60 },
            { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: 'back.out(2)' },
            '-=0.8'
          )
        }

        // Connector horizontal branch expansion
        if (branch) {
          tl.fromTo(
            branch,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power3.out' },
            '-=0.6'
          )
        }

        // Info text elements reveal
        tl.fromTo(
          info.querySelector('h3'),
          { opacity: 0, y: 30, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
          '-=0.5'
        )
          .fromTo(
            info.querySelector('p'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            '-=0.3'
          )
          .fromTo(
            techTags,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(2)' },
            '-=0.3'
          )
          .fromTo(
            info.querySelector('.btn-primary'),
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
            '-=0.2'
          )

        // Parallax depth on scroll for visual
        gsap.to(visual, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      })

      // Refresh ScrollTrigger to recalculate trigger positions with new content
      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="projects-section section" id="projects" ref={sectionRef}>
      <ProjectsBackground sectionRef={sectionRef} />
      <SectionHeader
        title="PROJECTS"
        subtitle="Some of the projects I've built."
      />

      <div className="projects-container" ref={containerRef}>
        {/* Central connecting timeline line */}
        <div className="projects-timeline" aria-hidden="true">
          <div className="projects-timeline-track" />
          <div className="projects-timeline-progress" ref={progressLineRef} />
        </div>

        {projects.map((project, idx) => {
          const isLaptop = project.type === 'web'
          const isEven = idx % 2 === 1
          // Odd row (idx 0, 2): Visual is on left, branch connects left.
          // Even row (idx 1): Visual is on right, branch connects right.
          const branchSide = isEven ? 'right' : 'left'

          return (
            <div
              key={project.title}
              className={`project-card ${isLaptop ? 'project-card-laptop' : 'project-card-mobile'}`}
              ref={(el) => (cardsRef.current[idx] = el)}
            >
              {/* Connecting node and branch line */}
              <div
                className={`project-connector connector-${branchSide}`}
                aria-hidden="true"
              >
                <div className="connector-node" title={`Project 0${idx + 1}`}>
                  <span className="node-pulse-ring" />
                  <span className="node-index">0{idx + 1}</span>
                </div>
                <div className="connector-branch">
                  <div className="connector-laser" />
                </div>
              </div>

              <a
                href={project.link}
                target={project.link !== '#' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`project-visual ${isLaptop ? 'project-visual-laptop' : 'project-visual-mobile'}`}
                style={{ perspective: '800px' }}
              >
                <img
                  src={project.frameImage}
                  alt={project.title}
                  className="project-frame"
                  loading="lazy"
                />
                <img
                  src={project.screenshot}
                  alt={`${project.title} screenshot`}
                  className="project-screenshot"
                  loading="lazy"
                />
              </a>

              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <a
                  href={project.link}
                  target={project.link !== '#' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <span>{project.link !== '#' ? 'View Live' : 'View Project'}</span>
                  <svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
                  </svg>
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

