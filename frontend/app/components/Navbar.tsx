"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Menu as MenuIcon } from "lucide-react";
import Link from "next/link";
import styles from "./Navbar.module.css";

const navLinks = [
    { label: "Collection", href: "#collection" },
    { label: "Story", href: "#story" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <motion.nav
                className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className={`container ${styles.navContent}`}>
                    <Link href="/" className={styles.logo}>
                        PEARL
                    </Link>

                    <div className={styles.navLinks}>
                        {navLinks.map((link) => (
                            <a key={link.label} href={link.href} className={styles.navLink}>
                                {link.label}
                                <span className={styles.linkUnderline} />
                            </a>
                        ))}
                    </div>

                    <div className={styles.actions}>
                        <motion.button
                            className={styles.cartBtn}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ShoppingBag size={18} />
                            <span className={styles.cartCount}>2</span>
                        </motion.button>

                        <button
                            className={styles.menuToggle}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X size={20} /> : <MenuIcon size={20} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className={styles.mobileMenu}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {navLinks.map((link, i) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                className={styles.mobileLink}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
