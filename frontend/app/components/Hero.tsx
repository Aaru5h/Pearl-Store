"use client";

import { motion } from "framer-motion";
import styles from "./Hero.module.css";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the 3D canvas with SSR disabled to prevent hydration and WebGL context loss bugs.
const Hero3D = dynamic(() => import('./Hero3D'), { 
    ssr: false,
    loading: () => <div className={styles.loading3D}>Loading soft vibes...</div>
});

export default function Hero() {
    return (
        <section className={styles.heroSection}>
            <div className={`lofi-container ${styles.heroContent}`}>
                <motion.div
                    className={styles.textContent}
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                    }}
                >
                    <motion.div
                        className={styles.badge}
                        variants={{
                            hidden: { opacity: 0, scale: 0.8, y: 10 },
                            visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.6 } }
                        }}
                    >
                        <span className={styles.badgeDot}></span>
                        Warm & Aesthetic 2026
                    </motion.div>

                    <motion.h1 
                        className={styles.title}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                        }}
                    >
                        Warm aesthetics. <br />
                        <span className={styles.highlight}>Endless comfort.</span>
                    </motion.h1>

                    <motion.p 
                        className={styles.subtitle}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        Transform your space with our premium soft bento collection. Intentionally designed to blend cute details with eye-soothing, uncompromising quality.
                    </motion.p>

                    <motion.div 
                        className={styles.actions}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                         <motion.button
                            className={styles.primaryBtn}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            Shop Collection <ArrowRight size={18} />
                        </motion.button>
                        <motion.button
                            className={styles.secondaryBtn}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            Explore Story
                        </motion.button>
                    </motion.div>
                </motion.div>

                <div className={styles.visualContent}>
                    <Hero3D />
                </div>
            </div>
        </section>
    );
}
