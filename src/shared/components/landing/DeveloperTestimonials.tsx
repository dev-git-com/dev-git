"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../../css/landing/DeveloperTestimonials.module.css";
import clsx from "clsx";

interface Developer {
  id: number;
  name: string;
  title: string;
  company: string;
  avatar: string;
  testimonial: string;
}

const testimonialsData: Developer[] = [
  {
    id: 1,
    name: "Steve Poole",
    title: "DevRel, Semantic",
    company: "Semantic",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    testimonial:
      "Most CodeGen tools failed us a bit on Java classpath docs, wrong syntax, and broken imports. But their dev experience has outperformed them all, generating accurate unit tests even for complex code.",
  },
  {
    id: 2,
    name: "Bogdan Dolman",
    title: "Director of TV-Co Media Network",
    company: "TV-Co Media Network",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    testimonial:
      "We're delighted to roll out Zencoder's Autonomous Zen feature. Automating key fixes and dependency updates through our CI/CD pipeline means our developers can focus on feature creation, not maintenance.",
  },
  {
    id: 3,
    name: "Kai Katschthaler",
    title: "Senior Solution Architect",
    company: "Enterprise Corp",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    testimonial:
      "Zencoder made building internal APIs effortless. Just describe the API, and it finds the right patterns for writing the script for you. Huge time saver.",
  },
  {
    id: 4,
    name: "Alexey Bychuk",
    title: "Product Community",
    company: "Product Community",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    testimonial:
      "Especially impressed with Zencoder. I spent 2 hours scratching my head against the wall, trying to straight some issues with Cursor. And Zencoder aid it in 10 mins just now!",
  },
  {
    id: 5,
    name: "Zheng Yuan",
    title: "Staff Machine Learning Engineer, PayPal",
    company: "PayPal",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    testimonial:
      "The AI assistant capabilities are impressive. It helps with complex debugging and suggests optimal solutions quickly.",
  },
];

export default function DeveloperTestimonials() {
  const [testimonials] = useState<Developer[]>(testimonialsData);

  return (
    <section className={styles.testimonialsSection}>
      <div className={`${styles.container} sectionContainer`}>
        <div className={styles.header}>
          <p className={styles.thankYou}>THANK YOU</p>
          <h2 className={clsx(styles.title, "title")}>
            Loved By Professional
            <br />
            Developers
          </h2>
        </div>

        <div className={styles.testimonialsGrid}>
          <div className={styles.firstRow}>
            {testimonials.slice(0, 3).map((testimonial) => (
              <div key={testimonial.id} className={styles.testimonialCard}>
                <p className={styles.testimonialText}>
                  &ldquo;{testimonial.testimonial}&rdquo;
                </p>

                <div className={styles.authorInfo}>
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className={styles.avatar}
                    unoptimized
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div className={styles.authorDetails}>
                    <h4 className={styles.authorName}>{testimonial.name}</h4>
                    <p className={clsx(styles.authorTitle, "title")}>
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.secondRow}>
            {testimonials.slice(3, 5).map((testimonial) => (
              <div key={testimonial.id} className={styles.testimonialCard}>
                <p className={styles.testimonialText}>
                  &ldquo;{testimonial.testimonial}&rdquo;
                </p>

                <div className={styles.authorInfo}>
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className={styles.avatar}
                    unoptimized
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div className={styles.authorDetails}>
                    <h4 className={styles.authorName}>{testimonial.name}</h4>
                    <p className={clsx(styles.authorTitle, "title")}>
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
