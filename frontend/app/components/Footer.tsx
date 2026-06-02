"use client";

import { Instagram, Twitter, Mail, ArrowUpRight } from "lucide-react";
import styles from "./Footer.module.css";
import Link from "next/link";
import { motion } from "framer-motion";

const footerLinks = {
    explore: [
        { label: "New Arrivals", href: "#" },
        { label: "Best Sellers", href: "#" },
        { label: "The Collection", href: "#collection" },
        { label: "Gift Cards", href: "#" },
    ],
    info: [
        { label: "Our Story", href: "#story" },
        { label: "Contact Us", href: "#contact" },
        { label: "FAQ & Returns", href: "#" },
        { label: "Shipping", href: "#" },
    ],
};

export default function Footer() {
    return (
        <footer id="contact" className={styles.footer}>
            {/* Massive watermark */}
            <div className={styles.watermark} aria-hidden="true">PEARL</div>

            <div className={`container ${styles.footerContent}`}>
                <div className={styles.topSection}>
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>PEARL</Link>
                        <p className={styles.tagline}>
                            Curated comfort.<br />
                            Intentional living.
                        </p>
                    </div>

                    <div className={styles.newsletter}>
                        <p className={styles.newsletterTitle}>Stay in touch</p>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className={styles.emailInput}
                                aria-label="Email for newsletter"
                            />
                            <button className={styles.submitBtn} aria-label="Subscribe">
                                <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.linksSection}>
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>Explore</h4>
                        {footerLinks.explore.map((link) => (
                            <Link key={link.label} href={link.href} className={styles.footerLink}>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>Information</h4>
                        {footerLinks.info.map((link) => (
                            <Link key={link.label} href={link.href} className={styles.footerLink}>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>Connect</h4>
                        <div className={styles.socials}>
                            <motion.a
                                href="#"
                                className={styles.socialBtn}
                                whileHover={{ y: -3 }}
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </motion.a>
                            <motion.a
                                href="#"
                                className={styles.socialBtn}
                                whileHover={{ y: -3 }}
                                aria-label="Twitter"
                            >
                                <Twitter size={18} />
                            </motion.a>
                            <motion.a
                                href="#"
                                className={styles.socialBtn}
                                whileHover={{ y: -3 }}
                                aria-label="Email"
                            >
                                <Mail size={18} />
                            </motion.a>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Pearl Store. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
