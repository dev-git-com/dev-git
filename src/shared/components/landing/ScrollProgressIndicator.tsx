'use client';

import { useEffect, useState } from 'react';
import styles from '@/shared/css/landing/ScrollProgressIndicator.module.css';

const ScrollProgressIndicator = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.track}>
        <div className={styles.progress} style={{ height: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ScrollProgressIndicator;
