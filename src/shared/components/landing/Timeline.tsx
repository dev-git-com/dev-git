"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import styles from "../../css/landing/timeline-cards.module.css";
import "swiper/css";
import "swiper/css/free-mode";
import clsx from "clsx";

// Type definitions
interface CardItem {
  id: number;
  text: string;
  type: "note" | "feature" | "bug" | "enhancement" | "community";
}

interface Card {
  id: number;
  title: string;
  items: CardItem[];
}

interface Avatar {
  id: number;
  src: string;
  name: string;
}

interface TeamData {
  title: string;
  subtitle: string;
  avatars: Avatar[];
  progress: {
    version: string;
    percentage: number;
    month: string;
  };
}

// Sample data for timeline cards
const cardsData: Card[] = [
  {
    id: 1,
    title: "January",
    items: [
      { id: 1, text: "List of features that are currently in open beta and will soon go live", type: "note" },
      { id: 2, text: "Fully updated alternation engine for drizzle-kit. This change also increased drizzle-kit tests from 600 to 3000+ so far and is growing", type: "feature" },
      { id: 3, text: "MSSQL Support", type: "feature" },
      { id: 4, text: "CockroachDB Support", type: "feature" },
    ],
  },
  {
    id: 2,
    title: "February",
    items: [
      { id: 5, text: "Fixed saving bug in json cell editor.", type: "bug" },
      { id: 6, text: "Fixed resizing of columns in Safari browser.", type: "bug" },
      { id: 7, text: "Fixed a bug where FK constraints were not displayed if CHECK constraints existed.", type: "bug" },
    ],
  },
  {
    id: 3,
    title: "March",
    items: [
      { id: 8, text: "Error handling improvements", type: "enhancement" },
      { id: 9, text: "Performance optimizations for large datasets", type: "enhancement" },
      { id: 10, text: "New migration system with rollback support", type: "feature" },
    ],
  },
  {
    id: 4,
    title: "April",
    items: [
      { id: 11, text: "TypeScript strict mode compatibility", type: "community" },
      { id: 12, text: "Documentation improvements and examples", type: "community" },
      { id: 13, text: "New adapter for Planetscale", type: "community" },
    ],
  },
  {
    id: 5,
    title: "May",
    items: [
      { id: 14, text: "TypeScript strict mode compatibility", type: "community" },
      { id: 15, text: "Documentation improvements and examples", type: "community" },
      { id: 16, text: "New adapter for Planetscale", type: "community" },
    ],
  },
  {
    id: 6,
    title: "This month",
    items: [
      { id: 17, text: "TypeScript strict mode compatibility", type: "community" },
      { id: 18, text: "Documentation improvements and examples", type: "community" },
      { id: 19, text: "New adapter for Planetscale", type: "community" },
    ],
  },
];

// Team and progress data
const teamData: TeamData = {
  title: "We ship decently fast",
  subtitle: "Drizzle Team and Active Contributors",
  avatars: [
    { id: 1, src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80", name: "John" },
    { id: 3, src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80", name: "Mike" },
    { id: 4, src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80", name: "Emma" },
    { id: 5, src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80", name: "Alex" },
    { id: 6, src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80", name: "Lisa" },
  ],
  progress: {
    version: "v3.0 release",
    percentage: 75,
    month: "This month",
  },
};

// Swiper configuration
const swiperConfig = {
  modules: [FreeMode, Mousewheel],
  slidesPerView: "auto" as const,
  freeMode: true,
  mousewheel: {
    forceToAxis: true,
    sensitivity: 1,
    releaseOnEdges: true,
  },
  grabCursor: true,
};

export default function TimelineCards() {
  return (
    <div className={`${styles.timelineContainer} sectionContainer`}>
      {/* Header Section with Team Info and Progress */}
      <HeaderSection />

      {/* Timeline Cards Section with Swiper */}
      <TimelineSection />
    </div>
  );
}

// Header component containing team info and progress bar
function HeaderSection() {
  return (
    <div className={styles.headerSection}>
      <div className={styles.headerContent}>
        <h1 className={clsx(styles.mainTitle, "title")}>{teamData.title}</h1>
        <p className={styles.subtitle}>{teamData.subtitle}</p>

        {/* Team avatars with stacking effect */}
        <div className={styles.avatarsContainer}>
          {teamData.avatars.map((avatar, index) => (
            <div
              key={avatar.id}
              className={styles.avatar}
              style={{ zIndex: teamData.avatars.length - index }}
            >
              <img src={avatar.src} alt={avatar.name} />
            </div>
          ))}
        </div>
      </div>

      {/* Progress section with version and percentage */}
      <ProgressSection />
    </div>
  );
}

// Progress component showing version and completion percentage
function ProgressSection() {
  return (
    <div className={styles.progressSection}>
      <div className={styles.progressInfo}>
        <span className={styles.versionText}>
          {teamData.progress.version}
        </span>
        <span className={styles.percentageText}>
          {teamData.progress.percentage}%
        </span>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${teamData.progress.percentage}%` }}
        />
      </div>
      <p className={styles.monthText}>{teamData.progress.month}</p>
    </div>
  );
}

// Timeline section with swipeable cards
function TimelineSection() {
  return (
    <div className={styles.cardsSection}>
      <Swiper {...swiperConfig} className={styles.cardsSwiper}>
        {cardsData.map((card) => (
          <SwiperSlide key={card.id} className={styles.cardSlide}>
            <TimelineCard card={card} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Gradient masks for edge fade effect */}
      <div className={styles.gradientMaskLeft} />
      <div className={styles.gradientMaskRight} />
    </div>
  );
}

// Individual timeline card component
function TimelineCard({ card }: { card: Card }) {
  return (
    <>
      <h3 className={clsx(styles.cardTitle, "title")}>{card.title}</h3>
      <div className={styles.card}>
        <div className={styles.cardItems}>
          {card.items.map((item) => (
            <CardItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}

// Individual card item component
function CardItem({ item }: { item: CardItem }) {
  return (
    <div className={styles.cardItem}>
      <div className={styles.itemContent}>
        <p>{item.text}</p>
        <span className={styles.itemType}>{item.type}</span>
      </div>
    </div>
  );
}