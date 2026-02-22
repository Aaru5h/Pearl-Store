"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Menu, Heart } from "lucide-react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
    return (
        <motion.nav
            className={styles.navbar}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            <div className={`lofi-container ${styles.navContent}`}>
                <div className={styles.menuIcon}>
                    <Menu size={24} color="var(--color-text)" />
                </div>

                <Link href="/" className={styles.logo}>
                    Pearl Store
                </Link>

                <div className={styles.actions}>
                    <button className={styles.iconBtn}>
                        <Heart size={22} color="var(--color-primary)" />
                    </button>
                    <button className={styles.iconBtn}>
                        <ShoppingBag size={22} color="var(--color-text)" />
                        <span className={styles.badge}>2</span>
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}
