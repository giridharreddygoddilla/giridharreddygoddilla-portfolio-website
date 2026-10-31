import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Minimal, responsive cursor:
 * - 6px precision micro-dot (zero-lag tracking)
 * - 24px subtle outer aura ring (gentle inertia)
 * - Expands elegantly on hover over interactive elements (a, button, clickable cards)
 * - Disabled completely on touch devices and for prefers-reduced-motion
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring for the outer ring (fluid, smooth inertia)
  const ringX = useSpring(mouseX, { stiffness: 450, damping: 32, mass: 0.1 });
  const ringY = useSpring(mouseY, { stiffness: 450, damping: 32, mass: 0.1 });

  // Spring for the micro dot (near instant, crisp alignment)
  const dotX = useSpring(mouseX, { stiffness: 1200, damping: 65, mass: 0.02 });
  const dotY = useSpring(mouseY, { stiffness: 1200, damping: 65, mass: 0.02 });

  useEffect(() => {
    // Only enable if user has a fine pointer (mouse/trackpad) and prefers standard motion
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], input, textarea, select, [data-interactive="true"]');
      setIsHovered(!!interactive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!enabled) return null;

  return (
    <>
      {/* Outer aura ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-white/30 backdrop-blur-[1px]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 42 : 24,
          height: isHovered ? 42 : 24,
          opacity: isVisible ? (isHovered ? 0.9 : 0.45) : 0,
          scale: isClicking ? 0.85 : 1,
          borderColor: isHovered ? 'rgba(229, 9, 32, 0.65)' : 'rgba(255, 255, 255, 0.35)',
          backgroundColor: isHovered ? 'rgba(229, 9, 32, 0.08)' : 'rgba(255, 255, 255, 0.02)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      {/* Precision micro dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[10000] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 8 : 5,
          height: isHovered ? 8 : 5,
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.6 : 1,
          backgroundColor: isHovered ? '#ff3d5a' : '#f5f5f5',
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 50 }}
      />
    </>
  );
}
