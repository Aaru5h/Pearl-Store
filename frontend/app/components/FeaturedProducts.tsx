"use client";

import { motion, Variants } from "framer-motion";
import styles from "./FeaturedProducts.module.css";
import { Heart, ArrowUpRight } from "lucide-react";

const products = [
    { id: 1, name: "Cloud Cushion", desc: "For the softest naps", price: "$24.00", color: "#ffc4c4" },
    { id: 2, name: "Matcha Mug", desc: "Morning ritual", price: "$fffdf9", color: "#fffdf9" },
    { id: 3, name: "Fairy Lights", desc: "Warm ambiance", price: "$15.00", color: "#f4f5f0" },
    { id: 4, name: "Linen Diffuser", desc: "Signature scent", price: "$32.00", color: "#9b9fb5" },
    { id: 5, name: "Bento Organizer", desc: "Keep it tidy", price: "$45.00", color: "#ff9e9e" },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }
    }
};

export default function FeaturedProducts() {
    return (
        <section className={styles.productSection}>
            <div className={`lofi-container ${styles.container}`}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={styles.sectionTitle}>Featured Lovelies</h2>
                    <p className={styles.sectionSubtitle}>Select pieces to complete your aesthetic.</p>
                </motion.div>

                <motion.div
                    className={styles.productGrid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            className={`${styles.productCard} bento-card`}
                            variants={itemVariants}
                            whileHover={{
                                y: -8,
                                boxShadow: "var(--shadow-hover)"
                            }}
                        >
                            <div
                                className={styles.imageBox}
                                style={{ backgroundColor: product.color }}
                            >
                                <button className={styles.wishlistBtn}>
                                    <Heart size={18} color="var(--color-text)" />
                                </button>
                                <div className={styles.hoverOverlay}>
                                    <span className={styles.viewText}>Quick View <ArrowUpRight size={16} /></span>
                                </div>
                            </div>

                            <div className={styles.productInfo}>
                                <div className={styles.infoTop}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <span className={styles.price}>{product.price}</span>
                                </div>
                                <p className={styles.productDesc}>{product.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
