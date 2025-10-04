'use client'
import { useState, useEffect, ReactNode } from 'react'
import styles from '../../css/landing/AnimatedGrid.module.css'

interface AnimatedGridProps {
    children: ReactNode
    className?: string
}

export default function AnimatedGrid({ children, className = "" }: AnimatedGridProps) {
    const [scrollLevel, setScrollLevel] = useState<number>(0)

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight - windowHeight

            const scrollPercentage = Math.min(scrollY / documentHeight, 1)

            let newLevel = 0
            if (scrollPercentage > 0.15) newLevel = 1
            if (scrollPercentage > 0.35) newLevel = 2
            if (scrollPercentage > 0.55) newLevel = 3
            if (scrollPercentage > 0.75) newLevel = 4
            if (scrollPercentage > 0.9) newLevel = 5

            setScrollLevel(newLevel)
        }

        handleScroll()

        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('resize', handleScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleScroll)
        }
    }, [])

    const getScrollClass = () => {
        switch (scrollLevel) {
            case 1: return styles.scrollLevel1
            case 2: return styles.scrollLevel2
            case 3: return styles.scrollLevel3
            case 4: return styles.scrollLevel4
            case 5: return styles.scrollLevel5
            default: return ''
        }
    }

    return (
        <div className={`${styles.backgroundContainer} ${className}`}>
            <div className={`${styles.animatedLines} ${getScrollClass()}`}>
                <div className={`${styles.gridLine} ${styles.gridLineHorizontal} ${styles.horizontal1}`}></div>
                <div className={`${styles.gridLine} ${styles.gridLineHorizontal} ${styles.horizontal2}`}></div>
                <div className={`${styles.gridLine} ${styles.gridLineHorizontal} ${styles.horizontal3}`}></div>
                <div className={`${styles.gridLine} ${styles.gridLineHorizontal} ${styles.horizontal4}`}></div>
                <div className={`${styles.gridLine} ${styles.gridLineHorizontal} ${styles.horizontal5}`}></div>
                <div className={`${styles.gridLine} ${styles.gridLineHorizontal} ${styles.horizontal6}`}></div>
                <div className={`${styles.gridLine} ${styles.gridLineHorizontal} ${styles.horizontal7}`}></div>

                <div className={`${styles.gridLine} ${styles.gridLineVertical} ${styles.vertical1}`}></div>
                <div className={`${styles.gridLine} ${styles.gridLineVertical} ${styles.vertical2}`}></div>
                <div className={`${styles.gridLine} ${styles.gridLineVertical} ${styles.vertical3}`}></div>

                <div className={`${styles.gridLine} ${styles.gridLineDiagonal} ${styles.diagonal1}`}></div>
                <div className={`${styles.gridLine} ${styles.gridLineDiagonal} ${styles.diagonal2}`}></div>

                <div className={`${styles.gridLine} ${styles.newHorizontalLine}`}></div>
                <div className={`${styles.gridLine} ${styles.newVerticalLine}`}></div>
            </div>

            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}