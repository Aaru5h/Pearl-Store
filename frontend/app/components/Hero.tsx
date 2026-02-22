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
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.span
                        className={styles.badge}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        Latest Collection
                    </motion.span>

                    <motion.h1
                        className="cute-title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Lofi lifestyle, <br />
                        elevated living.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        Discover hand-picked essentials for your space. Premium quality goods designed to bring calm, light, and a chill aesthetic to your everyday routine.
                    </motion.p>

                    <motion.button
                        className={styles.ctaButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        Shop Now <ArrowRight size={18} />
                    </motion.button>
                </motion.div>

                <motion.div
                    className={styles.imageContent}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    {/* We'll use a soft CSS gradient shape as a placeholder for a cute image */}
                    <div className={`${styles.blob} glass`}>
                        <motion.div
                            className={styles.innerImage}
                            animate={{
                                y: [0, -15, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 6,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
