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
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
            >
                <div className={styles.navContent}>
                    <div className={styles.menuIcon}>
                        <Menu size={24} color="var(--color-text)" />
                    </div>

                    <Link href="/" className={styles.logo}>
                        Pearl.
                    </Link>

                    <div className={styles.actions}>
                        <button className={styles.iconBtn}>
                            <Heart size={20} color="var(--color-text)" />
                        </button>
                        <button className={styles.iconBtn}>
                            <ShoppingBag size={20} color="var(--color-text)" />
                            <span className={styles.badge}>2</span>
                        </button>
                    </div>
                </div>
            </motion.nav>
        </div>
    );
}
