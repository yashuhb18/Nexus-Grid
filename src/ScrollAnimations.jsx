import { useState, useEffect, useRef, useCallback } from "react";

// ─── Custom Hook: Scroll Progress Tracker ────────────────────────────────────
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}

// ─── Custom Hook: Element Visibility with Intersection Observer ──────────────
export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const thresh = options.threshold !== undefined ? options.threshold : 0.02;
    const margin = options.rootMargin !== undefined ? options.rootMargin : "0px 0px -20px 0px";
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setHasBeenInView(true);
      },
      { threshold: thresh, rootMargin: margin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [options.threshold, options.rootMargin]);

  return [ref, inView, hasBeenInView];
}

// ─── Custom Hook: Parallax Scroll Position ───────────────────────────────────
export function useParallax(speed = 0.5) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame;
    const update = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      const center = rect.top + rect.height / 2 - viewH / 2;
      setOffset(center * speed);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [speed]);

  return [ref, offset];
}

// ─── Custom Hook: Element scroll ratio (0 at bottom of viewport → 1 at top) ─
export function useElementScrollRatio() {
  const ref = useRef(null);
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    let frame;
    const update = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      // ratio = 0 when element bottom edge reaches viewport bottom
      // ratio = 1 when element top edge reaches viewport top
      const r = 1 - (rect.top / (viewH - rect.height * 0.3));
      setRatio(Math.max(0, Math.min(1, r)));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return [ref, ratio];
}

// ─── Animation Presets ───────────────────────────────────────────────────────
const ANIMATION_PRESETS = {
  // Rise from below with fade
  fadeUp: {
    hidden: { opacity: 0, transform: "translateY(80px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
  },
  // Rise from below with scale
  scaleUp: {
    hidden: { opacity: 0, transform: "translateY(60px) scale(0.9)" },
    visible: { opacity: 1, transform: "translateY(0) scale(1)" },
  },
  // Slide from left
  slideLeft: {
    hidden: { opacity: 0, transform: "translateX(-100px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  // Slide from right
  slideRight: {
    hidden: { opacity: 0, transform: "translateX(100px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  // Dramatic zoom in
  zoomIn: {
    hidden: { opacity: 0, transform: "scale(0.6)" },
    visible: { opacity: 1, transform: "scale(1)" },
  },
  // Rotate in from below
  rotateUp: {
    hidden: { opacity: 0, transform: "translateY(100px) rotateX(15deg)" },
    visible: { opacity: 1, transform: "translateY(0) rotateX(0deg)" },
  },
  // Flip in
  flipIn: {
    hidden: { opacity: 0, transform: "perspective(800px) rotateY(-25deg) translateX(-40px)" },
    visible: { opacity: 1, transform: "perspective(800px) rotateY(0deg) translateX(0)" },
  },
  // Glitch-style entrance
  glitchIn: {
    hidden: { opacity: 0, transform: "translateX(-20px) skewX(-8deg)", filter: "blur(8px)" },
    visible: { opacity: 1, transform: "translateX(0) skewX(0deg)", filter: "blur(0px)" },
  },
  // 3D tilt entrance
  tilt3D: {
    hidden: { opacity: 0, transform: "perspective(1000px) rotateX(20deg) rotateY(-10deg) translateY(60px)" },
    visible: { opacity: 1, transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)" },
  },
  // Cinematic wipe
  wipeIn: {
    hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    visible: { opacity: 1, clipPath: "inset(0 0% 0 0)" },
  },
  // Reveal from center
  expandCenter: {
    hidden: { opacity: 0, clipPath: "inset(50% 50% 50% 50%)" },
    visible: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
  },
  // Staggered card rise
  cardRise: {
    hidden: { opacity: 0, transform: "translateY(120px) rotateX(8deg) scale(0.95)" },
    visible: { opacity: 1, transform: "translateY(0) rotateX(0deg) scale(1)" },
  },
  // Drop from above
  dropIn: {
    hidden: { opacity: 0, transform: "translateY(-80px) scale(0.95)" },
    visible: { opacity: 1, transform: "translateY(0) scale(1)" },
  },
  // Blur in from nothing
  blurIn: {
    hidden: { opacity: 0, filter: "blur(20px)", transform: "scale(1.1)" },
    visible: { opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
  },
};

// ─── ScrollReveal Component ──────────────────────────────────────────────────
export function ScrollReveal({
  children,
  animation = "fadeUp",
  delay = 0,
  duration = 0.9,
  easing = "cubic-bezier(0.16, 1, 0.3, 1)",
  threshold = 0.02,
  rootMargin = "0px 0px -20px 0px",
  style = {},
  className = "",
  once = true,
  as: Tag = "div",
}) {
  const [ref, , hasBeenInView] = useInView({ threshold, rootMargin });
  const preset = ANIMATION_PRESETS[animation] || ANIMATION_PRESETS.fadeUp;
  const isVisible = once ? hasBeenInView : hasBeenInView;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        ...(isVisible ? preset.visible : preset.hidden),
        transition: `all ${duration}s ${easing} ${delay}s`,
        willChange: "transform, opacity, filter, clip-path",
      }}
    >
      {children}
    </Tag>
  );
}

// ─── Stagger Container (for staggering children) ─────────────────────────────
export function StaggerContainer({
  children,
  animation = "fadeUp",
  staggerDelay = 0.12,
  baseDuration = 0.8,
  baseDelay = 0,
  easing = "cubic-bezier(0.16, 1, 0.3, 1)",
  threshold = 0.02,
  rootMargin = "0px 0px -20px 0px",
  style = {},
  className = "",
}) {
  const [ref, , hasBeenInView] = useInView({ threshold, rootMargin });
  const preset = ANIMATION_PRESETS[animation] || ANIMATION_PRESETS.fadeUp;

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={className} style={style}>
      {childArray.map((child, i) => (
        <div
          key={i}
          style={{
            ...(hasBeenInView ? preset.visible : preset.hidden),
            transition: `all ${baseDuration}s ${easing} ${baseDelay + i * staggerDelay}s`,
            willChange: "transform, opacity, filter, clip-path",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// ─── Section Heading Reveal (badge + title + subtitle with sequential reveal) ─
export function SectionHeadingReveal({ badge, title, subtitle, badgeColor = "#00b4ff" }) {
  const [ref, , hasBeenInView] = useInView({ threshold: 0.15 });

  return (
    <div ref={ref} style={{ textAlign: "center", marginBottom: 64 }}>
      {/* Badge */}
      <div
        style={{
          display: "inline-block",
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          color: badgeColor,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: 18,
          padding: "5px 14px",
          background: `${badgeColor}14`,
          border: `1px solid ${badgeColor}33`,
          borderRadius: 100,
          opacity: hasBeenInView ? 1 : 0,
          transform: hasBeenInView ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)",
          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0s",
        }}
      >
        {badge}
      </div>
      {/* Title */}
      <h2
        style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "clamp(28px,4vw,52px)",
          fontWeight: 800,
          color: "#fff",
          marginBottom: 18,
          letterSpacing: "-0.02em",
          opacity: hasBeenInView ? 1 : 0,
          transform: hasBeenInView ? "translateY(0)" : "translateY(40px)",
          filter: hasBeenInView ? "blur(0)" : "blur(8px)",
          transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
        }}
      >
        {title}
      </h2>
      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 17,
            color: "rgba(255,255,255,0.5)",
            maxWidth: 600,
            margin: "0 auto",
            lineHeight: 1.75,
            opacity: hasBeenInView ? 1 : 0,
            transform: hasBeenInView ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Parallax Section Wrapper ────────────────────────────────────────────────
export function ParallaxSection({ children, speed = 0.15, style = {}, className = "" }) {
  const [ref, offset] = useParallax(speed);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform: `translateY(${offset}px)`,
        transition: "transform 0.1s linear",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

// ─── Magnetic Hover Card ─────────────────────────────────────────────────────
export function MagneticCard({ children, style = {}, className = "", intensity = 12 }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState("perspective(800px) rotateX(0) rotateY(0)");
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTransform(
        `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(1.02)`
      );
      setGlowPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [intensity]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(800px) rotateX(0) rotateY(0) scale(1)");
    setIsHovering(false);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={(e) => {
        handleMouseMove(e);
        setIsHovering(true);
      }}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform,
        transition: isHovering ? "transform 0.15s ease-out" : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Spotlight glow effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(0,180,255,0.12) 0%, transparent 60%)`,
          opacity: isHovering ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
          borderRadius: "inherit",
          zIndex: 1,
        }}
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}

// ─── Scroll Progress Bar ─────────────────────────────────────────────────────
export function ScrollProgressBar() {
  const progress = useScrollProgress();
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 3,
        width: `${progress * 100}%`,
        background: "linear-gradient(90deg, #00b4ff, #ff6600, #00b4ff)",
        backgroundSize: "200% 100%",
        animation: "gradient-shift 3s ease infinite",
        zIndex: 9999,
        boxShadow: "0 0 15px rgba(0,180,255,0.8), 0 0 30px rgba(255,100,0,0.4)",
        transition: "width 0.1s linear",
      }}
    />
  );
}

// ─── Floating Scroll Indicator Glow Lines ────────────────────────────────────
export function SectionDivider({ color = "#00b4ff" }) {
  const [ref, , hasBeenInView] = useInView({ threshold: 0.5 });
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 0",
        gap: 16,
      }}
    >
      <div
        style={{
          height: 1,
          flex: 1,
          maxWidth: 200,
          background: `linear-gradient(90deg, transparent, ${color}60)`,
          transform: hasBeenInView ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "right",
          transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0s",
        }}
      />
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 12px ${color}`,
          opacity: hasBeenInView ? 1 : 0,
          transform: hasBeenInView ? "scale(1)" : "scale(0)",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
        }}
      />
      <div
        style={{
          height: 1,
          flex: 1,
          maxWidth: 200,
          background: `linear-gradient(90deg, ${color}60, transparent)`,
          transform: hasBeenInView ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0s",
        }}
      />
    </div>
  );
}

// ─── Counter Animation (for Impact numbers) ──────────────────────────────────
export function AnimatedCounter({ value, suffix = "", prefix = "", duration = 2000, color = "#fff" }) {
  const [ref, , hasBeenInView] = useInView({ threshold: 0.3 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!hasBeenInView) return;
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      // Non-numeric values (like ∞) just display directly
      return;
    }
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(numericValue * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [hasBeenInView, value, duration]);

  const isNumeric = !isNaN(parseFloat(value));

  return (
    <span ref={ref} style={{ color }}>
      {prefix}
      {isNumeric ? displayValue : (hasBeenInView ? value : "—")}
      {suffix}
    </span>
  );
}

// ─── Text Reveal (character by character) ────────────────────────────────────
export function TextReveal({ text, delay = 0, staggerMs = 30, style = {} }) {
  const [ref, , hasBeenInView] = useInView({ threshold: 0.2 });
  return (
    <span ref={ref} style={{ ...style, display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: hasBeenInView ? 1 : 0,
            transform: hasBeenInView ? "translateY(0) rotateX(0deg)" : "translateY(30px) rotateX(90deg)",
            transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * staggerMs / 1000}s`,
            willChange: "transform, opacity",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

// ─── Horizontal Scroll Reveal (reveals as you scroll horizontally) ───────────
export function HorizontalReveal({ children, direction = "left", style = {}, className = "" }) {
  const [ref, , hasBeenInView] = useInView({ threshold: 0.1 });
  const translateX = direction === "left" ? "-100%" : "100%";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: hasBeenInView ? "translateX(0)" : `translateX(${translateX})`,
          opacity: hasBeenInView ? 1 : 0,
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </div>
    </div>
  );
}
