import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

export function LiveAurora({ className }) {
    const canvasRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const prefersReducedMotion = useRef(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        prefersReducedMotion.current = mediaQuery.matches;
        
        const listener = (e) => {
            prefersReducedMotion.current = e.matches;
        };
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (prefersReducedMotion.current) return;
            // 2-6px offset for subtle parallax
            const x = (e.clientX / window.innerWidth - 0.5) * 12; 
            const y = (e.clientY / window.innerHeight - 0.5) * 12;
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d', { alpha: true });
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resize);
        resize();

        // 4 Blobs simulating a fluid aurora mesh
        const blobs = [
            // Primary (#5B4BFF)
            { color: 'rgba(91, 75, 255, 0.4)', radiusMultiplier: 0.7, speedX: 0.0003, speedY: 0.0004, offset: 0, originX: 0.1, originY: 0.1 },
            // Secondary (#8B5CF6)
            { color: 'rgba(139, 92, 246, 0.35)', radiusMultiplier: 0.8, speedX: 0.0002, speedY: 0.0003, offset: Math.PI / 2, originX: 0.9, originY: 0.1 },
            // Accent / Sky (#38bdf8)
            { color: 'rgba(56, 189, 248, 0.3)', radiusMultiplier: 0.65, speedX: 0.0004, speedY: 0.0002, offset: Math.PI, originX: 0.8, originY: 0.9 },
            // Primary 2
            { color: 'rgba(91, 75, 255, 0.25)', radiusMultiplier: 0.6, speedX: 0.00025, speedY: 0.00035, offset: Math.PI * 1.5, originX: 0.1, originY: 0.9 },
        ];

        // Seed with a random offset so it's slightly different every load
        let time = Math.random() * 10000;

        const render = (timestamp) => {
            if (!prefersReducedMotion.current) {
                time += 16; // 60fps delta approx
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Use the largest dimension to ensure blobs fill the screen
            const maxDim = Math.max(canvas.width, canvas.height);
            const baseRadius = maxDim * 0.6;

            blobs.forEach((blob) => {
                // Organic complex motion using combined sine waves (approximating simplex noise)
                const x = (canvas.width * blob.originX) 
                    + Math.sin(time * blob.speedX + blob.offset) * (canvas.width * 0.3) 
                    + Math.sin(time * 0.0001) * (canvas.width * 0.1);
                
                const y = (canvas.height * blob.originY) 
                    + Math.cos(time * blob.speedY + blob.offset) * (canvas.height * 0.3) 
                    + Math.cos(time * 0.0001) * (canvas.height * 0.1);
                
                // Slow breathing scale
                const scale = 1 + Math.sin(time * 0.0005 + blob.offset) * 0.15;
                const radius = baseRadius * blob.radiusMultiplier * scale;

                ctx.beginPath();
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, blob.color);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = gradient;
                // Only draw the bounds of the gradient to maximize performance
                ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
                ctx.fill();
            });

            if (!prefersReducedMotion.current) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        // Render first frame immediately
        render(performance.now());
        
        if (!prefersReducedMotion.current) {
            animationFrameId = requestAnimationFrame(render);
        }

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[var(--color-brand-background)]", className)}>
            {/* The canvas is rendered oversize (-10% to 120%) so the edges never show when parallaxing */}
            <canvas
                ref={canvasRef}
                className="absolute inset-[-10%] w-[120%] h-[120%] transition-transform duration-300 ease-out"
                style={{
                    transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)`,
                    // Huge CSS blur melts the canvas radial gradients perfectly together like a shader
                    filter: 'blur(80px)' 
                }}
            />
            {/* Fine dot pattern overlay remains on top for texture */}
            <div className="absolute inset-0 bg-dot-pattern opacity-60 mix-blend-overlay"></div>
        </div>
    );
}
