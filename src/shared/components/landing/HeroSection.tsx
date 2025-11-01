"use client";

import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "../../css/landing/HeroSection.module.css";
import { FaPlay, FaTimes } from "react-icons/fa";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

// Animation configuration interface
interface AnimationConfig {
  centerWord: { y: number; x: number };
  scales: {
    develop: { show: number; hide: number };
    devgit: { show: number; hold: number; hide: number };
    devgenerate: { show: number; hold: number; hide: number };
  };
  timing: {
    centerMove: number;
    textFade: number;
    buttonHide?: number;
    buttonReposition?: number;
    buttonMove?: number;
    develop: { show: number; hide: number };
    devgit: {
      visible: number;
      show: number;
      hold?: number;
      hide: number;
      hidden?: number;
    };
    devgenerate: {
      visible: number;
      show: number;
      hold?: number;
      hide: number;
      hidden?: number;
    };
  };
  scroll: { end: string; scrub: number | boolean };
}

// Responsive breakpoints
const BREAKPOINTS = {
  MOBILE: "(max-width: 768px)",
  TABLET: "(min-width: 769px) and (max-width: 1047px)",
  DESKTOP: "(min-width: 1048px)",
};

// Animation configurations for different screen sizes
const ANIMATION_CONFIGS = {
  MOBILE: {
    centerWord: { y: 100, x: 0 },
    scales: {
      develop: { show: 1.4, hide: 1.6 },
      devgit: { show: 1.4, hold: 1.5, hide: 1.7 },
      devgenerate: { show: 1.3, hold: 1.4, hide: 1.6 },
    },
    timing: {
      centerMove: 5,
      textFade: 3,
      buttonHide: 6,
      buttonReposition: 8,
      develop: { show: 10, hide: 25 },
      devgit: { visible: 28, show: 30, hold: 35, hide: 45, hidden: 48 },
      devgenerate: { visible: 50, show: 52, hold: 57, hide: 67, hidden: 70 },
    },
    scroll: { end: "+=1200vh", scrub: 8 },
  },

  TABLET: {
    centerWord: { y: 50, x: 0 },
    scales: {
      develop: { show: 1.7, hide: 2.4 },
      devgit: { show: 1.8, hold: 1.8, hide: 2.4 },
      devgenerate: { show: 1.7, hold: 1.7, hide: 2.2 },
    },
    timing: {
      centerMove: 4.5,
      textFade: 1.2,
      buttonMove: 7.0,
      develop: { show: 5.5, hide: 25 },
      devgit: { visible: 35, show: 39, hide: 48 },
      devgenerate: { visible: 15, show: 27.5, hide: 37 },
    },
    scroll: { end: "+=500%", scrub: 2.5 },
  },

  DESKTOP: {
    centerWord: { y: 60, x: -55 },
    scales: {
      develop: { show: 1.9, hide: 2.8 },
      devgit: { show: 2, hold: 2, hide: 2.8 },
      devgenerate: { show: 2, hold: 2, hide: 2.8 },
    },
    timing: {
      centerMove: 8.0,
      textFade: 2.0,
      buttonMove: 12.0,
      develop: { show: 9.5, hide: 40 },
      devgit: { visible: 25, show: 43.5, hide: 56 },
      devgenerate: { visible: 58, show: 62, hide: 75 },
    },
    scroll: { end: "+=600%", scrub: 2.5 },
  },
} as const;

const HeroSection: React.FC = () => {
  // Element references
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  // Title word references
  const word1Ref = useRef<HTMLSpanElement>(null);
  const word2Ref = useRef<HTMLSpanElement>(null);
  const word4Ref = useRef<HTMLSpanElement>(null);
  const word5Ref = useRef<HTMLSpanElement>(null);
  const centerWordRef = useRef<HTMLSpanElement>(null);

  // Changing word references
  const developRef = useRef<HTMLSpanElement>(null);
  const devgitRef = useRef<HTMLSpanElement>(null);
  const devgenerateRef = useRef<HTMLSpanElement>(null);

  // Component state
  const [showVideo, setShowVideo] = useState(false);
  const matchMediaRef = useRef<gsap.MatchMedia | null>(null);

  // Description content
  const description = {
    text: "Build next-generation applications using advanced frameworks and ",
    highlight: "powerful integrations ",
    suffix: "for maximum efficiency.",
  };

  // Reset all elements to initial state
  const resetElements = () => {
    const titleWords = [
      word1Ref.current,
      word2Ref.current,
      word4Ref.current,
      word5Ref.current,
    ];
    const changingWords = [devgitRef.current, devgenerateRef.current];

    gsap.set([...titleWords, descriptionRef.current], {
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
    });

    gsap.set(centerWordRef.current, { y: 0, x: 0 });
    gsap.set(developRef.current, { scale: 1, opacity: 1 });
    gsap.set(changingWords, { scale: 0, opacity: 0, visibility: "hidden" });
    gsap.set(buttonContainerRef.current, {
      position: "relative",
      transform: "none",
      scale: 1,
      x: 0,
      y: 0,
    });
  };

  // Reset button to original position
  const resetButtonPosition = () => {
    gsap.set(buttonContainerRef.current, {
      position: "relative",
      top: "auto",
      right: "auto",
      transform: "none",
      zIndex: "auto",
      opacity: 1,
      scale: 1,
    });
  };

  // Add mobile changing words animation to timeline
  const addMobileChangingWords = (
    timeline: gsap.core.Timeline,
    config: AnimationConfig
  ) => {
    const { scales } = config;

    // Develop word animation
    timeline
      .to(
        developRef.current,
        {
          scale: scales.develop.show,
          opacity: 1,
          duration: 6,
          ease: "power2.out",
        },
        8
      )
      .to(
        developRef.current,
        {
          scale: scales.develop.hide,
          opacity: 0,
          duration: 4,
          ease: "power2.out",
        },
        18
      );

    // DevGit word animation
    timeline
      .set(devgitRef.current, { visibility: "visible" }, 22)
      .fromTo(
        devgitRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: scales.devgit.show,
          duration: 4,
          ease: "power1.out",
        },
        22
      )
      .to(
        devgitRef.current,
        {
          scale: scales.devgit.hold,
          duration: 6,
          ease: "power1.out",
        },
        26
      )
      .to(
        devgitRef.current,
        {
          scale: scales.devgit.hide,
          opacity: 0,
          duration: 4,
          ease: "power1.out",
        },
        35
      )
      .set(devgitRef.current, { visibility: "hidden" }, 39);

    // DevGenerate word animation
    timeline
      .set(devgenerateRef.current, { visibility: "visible" }, 40)
      .fromTo(
        devgenerateRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: scales.devgenerate.show,
          duration: 4,
          ease: "power1.out",
        },
        40
      )
      .to(
        devgenerateRef.current,
        {
          scale: scales.devgenerate.hold,
          duration: 6,
          ease: "power1.out",
        },
        44
      )
      .to(
        devgenerateRef.current,
        {
          scale: scales.devgenerate.hide,
          opacity: 0,
          duration: 4,
          ease: "power1.out",
        },
        53
      )
      .set(devgenerateRef.current, { visibility: "hidden" }, 57);

    return timeline;
  };

  // Add changing words animation to timeline for tablet/desktop
  const addChangingWordsToTimeline = (
    timeline: gsap.core.Timeline,
    config: AnimationConfig
  ) => {
    const { scales, timing } = config;

    // Develop word animation
    timeline
      .to(
        developRef.current,
        {
          scale: scales.develop.show,
          opacity: 1,
          duration: 4,
          ease: "power2.out",
        },
        timing.develop.show
      )
      .to(
        developRef.current,
        {
          scale: scales.develop.hide,
          opacity: 0,
          duration: 2.5,
          ease: "power2.out",
        },
        timing.develop.hide
      );

    // DevGit word animation
    timeline
      .set(devgitRef.current, { visibility: "visible" }, timing.devgit.visible)
      .fromTo(
        devgitRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: scales.devgit.show,
          duration: 2,
          ease: "power1.out",
        },
        timing.devgit.show
      );

    if (scales.devgit.hold) {
      timeline.to(
        devgitRef.current,
        {
          scale: scales.devgit.hold,
          duration: 7,
          ease: "power1.out",
        },
        timing.devgit.show + 2
      );
    }

    timeline.to(
      devgitRef.current,
      {
        scale: scales.devgit.hide,
        opacity: 0,
        duration: 2.5,
        ease: "power1.out",
      },
      timing.devgit.hide
    );

    if (timing.devgit.hidden) {
      timeline.set(
        devgitRef.current,
        { visibility: "hidden" },
        timing.devgit.hidden
      );
    }

    // DevGenerate word animation
    timeline
      .set(
        devgenerateRef.current,
        { visibility: "visible" },
        timing.devgenerate.visible
      )
      .fromTo(
        devgenerateRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: scales.devgenerate.show,
          duration: 2,
          ease: "power1.out",
        },
        timing.devgenerate.show
      );

    if (scales.devgenerate.hold) {
      timeline.to(
        devgenerateRef.current,
        {
          scale: scales.devgenerate.hold,
          duration: 7,
          ease: "power1.out",
        },
        timing.devgenerate.show + 2
      );
    }

    timeline.to(
      devgenerateRef.current,
      {
        scale: scales.devgenerate.hide,
        opacity: 0,
        duration: 2.5,
        ease: "power1.out",
      },
      timing.devgenerate.hide
    );

    if (timing.devgenerate.hidden) {
      timeline.set(
        devgenerateRef.current,
        { visibility: "hidden" },
        timing.devgenerate.hidden
      );
    }

    return timeline;
  };

  // Create mobile-specific timeline with repositioned button
  const createMobileTimeline = (config: AnimationConfig) => {
    const timeline = gsap.timeline({ paused: true });
    const titleWords = [
      word1Ref.current,
      word2Ref.current,
      word4Ref.current,
      word5Ref.current,
    ];

    // Initial animations - center word movement and text fade
    timeline
      .to(
        centerWordRef.current,
        {
          y: config.centerWord.y,
          x: config.centerWord.x,
          duration: 4,
          ease: "power2.out",
        },
        0
      )
      .to(
        [...titleWords, descriptionRef.current],
        {
          scale: 0.5,
          opacity: 0,
          duration: 3,
          ease: "power1.out",
        },
        2
      );

    // Button repositioning animation
    timeline
      .to(
        buttonContainerRef.current,
        {
          opacity: 0,
          scale: 0.8,
          duration: 2,
          ease: "power1.in",
        },
        4
      )
      .set(
        buttonContainerRef.current,
        {
          position: "fixed",
          top: "20px",
          right: "20px",
          transform: "none",
          zIndex: 1000,
          scale: 0.7,
        },
        6
      )
      .to(
        buttonContainerRef.current,
        {
          opacity: 1,
          scale: 0.8,
          duration: 2,
          ease: "power1.out",
        },
        6
      );

    // Changing words animations
    addMobileChangingWords(timeline, config);

    return timeline;
  };

  // Create responsive timeline for tablet and desktop
  const createResponsiveTimeline = (config: AnimationConfig) => {
    const timeline = gsap.timeline({ paused: true });
    const titleWords = [
      word1Ref.current,
      word2Ref.current,
      word4Ref.current,
      word5Ref.current,
    ];

    // Initial animations
    timeline
      .to(
        centerWordRef.current,
        {
          y: config.centerWord.y,
          x: config.centerWord.x,
          duration: 2,
          ease: "power2.out",
        },
        config.timing.centerMove
      )
      .to(
        [...titleWords, descriptionRef.current],
        {
          scale: 0.5,
          opacity: 0,
          duration: config.timing.textFade === 1.5 ? 2 : 5,
          ease: "power1.out",
        },
        config.timing.textFade
      );

    // Button animation for non-mobile devices
    if (config.timing.buttonMove) {
      const buttonMoveDuration = 6;
      const startTime = config.timing.buttonMove;

      timeline
        .to(
          buttonContainerRef.current,
          {
            opacity: 0,
            scale: 0.8,
            duration: buttonMoveDuration * 0.6,
            ease: "power1.in",
          },
          startTime
        )
        .set(
          buttonContainerRef.current,
          {
            position: "fixed",
            top: "20px",
            right: "-20px",
            transform: "none",
            zIndex: 1000,
            scale: 0.6,
          },
          startTime + buttonMoveDuration * 0.6
        )
        .to(
          buttonContainerRef.current,
          {
            opacity: 1,
            scale: 0.8,
            duration: buttonMoveDuration * 0.7,
            ease: "power1.out",
          },
          startTime + buttonMoveDuration * 0.6
        );
    }

    return addChangingWordsToTimeline(timeline, config);
  };

  // Clean up ScrollTrigger instances
  const cleanupScrollTrigger = () => {
    if (matchMediaRef.current) {
      matchMediaRef.current.kill();
    }

    ScrollTrigger.getAll().forEach((trigger) => {
      if (
        trigger.vars.trigger === containerRef.current ||
        (trigger.vars.id && trigger.vars.id.startsWith("hero-"))
      ) {
        trigger.kill();
      }
    });
  };

  // Setup responsive animations
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    cleanupScrollTrigger();

    const mm = gsap.matchMedia();
    matchMediaRef.current = mm;

    // Setup animations for each breakpoint
    Object.entries(BREAKPOINTS).forEach(([device, query]) => {
      mm.add(query, () => {
        resetElements();

        const config =
          ANIMATION_CONFIGS[device as keyof typeof ANIMATION_CONFIGS];
        const timeline =
          device === "MOBILE"
            ? createMobileTimeline(config)
            : createResponsiveTimeline(config);

        const scrollTrigger = ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: config.scroll.end,
          pin: true,
          scrub: config.scroll.scrub,
          animation: timeline,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: device === "MOBILE" ? 1 : 0,
          id: `hero-${device.toLowerCase()}`,
          ...(device === "MOBILE" && {
            onToggle: (self) => {
              gsap.set(container, {
                willChange: self.isActive ? "transform" : "auto",
              });
            },
            onUpdate: (self) => {
              if (self.progress > 0.95) {
                gsap.set(container, { willChange: "auto" });
              }
            },
          }),
        });

        return () => {
          scrollTrigger.kill();
          gsap.set(container, { willChange: "auto" });
          resetButtonPosition();
        };
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Video modal handlers
  const handleVideoOpen = () => setShowVideo(true);
  const handleVideoClose = () => setShowVideo(false);

  return (
    <div ref={containerRef} className={`${styles.heroContainer}`}>
      <div className={styles.titleWrapper}>
        {/* Main title with changing words */}
        <h1 ref={titleRef} className={clsx(styles.heroTitle, "title")}>
          <span ref={word1Ref} className={styles.titleWord}>
            AI-Automated
          </span>
          <span ref={word2Ref} className={styles.titleWord}>
            Backend
          </span>

          {/* Center word with changing variations */}
          <span ref={centerWordRef} className={styles.centerWord}>
            <span
              ref={developRef}
              className={`${styles.changingWord} ${styles.develop}`}
            >
              <span className={styles.devPart}>Dev</span>
              <span className={styles.whitePart}>elop</span>
            </span>

            <span
              ref={devgenerateRef}
              className={`${styles.changingWord} ${styles.devgenerate}`}
            >
              <span className={styles.devPart}>Dev </span>
              <span className={styles.orangePart}> g</span>
              <span className={styles.whitePart}>enerate</span>
            </span>

            <span
              ref={devgitRef}
              className={`${styles.changingWord} ${styles.devgit}`}
            >
              <span className={styles.devPart}>Dev</span>
              <span className={styles.whitePart}>-</span>
              <span className={styles.orangePart}>git</span>
            </span>
          </span>

          <span ref={word4Ref} className={styles.titleWord}>
            Everything
          </span>
          <span ref={word5Ref} className={styles.titleWord}>
            Faster
          </span>
        </h1>

        {/* Description text */}
        <p ref={descriptionRef} className={styles.description}>
          {description.text}
          <span className={styles.highlight}>{description.highlight}</span>
          {description.suffix}
        </p>

        {/* Action buttons */}
        <div ref={buttonContainerRef} className={styles.buttonContainer}>
          <Link href="/develop" className={styles.primaryButton}>
            Get Started
          </Link>
          <button
            className={styles.secondaryButton}
            onClick={handleVideoOpen}
            aria-label="Play video"
          >
            <FaPlay className={styles.playIcon} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Video modal */}
      {showVideo && (
        <div className={styles.videoModal}>
          <div className={styles.videoWrapper}>
            <button
              className={styles.closeButton}
              onClick={handleVideoClose}
              aria-label="Close video"
            >
              <FaTimes aria-hidden="true" />
            </button>
            <iframe
              className={styles.video}
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
