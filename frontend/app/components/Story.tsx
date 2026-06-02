"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Story.module.css";

export default function Story() {
    return (
        <section id="story" className={styles.section}>
            <div className={`container ${styles.content}`}>
                <motion.div
                    className={styles.textSide}
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p className={styles.tag}>Our Story</p>
                    <h2 className={styles.title}>
                        We craft objects that transform spaces into{" "}
                        <span className={styles.highlight}>sanctuaries</span>
                    </h2>
                    <p className={styles.description}>
                        Every Pearl piece begins with a question: how can this object make a moment better? 
                        We believe that the things you surround yourself with should be intentional — 
                        designed not just to function, but to bring a quiet sense of joy.
                    </p>
                    <p className={styles.description}>
                        From hand-thrown ceramics to cold-pressed oils, each item in our collection 
                        is sourced with care and crafted to last. This is not fast consumption. 
                        This is slow, considered comfort.
                    </p>

                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>200+</span>
                            <span className={styles.statLabel}>Artisan Partners</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>12</span>
                            <span className={styles.statLabel}>Countries</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>100%</span>
                            <span className={styles.statLabel}>Sustainable</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.imageSide}
                    initial={{ opacity: 0, x: 60, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                >
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/story.png"
                            alt="Pearl Store — curated lifestyle objects on a dark surface"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className={styles.image}
                            priority={false}
                        />
                        <div className={styles.imageGlow} />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
