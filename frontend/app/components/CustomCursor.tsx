"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
        };

        const animate = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
            requestAnimationFrame(animate);
        };

        const onMouseEnterInteractive = () => ring.classList.add("hovering");
        const onMouseLeaveInteractive = () => ring.classList.remove("hovering");

        window.addEventListener("mousemove", onMouseMove);
        animate();

        // Add hover effect to all interactive elements
        const interactiveElements = document.querySelectorAll("a, button, [data-cursor-hover]");
        interactiveElements.forEach(el => {
            el.addEventListener("mouseenter", onMouseEnterInteractive);
            el.addEventListener("mouseleave", onMouseLeaveInteractive);
        });

        // Use MutationObserver to handle dynamically added elements
        const observer = new MutationObserver(() => {
            const newElements = document.querySelectorAll("a, button, [data-cursor-hover]");
            newElements.forEach(el => {
                el.addEventListener("mouseenter", onMouseEnterInteractive);
                el.addEventListener("mouseleave", onMouseLeaveInteractive);
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            observer.disconnect();
            interactiveElements.forEach(el => {
                el.removeEventListener("mouseenter", onMouseEnterInteractive);
                el.removeEventListener("mouseleave", onMouseLeaveInteractive);
            });
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot" />
            <div ref={ringRef} className="cursor-ring" />
        </>
    );
}
