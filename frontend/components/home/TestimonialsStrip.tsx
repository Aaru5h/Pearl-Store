"use client";

import { motion } from "framer-motion";
import { StarRating } from "@/components/shared/StarRating";
import { fadeUp, fadeUpTransition } from "@/lib/animations";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    text: "Pearl Store has completely changed how I shop. The produce is always fresh, and the delivery is incredibly prompt. It feels like they really care.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rahul Verma",
    text: "I love the curated selection of local goods. It's not just a supermarket; it feels like a neighborhood shop that knows what I like.",
    rating: 5,
  },
  {
    id: 3,
    name: "Anita Desai",
    text: "The website is so easy to use, and I appreciate the careful packaging. No plastic everywhere, just neat, sturdy bags. Highly recommended.",
    rating: 4,
  },
  {
    id: 4,
    name: "Vikram Singh",
    text: "Excellent customer service. They called me when an item was out of stock to offer a suitable replacement instead of just canceling it.",
    rating: 5,
  },
];

export function TestimonialsStrip() {
  return (
    <section className="py-24 bg-linen overflow-hidden">
      <div className="container-store relative z-10">
        <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            className="text-center mb-16"
        >
          <h2 className="font-display text-[32px] text-charcoal mb-4">Loved by the Neighbourhood</h2>
          <p className="text-body text-stone max-w-lg mx-auto">Don't just take our word for it. Here's what our community has to say about shopping with Pearl Store.</p>
        </motion.div>

        {/* CSS-based Marquee for smooth continuous scrolling */}
        <div className="relative flex overflow-hidden gap-6 pb-4 [mask-image:_linear-gradient(to_right,transparent_0,_black_100px,_black_calc(100%-100px),transparent_100%)]">
            <div className="flex animate-marquee gap-6 min-w-max hover:[animation-play-state:paused]">
                {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, idx) => (
                    <div 
                        key={`${testimonial.id}-${idx}`}
                        className="w-[350px] bg-white p-8 rounded-2xl shadow-card border border-pebble flex flex-col justify-between"
                    >
                        <div>
                            <StarRating rating={testimonial.rating} className="mb-4" />
                            <p className="text-[15px] text-charcoal/90 leading-relaxed italic mb-6">"{testimonial.text}"</p>
                        </div>
                        <p className="text-[14px] font-medium text-bark">— {testimonial.name}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
