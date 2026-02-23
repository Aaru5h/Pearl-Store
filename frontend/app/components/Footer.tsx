"use client";

import { Heart, Instagram, Twitter, Mail } from "lucide-react";
import styles from "./Footer.module.css";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <section className={styles.footerWrapper}>
            <footer className={styles.footer}>
                <div className={`lofi-container ${styles.footerContent}`}>
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>Pearl.</Link>
                        <p className={styles.tagline}>Curated comfort.<br />Professional grade.</p>

                        <div className={styles.socials}>
                            <a href="#" className={styles.socialBtn}><Instagram size={20} /></a>
                            <a href="#" className={styles.socialBtn}><Twitter size={20} /></a>
                            <a href="#" className={styles.socialBtn}><Mail size={20} /></a>
                        </div>
                    </div>

                    <div className={styles.links}>
                        <div className={styles.linkGroup}>
                            <h4>Explore</h4>
                            <Link href="#">New Arrivals</Link>
                            <Link href="#">Best Sellers</Link>
                            <Link href="#">The Bento Collection</Link>
                            <Link href="#">Gift Cards</Link>
                        </div>
                        <div className={styles.linkGroup}>
                            <h4>Information</h4>
                            <Link href="#">Our Story</Link>
                            <Link href="#">Contact Us</Link>
                            <Link href="#">FAQ & Returns</Link>
                            <Link href="#">Shipping Policy</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <p>&copy; {new Date().getFullYear()} Pearl Store. Designed with <Heart size={14} className={styles.heartIcon} style={{ display: 'inline', verticalAlign: 'middle' }} color="var(--color-primary)" /> for aesthetic comfort.</p>
                </div>
            </footer>
        </section>
    );
}
