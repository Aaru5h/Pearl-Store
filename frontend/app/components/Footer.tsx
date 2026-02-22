"use client";

import { Heart } from "lucide-react";
import styles from "./Footer.module.css";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`lofi-container ${styles.footerContent}`}>
                <div className={styles.brand}>
                    <Link href="/" className="cute-title">Pearl Store</Link>
                    <p>Lofi essentials for elevated living.</p>
                </div>

                <div className={styles.links}>
                    <div className={styles.linkGroup}>
                        <h4>Shop</h4>
                        <Link href="#">New Arrivals</Link>
                        <Link href="#">Best Sellers</Link>
                        <Link href="#">Lofi Collection</Link>
                    </div>
                    <div className={styles.linkGroup}>
                        <h4>About</h4>
                        <Link href="#">Our Story</Link>
                        <Link href="#">Contact</Link>
                        <Link href="#">FAQ</Link>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <p>&copy; {new Date().getFullYear()} Pearl Store. All rights reserved.</p>
            </div>
        </footer>
    );
}
