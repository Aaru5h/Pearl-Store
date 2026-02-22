"use client";

import { motion, Variants } from "framer-motion";
import styles from "./FeaturedProducts.module.css";
import { Heart } from "lucide-react";

const products = [
    { id: 1, name: "Cloud Cushion", price: "$24.00", color: "#f4ede4" }, // Cream
    { id: 2, name: "Matcha Mug", price: "$18.00", color: "#d1dac5" }, // Matcha Green
    { id: 3, name: "Fairy Lights", price: "$15.00", color: "#fafaf8" }, // Off-white
    { id: 4, name: "Linen Diffuser", price: "$32.00", color: "#eaddcf" }, // Sand
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
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
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="cute-title">Featured Lovelies</h2>
                    <p>Hand-picked just for your aesthetic</p>
                </motion.div>

                <motion.div
                    className={styles.productGrid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            className={styles.productCard}
                            variants={itemVariants}
                            whileHover={{ y: -10, boxShadow: "var(--shadow-hover)" }}
                        >
                            <div
                                className={styles.imagePlaceholder}
                                style={{ backgroundColor: product.color }}
                            >
                                <button className={styles.wishlistBtn}>
                                    <Heart size={20} color="var(--color-primary-dark)" />
                                </button>
                            </div>
                            <div className={styles.productInfo}>
                                <h3 className="cute-title">{product.name}</h3>
                                <span className={styles.price}>{product.price}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
