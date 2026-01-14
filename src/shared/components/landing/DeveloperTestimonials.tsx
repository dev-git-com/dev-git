"use client";

import React, { useEffect, useRef } from 'react';
import styles from '@/shared/css/landing/Developertestimonials.module.css';
import { Testimonial } from '@/types/Testimonial';
import TestimonialCard from './Testimonialcard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface DeveloperTestimonialsProps {
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    username: '@sarahdev',
    avatar: 'https://i.pravatar.cc/150?img=47',
    content: 'dev-git saved me weeks of work! Just uploaded my SQL file and got a complete NestJS backend with TypeORM. This is a game changer for rapid prototyping.',
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    username: '@marcusbuilds',
    avatar: 'https://i.pravatar.cc/150?img=33',
    content: 'Used to spend 3-4 days setting up boilerplate for new projects. With dev-git, I had a production-ready backend in minutes. Absolutely incredible!',
  },
  {
    id: '3',
    name: 'Emily Watson',
    username: '@emilycodes',
    avatar: 'https://i.pravatar.cc/150?img=15',
    content: 'As a solo developer, dev-git is my secret weapon. Upload SQL schema, get full CRUD operations, entities, DTOs, everything. More time for features, less time on setup.',
  },
  {
    id: '4',
    name: 'David Kim',
    username: '@davidkimdev',
    avatar: 'https://i.pravatar.cc/150?img=52',
    content: 'Our startup needed to move fast. dev-git generated our entire backend from database schema. We launched 2 weeks ahead of schedule!',
  },
  {
    id: '5',
    name: 'Alex Thompson',
    username: '@alexthompson',
    avatar: 'https://i.pravatar.cc/150?img=12',
    content: 'The TypeORM integration is flawless. Clean code, proper structure, follows NestJS best practices. It\'s like having a senior developer on the team.',
  },
  {
    id: '6',
    name: 'Priya Patel',
    username: '@priyatech',
    avatar: 'https://i.pravatar.cc/150?img=60',
    content: 'Reduced our backend development time by 80%. Just pass the SQL file and dev-git handles all the heavy lifting. This tool is pure magic!',
  },
  {
    id: '7',
    name: 'James Wilson',
    username: '@jwilsondev',
    avatar: 'https://i.pravatar.cc/150?img=13',
    content: 'Finally, a tool that understands what developers actually need. No more repetitive boilerplate. dev-git lets me focus on business logic.',
  },
  {
    id: '8',
    name: 'Lisa Anderson',
    username: '@lisabuilds',
    avatar: 'https://i.pravatar.cc/150?img=68',
    content: 'Onboarded 3 junior devs last month. dev-git generated consistent, clean backends for all their projects. Perfect for maintaining code standards!',
  },
  {
    id: '9',
    name: 'Ryan Foster',
    username: '@ryanfoster',
    avatar: 'https://i.pravatar.cc/150?img=59',
    content: 'From SQL to fully functional NestJS API in minutes. Controllers, services, repositories, all generated perfectly. This is the future of backend development.',
  },
  {
    id: '10',
    name: 'Nina Kowalski',
    username: '@ninakowalski',
    avatar: 'https://i.pravatar.cc/150?img=8',
    content: 'Been using dev-git for 6 months now. Every new project starts with it. The time savings are unreal. Highly recommend to any NestJS developer!',
  },
];

const DeveloperTestimonials: React.FC<DeveloperTestimonialsProps> = ({
  testimonials = defaultTestimonials,
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

    const container = section.querySelector(`.${styles.container}`);
    
    gsap.set(container, { opacity: 0, y: 100 });

    gsap.to(container, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none',
        markers: false
      }
    });

    const chars = title.querySelectorAll(`.${styles.char}`);
    const totalChars = chars.length;
    
    chars.forEach((char, index) => {
      gsap.to(char, {
        backgroundSize: '100% 100%',
        ease: 'none',
        scrollTrigger: {
          trigger: title,
          start: 'top 90%',
          end: 'top 60%',
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

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const renderChars = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className={styles.char}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <h1 ref={titleRef} className={styles.title}>
          {renderChars('DEVELOPERS LOVE DEV-GIT')}<span> !</span>
        </h1>
        
        <div className={styles.grid}>
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeveloperTestimonials;