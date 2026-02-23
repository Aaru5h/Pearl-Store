"use client";

import { motion } from "framer-motion";
import styles from "./Hero.module.css";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className={styles.heroSection}>
            <div className={`lofi-container ${styles.heroContent}`}>
                <motion.div
                    className={styles.textContent}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        className={styles.badge}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className={styles.badgeDot}></span>
                        New Arrivals 2026
                    </motion.div>

                    <h1 className={styles.title}>
                        Curated comfort. <br />
                        <span className={styles.highlight}>Professional grade.</span>
                    </h1>

                    <p className={styles.subtitle}>
                        Transform your space with our milky pastel bento collection. Intentionally designed to blend cozy aesthetics with uncompromising quality.
                    </p>

                    <div className={styles.actions}>
                        <motion.button
                            className={styles.primaryBtn}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Shop Collection <ArrowRight size={18} />
                        </motion.button>
                        <motion.button
                            className={styles.secondaryBtn}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Explore Story
                        </motion.button>
                    </div>
                </motion.div>

                <div className={styles.visualContent}>
                    <motion.div
                        className={`${styles.bentoImg1} bento-card`}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    />
                    <motion.div
                        className={`${styles.bentoImg2} bento-card`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    />
                    <motion.div
                        className={`${styles.bentoImg3} bento-card`}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                    />
                </div>
            </div>
        </section>
    );
}
