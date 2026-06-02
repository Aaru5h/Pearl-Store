"use client";

import styles from "./Marquee.module.css";

const items = [
    "CURATED COMFORT",
    "PREMIUM QUALITY",
    "INTENTIONAL DESIGN",
    "TIMELESS OBJECTS",
    "CRAFTED WITH CARE",
];

export default function Marquee() {
    const marqueeContent = items.map((item, i) => (
        <span key={i} className={styles.item}>
            {item}
            <span className={styles.dot}>◆</span>
        </span>
    ));

    return (
        <div className={styles.marqueeWrapper}>
            <div className={styles.marqueeTrack}>
                <div className={styles.marqueeContent}>
                    {marqueeContent}
                    {marqueeContent}
                </div>
            </div>
        </div>
    );
}
