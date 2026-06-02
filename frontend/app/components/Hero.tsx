"use client";

import { motion } from "framer-motion";
import styles from "./Hero.module.css";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import('./Hero3D'), {
    ssr: false,
    loading: () => <div className={styles.loading3D}><span className={styles.loadingPulse} /></div>
});

const headlineVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.3 }
    }
};

const wordVariants = {
    hidden: { opacity: 0, y: 80, rotateX: 40 },
    visible: {
        opacity: 1, y: 0, rotateX: 0,
        transition: { duration: 1, ease: "easeOut" as const }
    }
};

export default function Hero() {
    return (
        <section className={styles.heroSection}>
            {/* 3D Canvas Background */}
            <div className={styles.canvasContainer}>
                <Hero3D />
            </div>

            {/* Gradient Overlays */}
            <div className={styles.gradientTop} />
            <div className={styles.gradientBottom} />

            {/* Content */}
            <div className={`container ${styles.heroContent}`}>
                <motion.p
                    className={styles.tag}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    Est. 2026 — Premium Lifestyle
                </motion.p>

                <motion.h1
                    className={styles.title}
                    variants={headlineVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.span className={styles.word} variants={wordVariants}>Discover</motion.span>
                    <motion.span className={styles.word} variants={wordVariants}>Your</motion.span>
                    <motion.span className={`${styles.word} ${styles.accentWord}`} variants={wordVariants}>Pearl</motion.span>
                </motion.h1>

                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    Objects crafted with intention. Designed to transform spaces into sanctuaries.
                </motion.p>

                <motion.div
                    className={styles.actions}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.8 }}
                >
                    <motion.a
                        href="#collection"
                        className={styles.primaryBtn}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Explore Collection
                    </motion.a>
                    <motion.a
                        href="#story"
                        className={styles.secondaryBtn}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Our Story
                    </motion.a>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className={styles.scrollIndicator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
            >
                <span className={styles.scrollText}>Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                    <ChevronDown size={16} />
                </motion.div>
            </motion.div>
        </section>
    );
}
