'use client';

import { useEffect } from 'react';
import styles from '@/shared/css/landing/PageGridMask.module.css';

const PageGridMask: React.FC = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX + 'px';
      const y = e.clientY + 'px';
      
      document.documentElement.style.setProperty('--mouse-x', x);
      document.documentElement.style.setProperty('--mouse-y', y);
      document.body.style.setProperty('--mouse-x', x);
      document.body.style.setProperty('--mouse-y', y);
    };

    const centerX = window.innerWidth / 2 + 'px';
    const centerY = window.innerHeight / 2 + 'px';
    
    document.documentElement.style.setProperty('--mouse-x', centerX);
    document.documentElement.style.setProperty('--mouse-y', centerY);
    document.body.style.setProperty('--mouse-x', centerX);
    document.body.style.setProperty('--mouse-y', centerY);

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div className={styles.pageGridMask} />;
};

export default PageGridMask;
