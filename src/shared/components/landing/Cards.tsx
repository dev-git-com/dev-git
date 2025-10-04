'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import styles from '../../css/landing/cards.module.css'
import clsx from 'clsx'

gsap.registerPlugin(ScrollTrigger)

export default function Cards() {
  // Container reference
  const containerRef = useRef<HTMLDivElement>(null)

  // Card references
  const cardRefs = {
    card1: useRef<HTMLDivElement>(null),
    card2: useRef<HTMLDivElement>(null),
    card3: useRef<HTMLDivElement>(null)
  }

  // Title references
  const titleRefs = {
    title1: useRef<HTMLHeadingElement>(null),
    title2: useRef<HTMLHeadingElement>(null)
  }

  // Card content references
  const cardContentRefs = {
    titles: {
      cardTitle1: useRef<HTMLHeadingElement>(null),
      cardTitle2: useRef<HTMLHeadingElement>(null),
      cardTitle3: useRef<HTMLHeadingElement>(null)
    },
    descriptions: {
      cardDesc1: useRef<HTMLParagraphElement>(null),
      cardDesc2: useRef<HTMLParagraphElement>(null),
      cardDesc3: useRef<HTMLParagraphElement>(null)
    }
  }

  // Animation line references
  const lineRefs = {
    lines: {
      line1: useRef<HTMLDivElement>(null),
      line2: useRef<HTMLDivElement>(null),
      line3: useRef<HTMLDivElement>(null)
    },
    reverseLines: {
      reverseLine1: useRef<HTMLDivElement>(null),
      reverseLine2: useRef<HTMLDivElement>(null),
      reverseLine3: useRef<HTMLDivElement>(null)
    }
  }

  // Animate card lines with progress indicators
  const animateCardLines = (
    lineRef: React.RefObject<HTMLDivElement | null>,
    reverseLineRef: React.RefObject<HTMLDivElement | null>,
    cardRef: React.RefObject<HTMLDivElement | null>
  ) => {
    if (!lineRef.current || !reverseLineRef.current || !cardRef.current) return

    const tl = gsap.timeline()

    // Main line animation sequence
    tl.to(lineRef.current, {
      opacity: 1,
      duration: 0.1,
      ease: 'power2.out'
    })
      .to(lineRef.current, {
        '--vertical-progress': '100%',
        duration: 0.3,
        ease: 'power2.out'
      })
      .to(lineRef.current, {
        '--horizontal-progress': '100%',
        duration: 0.3,
        ease: 'power2.out'
      })
      .to(lineRef.current, {
        '--image-progress': '100%',
        duration: 0.3,
        ease: 'power2.out'
      })

    // Reverse line animation sequence
    tl.to(reverseLineRef.current, {
      opacity: 1,
      duration: 0.1,
      ease: 'power2.out'
    }, 0.3)
      .to(reverseLineRef.current, {
        '--reverse-vertical-progress': '100%',
        duration: 0.3,
        ease: 'power2.out'
      })
      .to(reverseLineRef.current, {
        '--reverse-horizontal-progress': '100%',
        duration: 0.3,
        ease: 'power2.out'
      })
      .to(cardRef.current, {
        '--reverse-final-vertical-progress': '100%',
        duration: 0.3,
        ease: 'power2.out'
      })

    return tl
  }

  // Reset card line animations
  const reverseCardLines = (
    lineRef: React.RefObject<HTMLDivElement | null>,
    reverseLineRef: React.RefObject<HTMLDivElement | null>,
    cardRef: React.RefObject<HTMLDivElement | null>
  ) => {
    if (!lineRef.current || !reverseLineRef.current || !cardRef.current) return

    gsap.set([lineRef.current, reverseLineRef.current], {
      opacity: 0,
      '--vertical-progress': '0%',
      '--horizontal-progress': '0%',
      '--image-progress': '0%',
      '--reverse-vertical-progress': '0%',
      '--reverse-horizontal-progress': '0%'
    })

    gsap.set(cardRef.current, {
      '--reverse-final-vertical-progress': '0%'
    })
  }

  // Reset all elements to initial state
  const resetElements = () => {
    // Reset main titles
    gsap.set([titleRefs.title1.current, titleRefs.title2.current], {
      scale: 1,
      clearProps: "margin"
    })

    // Reset card titles
    gsap.set([
      cardContentRefs.titles.cardTitle1.current,
      cardContentRefs.titles.cardTitle2.current,
      cardContentRefs.titles.cardTitle3.current
    ], {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      clearProps: "margin"
    })

    // Reset card descriptions
    gsap.set([
      cardContentRefs.descriptions.cardDesc1.current,
      cardContentRefs.descriptions.cardDesc2.current,
      cardContentRefs.descriptions.cardDesc3.current
    ], {
      opacity: 1
    })

    // Reset animation lines
    gsap.set([
      lineRefs.lines.line1.current,
      lineRefs.lines.line2.current,
      lineRefs.lines.line3.current
    ], {
      opacity: 0,
      '--vertical-progress': '0%',
      '--horizontal-progress': '0%',
      '--image-progress': '0%'
    })

    gsap.set([
      lineRefs.reverseLines.reverseLine1.current,
      lineRefs.reverseLines.reverseLine2.current,
      lineRefs.reverseLines.reverseLine3.current
    ], {
      opacity: 0,
      '--reverse-vertical-progress': '0%',
      '--reverse-horizontal-progress': '0%'
    })

    gsap.set([
      cardRefs.card1.current,
      cardRefs.card2.current,
      cardRefs.card3.current
    ], {
      '--reverse-final-vertical-progress': '0%'
    })
  }

  // Create mobile timeline animation
  const createMobileTimeline = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top-=50px',
        end: '+=100%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: false,
        onUpdate: (self) => {
          if (self.progress === 0) {
            reverseCardLines(lineRefs.lines.line1, lineRefs.reverseLines.reverseLine1, cardRefs.card1)
            reverseCardLines(lineRefs.lines.line2, lineRefs.reverseLines.reverseLine2, cardRefs.card2)
            reverseCardLines(lineRefs.lines.line3, lineRefs.reverseLines.reverseLine3, cardRefs.card3)
          }
        }
      }
    })

    // Title animations
    tl.to(titleRefs.title1.current, {
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.out'
    }, 0)
      .to(titleRefs.title2.current, {
        scale: 1.3,
        duration: 0.3,
        margin: 0,
        ease: 'power2.out'
      }, 0)

    // First card animation
    tl.call(() => {
      animateCardLines(lineRefs.lines.line1, lineRefs.reverseLines.reverseLine1, cardRefs.card1)
    }, [], 0.1)

    // Second card animation
    tl.to(cardRefs.card2.current, {
      y: '90px',
      x: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.4)
      .to(cardContentRefs.titles.cardTitle1.current, {
        y: -5,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out'
      }, 0.4)
      .to(cardContentRefs.descriptions.cardDesc1.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out'
      }, 0.4)

    tl.call(() => {
      animateCardLines(lineRefs.lines.line2, lineRefs.reverseLines.reverseLine2, cardRefs.card2)
    }, [], 0.5)

    // Third card animation
    tl.to(cardRefs.card3.current, {
      y: '180px',
      x: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.8)
      .to(cardContentRefs.titles.cardTitle2.current, {
        y: -5,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out'
      }, 0.8)
      .to(cardContentRefs.descriptions.cardDesc2.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out'
      }, 0.8)

    tl.call(() => {
      animateCardLines(lineRefs.lines.line3, lineRefs.reverseLines.reverseLine3, cardRefs.card3)
    }, [], 0.9)

    return tl
  }

  // Create desktop timeline animation
  const createDesktopTimeline = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top-=50px',
        end: '+=100%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: false,
        onUpdate: (self) => {
          if (self.progress === 0) {
            reverseCardLines(lineRefs.lines.line1, lineRefs.reverseLines.reverseLine1, cardRefs.card1)
            reverseCardLines(lineRefs.lines.line2, lineRefs.reverseLines.reverseLine2, cardRefs.card2)
            reverseCardLines(lineRefs.lines.line3, lineRefs.reverseLines.reverseLine3, cardRefs.card3)
          }
        }
      }
    })

    // First card and title animations
    tl.call(() => {
      animateCardLines(lineRefs.lines.line1, lineRefs.reverseLines.reverseLine1, cardRefs.card1)
    }, [], 0.1)
      .to(titleRefs.title1.current, {
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.out'
      }, 0)
      .to(titleRefs.title2.current, {
        scale: 1.6,
        duration: 0.3,
        margin: 0,
        ease: 'power2.out'
      }, 0)

    // Second card animation
    tl.to(cardRefs.card2.current, {
      x: '60px',
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.4)

    tl.call(() => {
      animateCardLines(lineRefs.lines.line2, lineRefs.reverseLines.reverseLine2, cardRefs.card2)
    }, [], 0.3)

    tl.to(cardContentRefs.titles.cardTitle1.current, {
      x: -233,
      y: 100,
      margin: 0,
      rotation: -90,
      scale: 0.5,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.4)
      .to(cardContentRefs.descriptions.cardDesc1.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, 0.4)

    // Third card animation
    tl.to(cardRefs.card3.current, {
      x: '120px',
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.8)

    tl.call(() => {
      animateCardLines(lineRefs.lines.line3, lineRefs.reverseLines.reverseLine3, cardRefs.card3)
    }, [], 0.7)

    tl.to(cardContentRefs.titles.cardTitle2.current, {
      x: -230,
      y: 100,
      margin: 0,
      rotation: -90,
      scale: 0.45,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.8)
      .to(cardContentRefs.descriptions.cardDesc2.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, 0.8)

    return tl
  }

  useEffect(() => {
    if (!containerRef.current) return

    gsap.config({ force3D: true })

    const mm = gsap.matchMedia()

    // Mobile responsive animation
    mm.add("(max-width: 1124px)", () => {
      resetElements()

      gsap.set([cardRefs.card2.current, cardRefs.card3.current], {
        y: '100vh',
        x: 0,
        force3D: true
      })

      const tl = createMobileTimeline()
      return () => tl.kill()
    })

    // Desktop responsive animation
    mm.add("(min-width: 1125px)", () => {
      resetElements()

      gsap.set([cardRefs.card2.current, cardRefs.card3.current], {
        x: '150%',
        y: 0
      })

      const tl = createDesktopTimeline()
      return () => tl.kill()
    })

    return () => {
      mm.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className={styles.scrollContainer}>
      {/* Main titles section */}
      <div className={clsx(styles.spacer, 'title')}>
        <h1 ref={titleRefs.title1}>Test First Title</h1>
        <h1 ref={titleRefs.title2}>Test Second Title</h1>
      </div>

      {/* Cards wrapper */}
      <div className={styles.cardsWrapper}>
        {/* First card */}
        <div ref={cardRefs.card1} className={`${styles.card} ${styles.card1}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardLeft}>
              <h2 ref={cardContentRefs.titles.cardTitle1} className={clsx(styles.cardTitle, 'title')}>
                First Card
              </h2>
              <p ref={cardContentRefs.descriptions.cardDesc1}>
                This is the content of the first card. It appears initially and remains in the background as other cards appear.
              </p>
            </div>
            <div className={styles.cardRight}>
              <Image
                src="/1753286370096.png"
                alt="First Card Image"
                fill
                className={styles.cardImage}
                priority
              />
            </div>
            <div className={styles.cardNumber}>01</div>
            <div ref={lineRefs.lines.line1} className={styles.animatedLine}></div>
            <div ref={lineRefs.reverseLines.reverseLine1} className={styles.reverseAnimatedLine}></div>
          </div>
        </div>

        {/* Second card */}
        <div ref={cardRefs.card2} className={`${styles.card} ${styles.card2}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardLeft}>
              <h2 ref={cardContentRefs.titles.cardTitle2} className={clsx(styles.cardTitle, 'title')}>
                Second Card
              </h2>
              <p ref={cardContentRefs.descriptions.cardDesc2}>
                This is the content of the second card. It slides in from the right after more scroll and partially overlaps the first card.
              </p>
            </div>
            <div className={styles.cardRight}>
              <Image
                src="/1753286370096.png"
                alt="Second Card Image"
                fill
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardNumber}>02</div>
            <div ref={lineRefs.lines.line2} className={styles.animatedLine}></div>
            <div ref={lineRefs.reverseLines.reverseLine2} className={styles.reverseAnimatedLine}></div>
          </div>
        </div>

        {/* Third card */}
        <div ref={cardRefs.card3} className={`${styles.card} ${styles.card3}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardLeft}>
              <h2 ref={cardContentRefs.titles.cardTitle3} className={clsx(styles.cardTitle, 'title')}>
                Third Card
              </h2>
              <p ref={cardContentRefs.descriptions.cardDesc3}>
                This is the content of the third card. It enters with a longer delay from the right and overlaps the previous cards.
              </p>
            </div>
            <div className={styles.cardRight}>
              <Image
                src="/1753286370096.png"
                alt="Third Card Image"
                fill
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardNumber}>03</div>
            <div ref={lineRefs.lines.line3} className={styles.animatedLine}></div>
            <div ref={lineRefs.reverseLines.reverseLine3} className={styles.reverseAnimatedLine}></div>
          </div>
        </div>
      </div>

      <div className={styles.pinSpacer}></div>
    </div>
  )
}