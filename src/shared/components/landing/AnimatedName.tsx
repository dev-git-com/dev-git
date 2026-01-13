'use client';

import styles from '@/shared/css/landing/AnimatedName.module.css';

interface AnimatedNameProps {
  text: string;
  className?: string;
  isHovered?: boolean;
  isDimmed?: boolean;
}

export default function AnimatedName({ text, className = '', isHovered, isDimmed }: AnimatedNameProps) {
  return (
    <span className={`${styles.animatedName} ${isHovered ? styles.hovered : ''} ${isDimmed ? styles.dimmed : ''} ${className}`}>
      {text}
    </span>
  );
}
