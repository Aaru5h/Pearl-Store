"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Menu, Heart } from "lucide-react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
    return (
        <div className={styles.navWrapper}>
            <motion.nav
                className={`${styles.navbar} glass bento-card`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            >
                <div className={styles.navContent}>
                    <motion.div 
                        className={styles.menuIcon}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Menu size={24} color="var(--color-text)" />
                    </motion.div>

                    <Link href="/" className={styles.logo}>
                        Pearl.
                    </Link>

                    <div className={styles.actions}>
                        <motion.button 
                            className={styles.iconBtn}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Heart size={20} color="var(--color-text)" />
                        </motion.button>
                        <motion.button 
                            className={styles.iconBtn}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <ShoppingBag size={20} color="var(--color-text)" />
                            <span className={styles.badge}>2</span>
                        </motion.button>
                    </div>
                </div>
            </motion.nav>
        </div>
    );
}
