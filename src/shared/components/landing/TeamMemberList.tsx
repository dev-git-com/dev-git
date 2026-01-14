'use client';

import React, { useRef, useState, useEffect } from 'react';
import styles from '@/shared/css/landing/TeamMemberList.module.css';
import AnimatedName from '@/shared/components/landing/AnimatedName';
import gsap from 'gsap';

interface TeamMember {
  name: string;
  since: string;
  role: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'AMMAR OMARI',
    since: 'Since 2024',
    role: 'Founder & CTO',
    image: '/images/Ammar.png',
  },
  {
    name: 'SAJA JAMEEL',
    since: 'Since 2024',
    role: 'Frontend Developer',
    image: '/images/Saja.png',
  },
];

export default function TeamMemberList() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInsideSection = useRef(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const wasInside = isInsideSection.current;
        isInsideSection.current = !(e.clientY < rect.top || e.clientY > rect.bottom || 
                                    e.clientX < rect.left || e.clientX > rect.right);
        
        if (wasInside !== isInsideSection.current) {
          imageRefs.current.forEach((img) => {
            if (img) {
              img.style.zIndex = isInsideSection.current ? '10' : '-99999';
              if (!isInsideSection.current) {
                gsap.to(img, { opacity: 0, duration: 0.2 });
              }
            }
          });
          if (!isInsideSection.current) {
            setHoveredIndex(null);
          }
        }
      }
    };

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const mouseInside = mousePos.current.y >= rect.top && mousePos.current.y <= rect.bottom &&
                           mousePos.current.x >= rect.left && mousePos.current.x <= rect.right;
        
        if (!mouseInside) {
          imageRefs.current.forEach((img) => {
            if (img) {
              gsap.killTweensOf(img);
              gsap.to(img, { opacity: 0, duration: 0.15, onComplete: () => {
                img.style.zIndex = '-99999';
              }});
            }
          });
          setHoveredIndex(null);
          isInsideSection.current = false;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleHover = (index: number, isHovered: boolean, isMobile = false, clickX?: number, clickY?: number) => {
    if (!isInsideSection.current && isHovered) return;
    
    setHoveredIndex(isHovered ? index : null);
    
    const img = imageRefs.current[index];
    if (!img) return;

    if (isHovered) {
      imageRefs.current.forEach((otherImg, i) => {
        if (otherImg && i !== index) {
          gsap.killTweensOf(otherImg);
          gsap.to(otherImg, {
            opacity: 0,
            scale: 0.8,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
              otherImg.style.zIndex = '-99999';
            }
          });
        }
      });

      gsap.killTweensOf(img);
      img.style.zIndex = '10';
      if (isMobile && clickX !== undefined && clickY !== undefined) {
        gsap.set(img, { left: clickX, top: clickY });
      } else if (!isMobile) {
        gsap.set(img, { left: mousePos.current.x, top: mousePos.current.y });
      }
      gsap.fromTo(img, 
        { opacity: 0, scale: 0.8, clipPath: 'inset(0% 100% 0% 0%)' },
        {
          opacity: 1,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.5,
          ease: 'power2.out',
        }
      );
    } else {
      gsap.killTweensOf(img);
      gsap.to(img, {
        opacity: 0,
        scale: 0.8,
        clipPath: 'inset(0% 100% 0% 0%)',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          img.style.zIndex = '-99999';
        }
      });
    }
  };

  const handleMouseMove = (index: number, e: React.MouseEvent) => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;
    
    const img = imageRefs.current[index];
    if (!img || hoveredIndex !== index) return;

    gsap.to(img, {
      left: e.clientX,
      top: e.clientY,
      duration: 0.8,
      ease: 'power2.out',
    });
  };

  const handleClick = (index: number, e: React.MouseEvent) => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      e.preventDefault();
      if (hoveredIndex === index) {
        handleHover(index, false, true);
      } else {
        handleHover(index, true, true, e.clientX, e.clientY);
      }
    }
  };

  return (
    <section ref={sectionRef} className={styles.teamSection}>
      {teamMembers.map((member, index) => (
        <div 
          key={index} 
          className={styles.memberRow}
          onMouseEnter={() => handleHover(index, true)}
          onMouseLeave={() => handleHover(index, false)}
          onMouseMove={(e) => handleMouseMove(index, e)}
          onClick={(e) => handleClick(index, e)}
        >
          <div className={styles.since}>{member.since}</div>
          <div className={styles.name}>
            <AnimatedName 
              text={member.name}
              isHovered={hoveredIndex === index}
              isDimmed={hoveredIndex !== null && hoveredIndex !== index}
            />
          </div>
          <div className={styles.role}>{member.role}</div>
          <div
            ref={(el) => { imageRefs.current[index] = el; }}
            className={styles.memberImage}
            style={{
              backgroundImage: `url(${member.image})`,
            }}
          />
        </div>
      ))}
    </section>
  );
}