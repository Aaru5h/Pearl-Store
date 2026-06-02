"use client";

import { motion, Variants } from "framer-motion";
import styles from "./FeaturedProducts.module.css";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";

const FeaturedProductCanvas = dynamic(
    () => import('./FeaturedProductCanvas'),
    { ssr: false, loading: () => <div className={styles.canvasPlaceholder} /> }
);

const products = [
    { id: 1, name: "Cloud Cushion",    desc: "Artisan organic cotton",  price: "$24", tag: "Bestseller" },
    { id: 2, name: "Matcha Mug",       desc: "Hand-thrown ceramic",     price: "$18", tag: "New" },
    { id: 3, name: "Fairy Lights",     desc: "Warm amber micro LEDs",   price: "$15", tag: null },
    { id: 4, name: "Linen Diffuser",   desc: "Cold-pressed essential",  price: "$32", tag: "Limited" },
    { id: 5, name: "Bento Organizer",  desc: "Modular bamboo system",   price: "$45", tag: null },
];

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};

const cardVariant: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function FeaturedProducts() {
    return (
        <section id="collection" className={styles.section}>
            <div className={`container ${styles.header}`}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p className={styles.sectionTag}>The Collection</p>
                    <h2 className={styles.sectionTitle}>Curated Essentials</h2>
                    <p className={styles.sectionSub}>Five intentionally designed pieces to elevate your everyday.</p>
                </motion.div>
                <motion.span
                    className={styles.counter}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    05 Pieces
                </motion.span>
            </div>

            <motion.div
                className={styles.grid}
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        className={styles.card}
                        variants={cardVariant}
                        whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    >
                        <div className={styles.cardVisual}>
                            <div className={styles.canvas3D}>
                                <FeaturedProductCanvas productId={product.id} />
                            </div>
                            {product.tag && (
                                <span className={styles.cardTag}>{product.tag}</span>
                            )}
                            <div className={styles.cardOverlay}>
                                <span className={styles.quickView}>
                                    View <ArrowUpRight size={14} />
                                </span>
                            </div>
                        </div>

                        <div className={styles.cardInfo}>
                            <div className={styles.cardMeta}>
                                <h3 className={styles.cardName}>{product.name}</h3>
                                <span className={styles.cardPrice}>{product.price}</span>
                            </div>
                            <p className={styles.cardDesc}>{product.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
