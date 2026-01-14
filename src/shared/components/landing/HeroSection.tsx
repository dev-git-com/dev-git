'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageGridMask from './PageGridMask';
import styles from '@/shared/css/landing/HeroSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const HeroSection: React.FC = () => {
  const [showVideo, setShowVideo] = useState(false);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const videoPopupRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (showVideo && videoPopupRef.current && videoContainerRef.current) {
      gsap.fromTo(videoPopupRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power1.inOut' }
      );
      
      gsap.fromTo(videoContainerRef.current,
        { opacity: 0, scale: 0.7, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.3)', delay: 0.15 }
      );
    }
  }, [showVideo]);

  useEffect(() => {
    const title = titleRef.current;
    const description = descriptionRef.current;
    const buttonContainer = buttonContainerRef.current;

    if (!title || !description || !buttonContainer) return;

    const titleWords = title.querySelectorAll(`.${styles.titleWord}`);
    const buttons = buttonContainer.querySelectorAll('a, button');

    gsap.set([titleWords, description], {
      opacity: 0,
      filter: 'blur(10px)',
      y: 30,
      scale: 0.95
    });

    gsap.set(buttons[0], {
      opacity: 0,
      x: -30,
      scale: 0.9,
      rotation: -3
    });

    gsap.set(buttons[1], {
      opacity: 0,
      x: 30,
      scale: 0.9,
      rotation: 3
    });

    const tl = gsap.timeline({ delay: 0.3 });

    titleWords.forEach((word, index) => {
      tl.to(word, {
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, index * 0.1);
    });

    tl.to(description, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      scale: 1,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.3')
    .to(buttons[0], {
      opacity: 1,
      x: 0,
      scale: 1,
      rotation: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.7')
    .to(buttons[1], {
      opacity: 1,
      x: 0,
      scale: 1,
      rotation: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.5');

  }, []);

  useEffect(() => {
    const buttonContainer = buttonContainerRef.current;
    const section = sectionRef.current;
    
    if (!buttonContainer || !section) return;

    gsap.set(buttonContainer, { clearProps: "all" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section, 
        start: "bottom 42%", 
        end: "bottom 42%", 
        toggleActions: "play none reverse none"
      }
    });

    const buttonClone = buttonContainer.cloneNode(true) as HTMLElement;
    buttonClone.style.position = "fixed";
    buttonClone.style.top = "20px";
    buttonClone.style.right = "20px";
    buttonClone.style.zIndex = "1000";
    buttonClone.style.transform = "scale(0.7)";
    buttonClone.style.opacity = "0";
    document.body.appendChild(buttonClone);

    tl.to(buttonContainer, {
      opacity: 0,
      duration: 0.2
    })
    .to(buttonClone, {
      opacity: 1,
      duration: 0.2
    }, "-=0.1");

    const cloneGetStarted = buttonClone.querySelector('a');
    const cloneVideoBtn = buttonClone.querySelector('button');
    
    if (cloneGetStarted) {
      cloneGetStarted.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/develop';
      });
    }
    
    if (cloneVideoBtn) {
      cloneVideoBtn.addEventListener('click', () => setShowVideo(true));
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      const existingClone = document.body.querySelector('[style*="position: fixed"][style*="top: 20px"]');
      if (existingClone && existingClone !== buttonContainer) {
        existingClone.remove();
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <section ref={sectionRef} className={styles.heroSection}>
        <PageGridMask />

        <div className={styles.heroContainer}>
          <h1 ref={titleRef} className={styles.heroTitle}>
            <span className={`${styles.titleWord} ${styles.build}`}>Build</span>
            <span className={`${styles.titleWord} ${styles.productionReady}`}>Production-Ready</span>
            <span className={`${styles.titleWord} ${styles.backend}`}>Backend</span>
            <span className={`${styles.titleWord} ${styles.applications}`}>Applications</span>
            <span className={`${styles.titleWord} ${styles.faster}`}>Faster</span>
          </h1>



          <p ref={descriptionRef} className={styles.heroDescription}>
            Build next-generation applications using advanced frameworks and <span className={styles.highlight}>powerful integrations</span> for maximum efficiency.
          </p>

          <div className={styles.buttonsWrapper}>
            <div ref={buttonContainerRef} className={styles.buttonsContainer}>
              <Link href="/develop" className={styles.getStartedButton}>
                Get Started
              </Link>
              <button
                className={styles.videoButton}
                onClick={() => setShowVideo(true)}
                aria-label="Play video"
              >
                <div className={styles.playIcon}>
                  <div className={styles.playIconCircle}>
                    <div className={styles.playIconTriangle}></div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {showVideo && (
        <div ref={videoPopupRef} className={styles.videoPopup}>
          <div ref={videoContainerRef} className={styles.videoContainer}>
            <button
              className={styles.closeButton}
              onClick={() => setShowVideo(false)}
              aria-label="Close video"
            >
              ✕
            </button>
            <iframe
              className={styles.iframe}
              src="https://www.youtube.com/embed/WCwD_1Qm218?autoplay=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
