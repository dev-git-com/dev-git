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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleHover = (index: number, isHovered: boolean, isMobile = false, clickX?: number, clickY?: number) => {
    setHoveredIndex(isHovered ? index : null);
    
    // إخفاء جميع الصور أولاً
    imageRefs.current.forEach((img, i) => {
      if (img && i !== index) {
        gsap.to(img, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    });

    const img = imageRefs.current[index];
    if (!img) return;

    if (isHovered) {
      if (isMobile && clickX !== undefined && clickY !== undefined) {
        gsap.set(img, { left: clickX, top: clickY });
      } else if (!isMobile) {
        gsap.set(img, { left: mousePos.current.x, top: mousePos.current.y });
      }
      gsap.to(img, {
        opacity: 1,
        scale: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.6,
        ease: 'power2.out',
      });
    } else {
      gsap.to(img, {
        opacity: 0,
        scale: 0.8,
        clipPath: 'inset(0% 100% 0% 0%)',
        duration: 0.4,
        ease: 'power2.in',
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
    <section className={styles.teamSection}>
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