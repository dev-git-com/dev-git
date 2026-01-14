'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '@/shared/css/landing/CardsSection.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CardsSection: React.FC = () => {
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const cardsSectionRef = useRef<HTMLDivElement>(null);
  const nextSectionRef = useRef<HTMLElement | null>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const title3Ref = useRef<HTMLHeadingElement>(null);

  const renderChars = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className={styles.char}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  useEffect(() => {
    const titles = [
      { ref: title1Ref, delay: 0 },
      { ref: title2Ref, delay: 0.38 },
      { ref: title3Ref, delay: 0.66 }
    ];
    
    titles.forEach(({ ref, delay }) => {
      const title = ref.current;
      if (!title || !cardsSectionRef.current) return;

      const chars = title.querySelectorAll(`.${styles.char}`);
      const totalChars = chars.length;
      
      chars.forEach((char, index) => {
        gsap.to(char, {
          backgroundSize: '100% 100%',
          ease: 'none',
          scrollTrigger: {
            trigger: cardsSectionRef.current,
            start: `top+=${delay * 100}% center`,
            end: `top+=${delay * 100 + 20}% center`,
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const charProgress = (progress * totalChars) - index;
              const clampedProgress = Math.max(0, Math.min(1, charProgress));
              gsap.set(char, { backgroundSize: `${clampedProgress * 100}% 100%` });
            }
          }
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (cardsSectionRef.current) {
      nextSectionRef.current = cardsSectionRef.current.nextElementSibling as HTMLElement;
      if (nextSectionRef.current) {
        nextSectionRef.current.style.transform = 'translateY(50px)';
        nextSectionRef.current.style.transition = 'transform 0.6s ease-out';
      }
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardsSectionRef.current) {
      observer.observe(cardsSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ticking = false;
    const titleStates = new Map<HTMLElement, boolean>();

    // Easing functions for smooth professional animation
    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
    const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeInOutQuad = (t: number): number => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!cardsSectionRef.current || !nextSectionRef.current) {
            ticking = false;
            return;
          }
          
          const nextSectionRect = nextSectionRef.current.getBoundingClientRect();
          const nextSectionProgress = Math.max(0, Math.min(1, (window.innerHeight - nextSectionRect.top) / window.innerHeight));
          
          const sectionRect = cardsSectionRef.current.getBoundingClientRect();
          const sectionProgress = Math.max(0, Math.min(1, -sectionRect.top / (sectionRect.height - window.innerHeight)));

          const cards = [
            { ref: card1Ref, start: 0, end: 0.33 },
            { ref: card2Ref, start: 0.33, end: 0.66 },
            { ref: card3Ref, start: 0.66, end: 1 },
          ];

          cards.forEach(({ ref, start, end }, index) => {
            if (!ref.current) return;
            
            const cardTitle = ref.current.querySelector(`.${styles.cardTitle}`) as HTMLElement;
            
            // Animate card titles only on large screens
            if (window.innerWidth > 1150) {
              // Animate card 1 title when card 2 enters
              if (index === 0 && cardTitle) {
                const card2Progress = Math.max(0, Math.min(1, (sectionProgress - cards[1].start) / (cards[1].end - cards[1].start)));
                const currentState = titleStates.get(cardTitle);
                
                if (card2Progress > 0.5 && currentState !== true) {
                  cardTitle.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease-out';
                  cardTitle.style.transform = 'rotate(-90deg) translate(-260px, -45px)';
                  cardTitle.style.opacity = '0.3';
                  titleStates.set(cardTitle, true);
                } else if (card2Progress <= 0.45 && currentState !== false) {
                  cardTitle.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease-out';
                  cardTitle.style.transform = 'rotate(0deg) translate(0, 0)';
                  cardTitle.style.opacity = '1';
                  titleStates.set(cardTitle, false);
                }
              }
              
              // Animate card 2 title based on scroll progress
              if (cardTitle && index === 1) {
                const earlyTrigger = Math.max(0, (sectionProgress - 0.75) / 0.25);
                const currentState = titleStates.get(cardTitle);
                
                if (earlyTrigger > 0.5 && currentState !== true) {
                  cardTitle.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease-out';
                  cardTitle.style.transform = 'rotate(-90deg) translate(-260px, -48px)';
                  cardTitle.style.opacity = '0.3';
                  titleStates.set(cardTitle, true);
                } else if (earlyTrigger <= 0.45 && currentState !== false) {
                  cardTitle.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease-out';
                  cardTitle.style.transform = 'rotate(0deg) translate(0, 0)';
                  cardTitle.style.opacity = '1';
                  titleStates.set(cardTitle, false);
                }
              }
            } else {
              // Reset title animation on small screens
              if (cardTitle) {
                cardTitle.style.transform = 'none';
                cardTitle.style.opacity = '1';
              }
            }
            
            // Skip animation for card 1 - keep it in place
            if (index === 0) {
              ref.current.style.transform = `translate(-50%, -50%)`;
              ref.current.style.filter = `blur(0px)`;
              return;
            }
            
            // حساب تقدم الأنيميشن للكارت الحالي (من 0 إلى 1)
            // rawProgress: القيمة الخام بناءً على موقع السكرول
            const rawProgress = Math.max(0, Math.min(1, (sectionProgress - start) / (end - start)));
            // cardProgress: القيمة بعد تطبيق easing function لجعل الحركة أكثر سلاسة
            const cardProgress = easeOutCubic(rawProgress);

            // أنيميشن للشاشات الكبيرة (أكبر من 1150px)
            if (window.innerWidth > 1150) {
              // حساب translateX: يبدأ من 100 (خارج الشاشة يميناً) وينتهي عند 0 (في المركز)
              // مثال: عندما cardProgress = 0 → translateX = 100
              //       عندما cardProgress = 0.5 → translateX = 50
              //       عندما cardProgress = 1 → translateX = 0
              // الكارت الثالث له قيمة مختلفة (92) والكارت الثاني (96)
              const translateX = 100 - cardProgress * (index === 2 ? 90 : 95);
              
              // حساب scale: يبدأ من 0.95 وينتهي عند 1 (الحجم الكامل)
              const scale = 0.95 + cardProgress * 0.05;
              
              // حساب blur: يبدأ من 8px وينتهي عند 0px (واضح تماماً)
              let blur = (1 - cardProgress) * 8;
              
              // تقليل blur للكارت الثالث عند بداية السيكشن التالي
              if (index === 2 && nextSectionProgress > 0) {
                blur = nextSectionProgress * 2;
              }
              
              // تطبيق التحويلات: المركز (-50%, -50%) + الحركة الأفقية (translateX) + التكبير (scale)
              ref.current.style.transform = `translate(-50%, -50%) translateX(${translateX}vw) scale(${scale})`;
              ref.current.style.filter = `blur(${blur}px)`;
            } else {
              // أنيميشن للشاشات الصغيرة (أصغر من أو يساوي 1150px)
              // Stacked cards عمودياً - نفس أنيميشن الديسكتوب لكن بـ translateY
              const translateY = 100 - cardProgress * (index === 2 ? 90 : 95);
              const scale = 0.95 + cardProgress * 0.05;
              let blur = (1 - cardProgress) * 8;
              
              if (index === 2 && nextSectionProgress > 0) {
                blur = nextSectionProgress * 2;
              }
              
              ref.current.style.transform = `translate(-50%, -50%) translateY(${translateY}vh) scale(${scale})`;
              ref.current.style.filter = `blur(${blur}px)`;
            }
          });

          if (cardsWrapperRef.current && nextSectionProgress > 0) {
            const easedProgress = easeInOutCubic(nextSectionProgress);
            const scale = 1 - (easedProgress * 0.07);
            const translateY = easedProgress * 300;
            cardsWrapperRef.current.style.transform = `translateY(${translateY}px) scale(${scale})`;
            cardsWrapperRef.current.style.opacity = `${1 - easedProgress * 0.5}`;
          } else if (cardsWrapperRef.current) {
            cardsWrapperRef.current.style.transform = 'translateY(0) scale(1)';
            cardsWrapperRef.current.style.opacity = '1';
          }

          // أنيميشن ناعم لظهور السيكشن التالي
          if (nextSectionRef.current) {
            if (nextSectionProgress > 0) {
              const easedProgress = easeInOutCubic(nextSectionProgress);
              nextSectionRef.current.style.transform = `translateY(${(1 - easedProgress) * 50}px)`;
            } else {
              nextSectionRef.current.style.transform = 'translateY(50px)';
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={cardsSectionRef} className={styles.cardsSection}>
      <div ref={cardsWrapperRef} className={styles.cardsWrapper}>
      <div className={styles.snapContainer}>
        <div className={styles.snapPoint}>
          <div ref={card1Ref} className={`${styles.card} ${styles.card1}`}>
            <div className={styles.cardContent}>
              <div className={styles.cardText}>
                <h3 ref={title1Ref} className={styles.cardTitle}>{renderChars('Development')}</h3>
                <p className={styles.cardDescription}>
                  Transform your development workflow with intelligent automation. Our AI-driven platform analyzes your code, suggests optimizations, and automates repetitive tasks, allowing your team to focus on innovation and creative problem-solving.
                </p>
              </div>
              <div className={styles.cardImage}>
                <div className={styles.cardIcon}>
                  <Image src="/hosting.svg" alt="Development" width={300} height={300} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.snapPoint}>
          <div ref={card2Ref} className={`${styles.card} ${styles.card2}`}>
            <div className={styles.cardContent}>
              <div className={styles.cardText}>
                <h3 ref={title2Ref} className={styles.cardTitle}>{renderChars('Integration')}</h3>
                <p className={styles.cardDescription}>
                  Integrate effortlessly with your existing tools and workflows. Our platform connects with popular development environments, version control systems, and CI/CD pipelines, ensuring a smooth transition without disrupting your current processes.
                </p>
              </div>
              <div className={styles.cardImage}>
                <div className={styles.cardIcon}>
                  <Image src="/hosting.svg" alt="Integration" width={300} height={300} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.snapPoint}>
          <div ref={card3Ref} className={`${styles.card} ${styles.card3}`}>
            <div className={styles.cardContent}>
              <div className={styles.cardText}>
                <h3 ref={title3Ref} className={styles.cardTitle}>{renderChars('Collaboration')}</h3>
                <p className={styles.cardDescription}>
                  Empower your team with advanced collaboration features. Share insights, review code together in real-time, and maintain consistent quality standards across all projects. Built-in communication tools keep everyone aligned and productive.
                </p>
              </div>
              <div className={styles.cardImage}>
                <div className={styles.cardIcon}>
                  <Image src="/hosting.svg" alt="Collaboration" width={300} height={300} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default CardsSection;
