import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from '@/shared/css/landing/TestimonialCard.module.css';
import { Testimonial } from '@/types/Testimonial';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);
  // دالة لتحويل @ mentions إلى روابط زرقاء
  const renderContent = (content: string) => {
    const parts = content.split(/(@\w+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className={styles.mention}>
            {part}
          </span>
        );
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  return (
    <div ref={cardRef} className={`${styles.card} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={48}
              height={48}
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {testimonial.name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className={styles.userInfo}>
          <h3 className={styles.name}>{testimonial.name}</h3>
          <p className={styles.username}>{testimonial.username}</p>
        </div>
      </div>
      
      <div className={styles.content}>
        <p className={styles.text}>{renderContent(testimonial.content)}</p>
        
        {testimonial.image && (
          <div className={styles.imageContainer}>
            <Image
              src={testimonial.image}
              alt="Testimonial image"
              width={400}
              height={300}
              className={styles.contentImage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialCard;