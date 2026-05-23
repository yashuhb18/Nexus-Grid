import { useState, useEffect, useRef, useCallback } from "react";
import {
  ScrollReveal,
  StaggerContainer,
  SectionHeadingReveal,
  ParallaxSection,
  MagneticCard,
  ScrollProgressBar,
  SectionDivider,
  AnimatedCounter,
  TextReveal,
  HorizontalReveal,
  useInView,
  useParallax,
  useElementScrollRatio,
} from "./ScrollAnimations";

// ─── Animated Grid Background ──────────────────────────────────────────────
function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,180,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          animation: "gridMove 20s linear infinite",
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,140,255,0.08) 0%, transparent 70%)"
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 50% 40% at 80% 80%, rgba(255,100,0,0.05) 0%, transparent 60%)"
      }} />
      <Particles />
      <style>{`
        @keyframes gridMove { from { transform: translateY(0); } to { transform: translateY(60px); } }
        @keyframes pulse-ring { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.4);opacity:0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes glow-border { 0%,100%{box-shadow:0 0 10px rgba(0,180,255,0.3)} 50%{box-shadow:0 0 25px rgba(0,180,255,0.7)} }
        @keyframes slide-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fade-in { from{opacity:0} to{opacity:1} }
        @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes dash { to{stroke-dashoffset:0} }
        @keyframes node-pulse { 0%,100%{r:4;opacity:1} 50%{r:7;opacity:0.6} }
        @keyframes gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes ripple { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.5);opacity:0} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
      `}</style>
    </div>
  );
}

const STATIC_PARTICLES = [
  { id: 0, x: 12.5, y: 84.2, size: 2.1, delay: 1.4, dur: 7.2, color: "#ff6600" },
  { id: 1, x: 45.1, y: 23.7, size: 1.5, delay: 0.8, dur: 9.5, color: "#00b4ff" },
  { id: 2, x: 78.9, y: 56.4, size: 2.8, delay: 3.1, dur: 6.8, color: "#00b4ff" },
  { id: 3, x: 23.4, y: 12.9, size: 1.2, delay: 5.2, dur: 11.3, color: "#00b4ff" },
  { id: 4, x: 89.2, y: 74.1, size: 2.4, delay: 2.7, dur: 8.1, color: "#ff6600" },
  { id: 5, x: 56.7, y: 89.3, size: 1.9, delay: 4.3, dur: 10.4, color: "#00b4ff" },
  { id: 6, x: 34.2, y: 45.6, size: 2.6, delay: 1.9, dur: 7.9, color: "#00b4ff" },
  { id: 7, x: 67.8, y: 31.2, size: 1.4, delay: 6.5, dur: 11.8, color: "#00b4ff" },
  { id: 8, x: 15.6, y: 62.8, size: 2.3, delay: 0.2, dur: 6.2, color: "#ff6600" },
  { id: 9, x: 92.4, y: 18.5, size: 1.7, delay: 3.8, dur: 8.7, color: "#00b4ff" },
  { id: 10, x: 51.3, y: 50.2, size: 2.9, delay: 5.9, dur: 7.4, color: "#00b4ff" },
  { id: 11, x: 38.9, y: 77.6, size: 1.3, delay: 2.1, dur: 10.9, color: "#00b4ff" },
  { id: 12, x: 72.1, y: 95.4, size: 2.5, delay: 1.1, dur: 8.5, color: "#ff6600" },
  { id: 13, x: 27.8, y: 38.1, size: 1.8, delay: 4.7, dur: 9.8, color: "#00b4ff" },
  { id: 14, x: 61.5, y: 14.3, size: 2.7, delay: 0.5, dur: 6.5, color: "#00b4ff" },
  { id: 15, x: 84.3, y: 42.9, size: 1.6, delay: 7.2, dur: 12.0, color: "#00b4ff" },
  { id: 16, x: 9.7, y: 29.8, size: 2.2, delay: 3.4, dur: 7.6, color: "#ff6600" },
  { id: 17, x: 40.5, y: 68.2, size: 1.1, delay: 1.7, dur: 10.2, color: "#00b4ff" },
  { id: 18, x: 70.4, y: 26.5, size: 2.8, delay: 5.5, dur: 6.9, color: "#00b4ff" },
  { id: 19, x: 53.2, y: 61.9, size: 1.5, delay: 2.9, dur: 9.1, color: "#00b4ff" },
  { id: 20, x: 81.6, y: 88.7, size: 2.4, delay: 0.9, dur: 8.3, color: "#ff6600" },
  { id: 21, x: 19.3, y: 49.4, size: 1.9, delay: 6.2, dur: 11.5, color: "#00b4ff" },
  { id: 22, x: 64.8, y: 79.1, size: 2.6, delay: 4.1, dur: 7.7, color: "#00b4ff" },
  { id: 23, x: 31.0, y: 92.5, size: 1.2, delay: 2.5, dur: 10.6, color: "#00b4ff" }
];

const NAV_ITEMS = [
  { label: "Platform", target: "platform" },
  { label: "How It Works", target: "how-it-works" },
  { label: "Mission", target: "mission" },
  { label: "Impact", target: "impact" },
  { label: "Vision", target: "vision" }
];

function scrollToSection(target) {
  document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Particles() {
  return (
    <>
      {STATIC_PARTICLES.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: p.color, opacity: 0.5,
          animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite`,
          boxShadow: `0 0 6px ${p.color}`
        }} />
      ))}
    </>
  );
}

// ─── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [activeSection, setActiveSection] = useState("platform");

  useEffect(() => {
    const fn = () => {
      const current = NAV_ITEMS.reduce((active, item) => {
        const section = document.getElementById(item.target);
        if (!section) return active;
        const top = section.getBoundingClientRect().top;
        return top <= 120 ? item.target : active;
      }, NAV_ITEMS[0].target);

      setActiveSection(current);
    };

    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "all 0.4s ease",
      background: "linear-gradient(180deg, rgba(3,7,18,0.98), rgba(4,8,16,0.94))",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(0,180,255,0.16)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
      padding: "0 max(24px, calc((100% - 1200px)/2))",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "linear-gradient(135deg, #00b4ff, #ff6600)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 18px rgba(0,180,255,0.5)"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "0.05em" }}>
            NEXUS<span style={{ color: "#00b4ff" }}>GRID</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.target;
            return (
            <button key={item.target} type="button" onClick={() => scrollToSection(item.target)} style={{
              background: "transparent", border: "none", padding: "10px 0", position: "relative",
              color: isActive ? "#00b4ff" : "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: "'Syne', sans-serif",
              fontWeight: 700, textDecoration: "none", letterSpacing: "0.08em",
              transition: "color 0.2s", textTransform: "uppercase", cursor: "pointer"
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#00b4ff"}
              onMouseLeave={e => e.currentTarget.style.color = isActive ? "#00b4ff" : "rgba(255,255,255,0.6)"}
            >
              {item.label}
              <span style={{
                position: "absolute", left: 0, right: 0, bottom: 0, height: 2,
                background: "linear-gradient(90deg, transparent, #00b4ff, transparent)",
                transform: isActive ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.25s ease",
                boxShadow: isActive ? "0 0 12px rgba(0,180,255,0.8)" : "none"
              }} />
            </button>
            );
          })}
          <button type="button" style={{
            background: "linear-gradient(135deg, #00b4ff, #0070ff)",
            border: "none", borderRadius: 8, padding: "9px 20px",
            color: "#fff", fontSize: 13, fontFamily: "'Syne', sans-serif",
            fontWeight: 600, cursor: "pointer", letterSpacing: "0.05em",
            boxShadow: "0 0 20px rgba(0,180,255,0.4)", transition: "all 0.2s"
          }}
            onClick={() => scrollToSection("deploy")}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 0 30px rgba(0,180,255,0.6)"; }}
            onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "0 0 20px rgba(0,180,255,0.4)"; }}
          >Deploy Now</button>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');`}</style>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function MeshActivationVisual({ progress }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frame;
    const tick = () => {
      setTime(t => t + 0.02);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const breathe = Math.sin(time) * 0.5 + 0.5; // smooth 0 to 1 oscillation
  
  // Combine scroll progress with auto-breathing so it always moves and breathes dynamically on first page load!
  const activePercent = Math.min(1.0, Math.max(progress, 0.38 + breathe * 0.32));

  const upperLift = -6 - activePercent * 34;
  const lowerDrop = activePercent * 18;
  const signalOpacity = 0.45 + activePercent * 0.55; // baseline 45% opacity so signals are always highly visible and gorgeous!
  const pulseScale = 0.8 + activePercent * 0.32;
  const nodeGlow = 0.45 + activePercent * 0.55;

  return (
    <svg viewBox="0 0 380 322" style={{ width: "100%", height: "100%", overflow: "visible" }} aria-hidden="true">
      <defs>
        <linearGradient id="purpleSideLeft" x1="70" y1="212" x2="190" y2="303" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8a20ff" />
          <stop offset="1" stopColor="#3f008f" />
        </linearGradient>
        <linearGradient id="purpleSideRight" x1="310" y1="212" x2="190" y2="303" gradientUnits="userSpaceOnUse">
          <stop stopColor="#410087" />
          <stop offset="1" stopColor="#9a31ff" />
        </linearGradient>
        <filter id="meshGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <ellipse
        cx="190"
        cy="182"
        rx={96 + progress * 28}
        ry={74 + progress * 14}
        fill="rgba(0,180,255,0.18)"
        filter="url(#softGlow)"
        opacity={0.45 + progress * 0.25}
      />

      <g opacity={signalOpacity}>
        {[0, 1, 2].map(i => (
          <circle
            key={i}
            cx="190"
            cy="178"
            r={(34 + i * 30) * pulseScale}
            fill="none"
            stroke={i === 1 ? "#00b4ff" : "#ff6600"}
            strokeWidth="1.2"
            opacity={0.4 / (i + 1)}
            style={{ animation: `ripple ${2.2 + i * 0.5}s ease-out ${i * 0.25}s infinite`, transformOrigin: "190px 178px" }}
          />
        ))}
      </g>

      <g transform={`translate(0 ${upperLift})`} style={{ transition: "transform 0.12s linear" }}>
        <polygon points="70,93 190,160 190,178 70,111" fill="rgba(34,39,51,0.82)" stroke="rgba(150,158,176,0.8)" strokeWidth="1.2" />
        <polygon points="310,93 310,111 190,178 190,160" fill="rgba(34,39,51,0.82)" stroke="rgba(150,158,176,0.8)" strokeWidth="1.2" />
        <polygon points="190,26 310,93 190,160 70,93" fill="#070c10" stroke="rgba(150,158,176,0.95)" strokeWidth="1.2" />
      </g>

      <g opacity={0.38 + progress * 0.48}>
        <line x1="70" y1={105 + upperLift} x2="70" y2={214 + lowerDrop} stroke="#9ca3c7" strokeWidth="1.1" strokeDasharray="2 5" />
        <line x1="310" y1={105 + upperLift} x2="310" y2={214 + lowerDrop} stroke="#9ca3c7" strokeWidth="1.1" strokeDasharray="2 5" />
        <line x1="190" y1={172 + upperLift} x2="190" y2={145 + lowerDrop} stroke="#00b4ff" strokeWidth="1.2" strokeDasharray="3 6" opacity={progress} />
      </g>

      <g transform={`translate(0 ${lowerDrop})`} style={{ transition: "transform 0.12s linear" }}>
        <polygon points="70,212 190,279 190,303 70,236" fill="url(#purpleSideLeft)" stroke="#8320ff" strokeWidth="1.35" />
        <polygon points="310,212 310,236 190,303 190,279" fill="url(#purpleSideRight)" stroke="#8320ff" strokeWidth="1.35" />
        <g opacity="0.55">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <g key={i}>
              <line x1={82 + i * 14} y1={226 + i * 6} x2={100 + i * 14} y2={239 + i * 6} stroke="#e8b8ff" strokeWidth="2" opacity="0.55" />
              <line x1={298 - i * 14} y1={226 + i * 6} x2={280 - i * 14} y2={239 + i * 6} stroke="#e8b8ff" strokeWidth="2" opacity="0.55" />
            </g>
          ))}
        </g>
        <polygon points="190,145 310,212 190,279 70,212" fill="#070d10" stroke="#8320ff" strokeWidth="1.35" />
      </g>

      <g opacity={signalOpacity} filter="url(#meshGlow)">
        <path d={`M190 ${145 + lowerDrop} C155 ${164 + lowerDrop}, 122 ${184 + lowerDrop}, 88 ${209 + lowerDrop}`} fill="none" stroke="#00b4ff" strokeWidth="1.4" opacity="0.35" />
        <path d={`M190 ${145 + lowerDrop} C225 ${164 + lowerDrop}, 258 ${184 + lowerDrop}, 292 ${209 + lowerDrop}`} fill="none" stroke="#00b4ff" strokeWidth="1.4" opacity="0.35" />
        <path d={`M190 ${145 + lowerDrop} C190 132, 190 120, 190 ${104 + upperLift}`} fill="none" stroke="#ff6600" strokeWidth="1.2" opacity="0.35" />
        <circle r="4" fill="#00b4ff">
          <animateMotion dur="1.9s" repeatCount="indefinite" path={`M190 ${145 + lowerDrop} C155 ${164 + lowerDrop}, 122 ${184 + lowerDrop}, 88 ${209 + lowerDrop}`} />
        </circle>
        <circle r="4" fill="#00b4ff">
          <animateMotion dur="2.1s" repeatCount="indefinite" begin="0.35s" path={`M190 ${145 + lowerDrop} C225 ${164 + lowerDrop}, 258 ${184 + lowerDrop}, 292 ${209 + lowerDrop}`} />
        </circle>
        <circle r="3.5" fill="#ff6600">
          <animateMotion dur="1.6s" repeatCount="indefinite" begin="0.15s" path={`M190 ${145 + lowerDrop} C190 132, 190 120, 190 ${104 + upperLift}`} />
        </circle>
      </g>

      <g filter="url(#meshGlow)">
        {[
          [190, 145 + lowerDrop, "#ff6600"],
          [70, 212 + lowerDrop, "#00b4ff"],
          [310, 212 + lowerDrop, "#00b4ff"],
          [190, 279 + lowerDrop, "#00b4ff"]
        ].map(([cx, cy, color], i) => (
          <circle key={i} cx={cx} cy={cy} r={3.5 + progress * 1.8} fill={color} opacity={nodeGlow} />
        ))}
      </g>
    </svg>
  );
}

function Hero() {
  const [activation, setActivation] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setActivation(Math.min(1, Math.max(0, window.scrollY / 420)));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "120px max(24px, calc((100% - 1100px)/2)) 80px",
      position: "relative", flexDirection: "column", textAlign: "center"
    }}>
      {/* Emergency pulse rings */}
      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%",
            border: `1px solid rgba(${i === 1 ? "255,100,0" : "0,180,255"},${0.3 / i})`,
            width: i * 280, height: i * 280,
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            animation: `pulse-ring ${2 + i}s ease-out ${i * 0.4}s infinite`
          }} />
        ))}
      </div>

      {/* Badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
        background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.25)",
        borderRadius: 100, padding: "7px 18px",
        animation: "slide-up 0.6s ease both"
      }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff6600", animation: "blink 1.5s infinite" }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Emergency Response Network · Active
        </span>
      </div>

      {/* Nexus Grid visual */}
      <div style={{
        position: "relative",
        width: "min(260px, 68vw)",
        aspectRatio: "1 / 1",
        marginBottom: 34,
        animation: "slide-up 0.65s 0.05s ease both, float 6s ease-in-out infinite"
      }}>
        <div style={{
          position: "absolute",
          inset: "12%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,180,255,0.22) 0%, rgba(255,100,0,0.1) 38%, transparent 70%)",
          filter: "blur(18px)",
          opacity: 0.85
        }} />
        <div style={{
          position: "relative",
          width: "100%",
          height: "100%",
          filter: "drop-shadow(0 0 26px rgba(0,180,255,0.45)) drop-shadow(0 18px 34px rgba(255,100,0,0.16))"
        }}>
          <MeshActivationVisual progress={activation} />
        </div>
      </div>

      {/* Headline */}
      <h1 style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: "clamp(40px, 7vw, 88px)",
        fontWeight: 900, lineHeight: 1.05,
        color: "#fff", marginBottom: 28,
        letterSpacing: "-0.02em",
        animation: "slide-up 0.7s 0.1s ease both",
        maxWidth: 900
      }}>
        Communication When
        <br />
        <span style={{
          background: "linear-gradient(90deg, #00b4ff 0%, #0070ff 40%, #ff6600 80%)",
          backgroundClip: "text", WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundSize: "200% 100%",
          animation: "gradient-shift 4s ease infinite"
        }}>Everything Else Fails.</span>
      </h1>

      {/* Subheadline */}
      <p style={{
        fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px, 2vw, 20px)",
        color: "rgba(255,255,255,0.55)", maxWidth: 640, lineHeight: 1.7,
        marginBottom: 48, animation: "slide-up 0.7s 0.2s ease both"
      }}>
        A next-generation emergency communication ecosystem built for resilience, coordination, and survival in the most critical situations.
      </p>

      {/* CTAs */}
      <div style={{
        display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center",
        animation: "slide-up 0.7s 0.3s ease both", marginBottom: 80
      }}>
        <button onClick={() => scrollToSection("platform")} style={{
          background: "linear-gradient(135deg, #00b4ff 0%, #0057ff 100%)",
          border: "none", borderRadius: 10, padding: "15px 34px",
          color: "#fff", fontSize: 15, fontFamily: "'Syne', sans-serif",
          fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em",
          boxShadow: "0 0 30px rgba(0,180,255,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
          transition: "all 0.25s"
        }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 0 50px rgba(0,180,255,0.7), inset 0 1px 0 rgba(255,255,255,0.2)"; }}
          onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "0 0 30px rgba(0,180,255,0.5), inset 0 1px 0 rgba(255,255,255,0.2)"; }}
        >Explore Platform</button>
        <button onClick={() => scrollToSection("vision")} style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 10, padding: "15px 34px",
          color: "#fff", fontSize: 15, fontFamily: "'Syne', sans-serif",
          fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em",
          backdropFilter: "blur(10px)", transition: "all 0.25s"
        }}
          onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.08)"; e.target.style.transform = "translateY(-3px)"; }}
          onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.transform = "none"; }}
        >See Live Vision →</button>
      </div>

      {/* Stat cards */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
        width: "100%", maxWidth: 860, animation: "slide-up 0.7s 0.4s ease both"
      }}>
        {[
          { label: "Uptime Reliability", value: "99.9%", color: "#00b4ff", icon: "◉" },
          { label: "Multi-Node Intelligence", value: "∞ Nodes", color: "#ff6600", icon: "◈" },
          { label: "Adaptive Response", value: "< 80ms", color: "#00b4ff", icon: "◆" },
          { label: "Real-Time Coord.", value: "24 / 7", color: "#ff6600", icon: "◎" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: "20px 18px", backdropFilter: "blur(10px)",
            textAlign: "center", transition: "all 0.25s",
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`
          }}
            onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${s.color}44`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 10px 30px rgba(0,0,0,0.3), 0 0 20px ${s.color}22`; }}
            onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.05)"; }}
          >
            <div style={{ fontSize: 20, marginBottom: 6, color: s.color }}>{s.icon}</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────
function About() {
  const items = [
    { step: "01", title: "Disaster Strikes", text: "Conventional infrastructure collapses. Power grids fail, cell towers go dark, and traditional communication becomes impossible.", color: "#ff6600" },
    { step: "02", title: "Mesh Activates", text: "Nexus-Grid nodes instantly form a self-organizing, peer-to-peer emergency network — no central point of failure.", color: "#00b4ff" },
    { step: "03", title: "Coordination Begins", text: "First responders, NGOs, and civilians reconnect. Situational awareness, signal routing, and emergency alerts flow.", color: "#00b4ff" },
    { step: "04", title: "Crisis Resolved", text: "Resilient communication powers faster rescue, smarter coordination, and ultimately, more lives saved.", color: "#ff6600" },
  ];
  return (
    <section id="mission" style={{ padding: "100px max(24px, calc((100% - 1100px)/2))", position: "relative", scrollMarginTop: 90 }}>
      <SectionHeadingReveal
        badge="Mission Brief"
        title="Why Nexus-Grid Exists"
        subtitle="In disasters, communication collapses first. We rebuild awareness, trust, and coordination through resilient emergency infrastructure."
        badgeColor="#ff6600"
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
        {items.map((item, i) => (
          <ScrollReveal key={i} animation="cardRise" delay={i * 0.15} duration={0.9}>
            <MagneticCard
              intensity={10}
              style={{
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 18, padding: "32px 28px",
                backdropFilter: "blur(12px)",
                position: "relative", overflow: "hidden",
                height: "100%",
              }}
            >
              <div style={{
                fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 700,
                color: item.color, letterSpacing: "0.15em", marginBottom: 16, opacity: 0.8
              }}>PHASE {item.step}</div>
              <div style={{
                width: 2, height: 40, background: `linear-gradient(${item.color}, transparent)`,
                marginBottom: 20, borderRadius: 2
              }} />
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 12 }}>{item.title}</h3>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{item.text}</p>
              <div style={{
                position: "absolute", top: 24, right: 24,
                fontFamily: "'Orbitron', monospace", fontSize: 48, fontWeight: 900,
                color: "rgba(255,255,255,0.03)", lineHeight: 1
              }}>{item.step}</div>
            </MagneticCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

// ─── Core Capabilities ───────────────────────────────────────────────────────
const CAPABILITIES = [
  { icon: "⬡", title: "Adaptive Communication", desc: "Self-healing mesh protocol that reroutes signals around damaged nodes in real-time.", span: 2, accent: "#00b4ff" },
  { icon: "⚡", title: "Emergency Alert Routing", desc: "Priority-based signal escalation to ensure critical messages reach first responders instantly.", span: 1, accent: "#ff6600" },
  { icon: "◈", title: "Offline Resilience", desc: "Operates without internet or cellular infrastructure. Total independence from legacy systems.", span: 1, accent: "#00b4ff" },
  { icon: "◉", title: "Live Monitoring", desc: "Real-time situational awareness across all active nodes in your emergency network.", span: 2, accent: "#ff6600" },
  { icon: "◆", title: "Distributed Awareness", desc: "Decentralized intelligence — every node understands the whole picture.", span: 2, accent: "#00b4ff" },
  { icon: "⬢", title: "Crisis Coordination", desc: "Multi-agency, multi-team command integration for synchronized disaster response.", span: 1, accent: "#ff6600" },
  { icon: "⟲", title: "Smart Relay Logic", desc: "AI-powered hop selection maximizes signal integrity over degraded infrastructure.", span: 1, accent: "#00b4ff" },
  { icon: "⊕", title: "Secure Messaging", desc: "End-to-end encrypted emergency channels. Zero-compromise communications under fire.", span: 1, accent: "#ff6600" },
  { icon: "▣", title: "Response Visualization", desc: "Live tactical maps with node status, heat indicators, and resource tracking.", span: 1, accent: "#00b4ff" },
];

function Capabilities() {
  return (
    <section id="platform" style={{ padding: "100px max(24px, calc((100% - 1100px)/2))", position: "relative", scrollMarginTop: 90 }}>
      <style>{`
        .cap-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .cap-span-1 { grid-column: span 1; }
        .cap-span-2 { grid-column: span 2; }
        @media (max-width: 900px) {
          .cap-grid { grid-template-columns: repeat(2, 1fr); grid-auto-flow: dense; }
          .cap-span-2 { grid-column: span 2; }
        }
        @media (max-width: 600px) {
          .cap-grid { grid-template-columns: 1fr; }
          .cap-span-1, .cap-span-2 { grid-column: span 1 !important; }
        }
      `}</style>
      <SectionHeadingReveal
        badge="Core Capabilities"
        title="Built for the Edge of Chaos"
        subtitle="Every capability engineered for the moments when nothing else works."
        badgeColor="#00b4ff"
      />
      <div className="cap-grid">
        {CAPABILITIES.map((cap, i) => (
          <ScrollReveal
            key={i}
            animation={i % 3 === 0 ? "tilt3D" : i % 3 === 1 ? "cardRise" : "flipIn"}
            delay={i * 0.1}
            duration={0.85}
            className={cap.span === 2 ? "cap-span-2" : "cap-span-1"}
          >
            <MagneticCard
              intensity={8}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 18, padding: "30px 28px",
                backdropFilter: "blur(12px)",
                position: "relative", overflow: "hidden",
                height: "100%",
              }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: `linear-gradient(135deg, ${cap.accent}22, ${cap.accent}08)`,
                border: `1px solid ${cap.accent}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, marginBottom: 18, color: cap.accent
              }}>{cap.icon}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{cap.title}</h3>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{cap.desc}</p>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${cap.accent}40, transparent)`,
                opacity: 0
              }} className="cap-line" />
            </MagneticCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

// ─── Realistic Hardware Animations ────────────────────────────────────────────
function HowItWorks() {
  const [phase, setPhase] = useState(0);
  const [manualCmdIdx, setManualCmdIdx] = useState(null);
  const [isAuto, setIsAuto] = useState(true);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setPhase(p => p + 1), 80);
    return () => clearInterval(id);
  }, []);

  // Auto resume functionality after 8 seconds of inactivity
  useEffect(() => {
    if (isAuto) return;
    const checkTimeout = setInterval(() => {
      if (Date.now() - lastInteractionTime > 8000) {
        setIsAuto(true);
      }
    }, 1000);
    return () => clearInterval(checkTimeout);
  }, [isAuto, lastInteractionTime]);

  const handleSelectCommand = (idx) => {
    setManualCmdIdx(idx);
    setIsAuto(false);
    setLastInteractionTime(Date.now());
  };

  // Animated packet position along path (0→1 loop)
  const packet = (phase % 120) / 120;
  const packet2 = ((phase + 60) % 120) / 120;

  // Active command index based on mode (auto vs manual)
  const autoCmdIdx = Math.floor((phase % 120) / 40); // 0, 1, 2
  const currentCmdIdx = isAuto ? autoCmdIdx : (manualCmdIdx !== null ? manualCmdIdx : 0);

  const cmdColors = ["#ff3333", "#00e676", "#ff6600"];
  const cmdLabels = ["HELP ME", "I AM SAFE", "NEED MEDS"];

  const oled1Lines = [
    ["[MSG: SENDING]", "CMD: SEND HELP ME", "DEST: ALL_NODES", "TX_PWR: +20dBm"],
    ["[MSG: SENDING]", "CMD: SEND I AM SAFE", "DEST: ALL_NODES", "TX_PWR: +20dBm"],
    ["[MSG: SENDING]", "CMD: SEND NEED MEDS", "DEST: ALL_NODES", "TX_PWR: +20dBm"]
  ];

  const oled2Lines = [
    ["[ALERT RECV]", "RECV: * HELP ME *", "FROM: NODE_ROOT", "RSSI: -55 dBm"],
    ["[STATUS RECV]", "RECV: * I AM SAFE *", "FROM: NODE_ROOT", "RSSI: -52 dBm"],
    ["[ALERT RECV]", "RECV: * NEED MEDS *", "FROM: NODE_ROOT", "RSSI: -58 dBm"]
  ];

  return (
    <section id="how-it-works" style={{ padding: "100px max(24px, calc((100% - 1200px)/2))", position: "relative", scrollMarginTop: 90 }}>
      <style>{`
        @keyframes wifi-wave { 0% { opacity: 0.8; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
        @keyframes led-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
        @keyframes oled-cursor { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes screen-glow { 0%,100% { filter: drop-shadow(0 0 3px rgba(0,180,255,0.4)); } 50% { filter: drop-shadow(0 0 8px rgba(0,180,255,0.8)); } }
        @keyframes hw-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>

      <SectionHeadingReveal
        badge="Live Hardware Protocol"
        title="How Nexus-Grid Works"
        subtitle="Real ESP32 hardware communicating through mesh protocol — from phone to phone, board to board."
        badgeColor="#ff6600"
      />

      {/* ═══ ANIMATION 1: Phone → ESP32 → ESP32 → Phone ═══ */}
      <ScrollReveal animation="fadeUp" duration={1.0}>
      <div style={{
        background: "rgba(4,8,16,0.9)", border: "1px solid rgba(0,180,255,0.15)",
        borderRadius: 22, padding: "36px 24px 28px", marginBottom: 28,
        backdropFilter: "blur(16px)", position: "relative", overflow: "hidden",
        boxShadow: "0 0 60px rgba(0,180,255,0.08)"
      }}>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00b4ff",
          letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 10
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00b4ff", boxShadow: "0 0 8px #00b4ff" }} />
          ANIMATION 01 — Mobile Mesh Relay Protocol
        </div>

        <svg viewBox="0 0 1100 340" style={{ width: "100%", height: "auto", display: "block" }}>
          <defs>
            <filter id="glowBlue"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="glowOrange"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <linearGradient id="pcbGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a6b1a"/><stop offset="100%" stopColor="#0f4a0f"/>
            </linearGradient>
            <linearGradient id="phoneBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a2a3e"/><stop offset="100%" stopColor="#1a1a28"/>
            </linearGradient>
            <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0e1a"/><stop offset="100%" stopColor="#060a14"/>
            </linearGradient>
            <pattern id="hwGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,180,255,0.03)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="1100" height="340" fill="url(#hwGrid)"/>

          {/* ── PHONE A (left) ── */}
          <g transform="translate(30, 25) scale(1.35)">
            {/* Phone shadow */}
            <rect x="5" y="8" width="100" height="210" rx="18" fill="rgba(0,0,0,0.4)" filter="url(#glowBlue)"/>
            {/* Phone body */}
            <rect width="100" height="210" rx="18" fill="url(#phoneBody)" stroke="#444" strokeWidth="1.5"/>
            {/* Side buttons */}
            <rect x="-3" y="50" width="3" height="20" rx="1.5" fill="#555"/>
            <rect x="-3" y="80" width="3" height="30" rx="1.5" fill="#555"/>
            <rect x="100" y="65" width="3" height="25" rx="1.5" fill="#555"/>
            {/* Screen */}
            <rect x="6" y="28" width="88" height="158" rx="4" fill="url(#screenGrad)"/>
            {/* Status bar */}
            <rect x="6" y="28" width="88" height="16" rx="4" fill="rgba(0,180,255,0.05)"/>
            <text x="14" y="39" fontSize="6" fill="rgba(255,255,255,0.4)" fontFamily="'Space Mono',monospace">9:41</text>
            <text x="72" y="39" fontSize="6" fill="rgba(255,255,255,0.4)" fontFamily="'Space Mono',monospace">5G</text>
            {/* WiFi icon in status */}
            <g transform="translate(82,32)">
              <path d="M0,6 Q4,0 8,6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
              <path d="M1.5,4.5 Q4,1 6.5,4.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
              <circle cx="4" cy="6" r="1" fill="rgba(255,255,255,0.4)"/>
            </g>
            {/* Dynamic Island / Camera */}
            <rect x="30" y="10" width="40" height="12" rx="6" fill="#111" stroke="#222" strokeWidth="0.5"/>
            <circle cx="56" cy="16" r="3.5" fill="#1a1a2e" stroke="#333" strokeWidth="0.5"/>
            <circle cx="56" cy="16" r="1.5" fill="#0a0a1e"/>
            {/* Chat app content */}
            <rect x="12" y="50" width="76" height="12" rx="3" fill="rgba(0,180,255,0.06)" stroke="rgba(0,180,255,0.15)" strokeWidth="0.5"/>
            <text x="20" y="59" fontSize="6" fill="rgba(0,180,255,0.7)" fontFamily="'Space Mono',monospace">Nexus-Grid Chat</text>
            {/* Sent message */}
            <rect x="30" y="72" width="58" height="22" rx="8" fill="#00b4ff" opacity="0.85"/>
            <text x="36" y="83" fontSize="7" fill="#fff" fontFamily="'Syne',sans-serif" fontWeight="600">SOS - Zone Alpha</text>
            <text x="36" y="91" fontSize="5" fill="rgba(255,255,255,0.7)" fontFamily="'Space Mono',monospace">09:41 ✓✓</text>
            {/* Received message */}
            <rect x="12" y="102" width="54" height="22" rx="8" fill="rgba(255,255,255,0.08)"/>
            <text x="18" y="113" fontSize="7" fill="rgba(255,255,255,0.8)" fontFamily="'Syne',sans-serif">Copy. Deploying.</text>
            <text x="18" y="121" fontSize="5" fill="rgba(255,255,255,0.3)" fontFamily="'Space Mono',monospace">09:41</text>
            {/* Typing indicator */}
            {[0,1,2].map(d => (
              <circle key={d} cx={18 + d * 8} cy="134" r="2.5"
                fill="rgba(255,255,255,0.2)"
                opacity={phase % 30 < 10 + d * 5 ? 0.7 : 0.2}
              />
            ))}
            {/* Input bar */}
            <rect x="10" y="148" width="64" height="14" rx="7" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            <text x="16" y="158" fontSize="6" fill="rgba(255,255,255,0.25)" fontFamily="'Syne',sans-serif">Message...</text>
            <circle cx="82" cy="155" r="6" fill="#00b4ff" opacity="0.8"/>
            <path d="M79,155 L85,155 M82,152 L82,158" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
            {/* Bottom bar */}
            <rect x="30" y="196" width="40" height="4" rx="2" fill="#444"/>
            {/* Phone label */}
            <text x="50" y="235" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.6)" fontFamily="'Syne',sans-serif" fontWeight="600">User A</text>
            <text x="50" y="247" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="'Space Mono',monospace">iPhone · WiFi</text>
          </g>

          {/* ── WiFi waves: Phone A → ESP32-1 ── */}
          <g transform="translate(180, 155) scale(1.1)">
            {/* Backdrops for high contrast */}
            {[0,1,2].map(i => (
              <path key={`bg-${i}`} d={`M0,0 Q${20+i*12},-${15+i*10} ${40+i*24},0`}
                fill="none" stroke="#020408"
                strokeWidth={8 - i * 1.0}
                strokeLinecap="round"
              />
            ))}
            {/* Main glowing blue/dark-blue waves */}
            {[0,1,2].map(i => (
              <path key={i} d={`M0,0 Q${20+i*12},-${15+i*10} ${40+i*24},0`}
                fill="none" stroke={i === 0 ? "#0044ff" : "#0022aa"}
                strokeWidth={4 - i * 0.6}
                strokeLinecap="round"
                opacity={((phase + i * 15) % 45) < 25 ? 0.95 : 0.4}
              />
            ))}
            <text x="35" y="22" fontSize="7" fill="#0066ff" fontFamily="'Space Mono',monospace" textAnchor="middle" fontWeight="bold" style={{ letterSpacing: "0.05em" }}>WiFi 2.4GHz</text>
          </g>

          {/* ── ESP32 NODE 1 ── */}
          <g transform="translate(310, 95) scale(0.6)">
            {/* PCB shadow */}
            <rect x="4" y="6" width="130" height="220" rx="6" fill="rgba(0,0,0,0.5)"/>
            {/* PCB body */}
            <rect width="130" height="220" rx="6" fill="url(#pcbGreen)" stroke="#2a8a2a" strokeWidth="1"/>
            {/* PCB traces */}
            <line x1="20" y1="40" x2="110" y2="40" stroke="#2a8a2a" strokeWidth="0.5" opacity="0.5"/>
            <line x1="65" y1="30" x2="65" y2="190" stroke="#2a8a2a" strokeWidth="0.5" opacity="0.3"/>
            <line x1="20" y1="100" x2="110" y2="100" stroke="#2a8a2a" strokeWidth="0.5" opacity="0.3"/>
            <line x1="20" y1="150" x2="110" y2="150" stroke="#2a8a2a" strokeWidth="0.5" opacity="0.3"/>
            {/* Antenna area */}
            <rect x="10" y="6" width="110" height="30" rx="3" fill="rgba(0,0,0,0.15)"/>
            <path d="M25,12 L25,8 L40,8 L40,28 L60,28 L60,8 L80,8 L80,28 L100,28 L100,12" fill="none" stroke="#3a9a3a" strokeWidth="1.5"/>
            <text x="65" y="24" textAnchor="middle" fontSize="5" fill="#5ab55a" fontFamily="'Space Mono',monospace">ANT</text>
            {/* Main chip */}
            <rect x="25" y="65" width="80" height="55" rx="4" fill="#111" stroke="#333" strokeWidth="1"/>
            <rect x="30" y="70" width="70" height="45" rx="2" fill="#1a1a2a"/>
            <text x="65" y="89" textAnchor="middle" fontSize="10" fill="#555" fontFamily="'Orbitron',monospace" fontWeight="700">ESP32</text>
            <text x="65" y="101" textAnchor="middle" fontSize="6" fill="#444" fontFamily="'Space Mono',monospace">WROOM-32</text>
            {/* Chip dot marker */}
            <circle cx="33" cy="73" r="2" fill="#333"/>
            {/* Pin headers LEFT (15 pins) */}
            {Array.from({length: 15}, (_, i) => (
              <g key={`lp${i}`}>
                <rect x="-10" y={14 + i * 13} width="14" height="5" rx="1" fill="#c4a000" stroke="#a08000" strokeWidth="0.3"/>
                <rect x="-10" y={15 + i * 13} width="14" height="3" rx="0.5" fill="#d4b000"/>
              </g>
            ))}
            {/* Pin headers RIGHT (15 pins) */}
            {Array.from({length: 15}, (_, i) => (
              <g key={`rp${i}`}>
                <rect x="126" y={14 + i * 13} width="14" height="5" rx="1" fill="#c4a000" stroke="#a08000" strokeWidth="0.3"/>
                <rect x="126" y={15 + i * 13} width="14" height="3" rx="0.5" fill="#d4b000"/>
              </g>
            ))}
            {/* Pin labels (key pins) */}
            <text x="8" y="20" fontSize="4" fill="#6a6" fontFamily="'Space Mono',monospace">3V3</text>
            <text x="8" y="33" fontSize="4" fill="#6a6" fontFamily="'Space Mono',monospace">GND</text>
            <text x="8" y="46" fontSize="4" fill="#6a6" fontFamily="'Space Mono',monospace">D15</text>
            <text x="102" y="20" fontSize="4" fill="#6a6" fontFamily="'Space Mono',monospace" textAnchor="end">VIN</text>
            <text x="102" y="33" fontSize="4" fill="#6a6" fontFamily="'Space Mono',monospace" textAnchor="end">GND</text>
            <text x="102" y="46" fontSize="4" fill="#6a6" fontFamily="'Space Mono',monospace" textAnchor="end">D13</text>
            {/* USB-C port */}
            <rect x="40" y="200" width="50" height="16" rx="4" fill="#888" stroke="#666" strokeWidth="1"/>
            <rect x="48" y="204" width="34" height="8" rx="2" fill="#555"/>
            <text x="65" y="224" textAnchor="middle" fontSize="5" fill="#5ab55a" fontFamily="'Space Mono',monospace">USB-C</text>
            {/* LEDs */}
            <circle cx="18" cy="180" r="3.5" fill={phase % 20 < 10 ? "#ff3333" : "#661111"} stroke="#333" strokeWidth="0.5"/>
            <circle cx="30" cy="180" r="3.5" fill={phase % 15 < 8 ? "#33ff33" : "#116611"} stroke="#333" strokeWidth="0.5"/>
            <text x="18" y="190" fontSize="4" fill="#5ab55a" fontFamily="'Space Mono',monospace" textAnchor="middle">PWR</text>
            <text x="30" y="190" fontSize="4" fill="#5ab55a" fontFamily="'Space Mono',monospace" textAnchor="middle">TX</text>
            {/* Reset button */}
            <rect x="90" y="170" width="16" height="10" rx="2" fill="#444" stroke="#555" strokeWidth="0.5"/>
            <rect x="93" y="172" width="10" height="6" rx="1" fill="#333"/>
            <text x="98" y="186" fontSize="4" fill="#5ab55a" fontFamily="'Space Mono',monospace" textAnchor="middle">RST</text>
            {/* Labels */}
            <text x="65" y="248" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.6)" fontFamily="'Syne',sans-serif" fontWeight="600">ESP32 Node 1</text>
            <text x="65" y="260" textAnchor="middle" fontSize="7" fill="#ff6600" fontFamily="'Space Mono',monospace">ROOT · 24:6F:28:A1:B3:C0</text>
          </g>

          {/* ── ESP-NOW Mesh Link (center) ── */}
          <g transform="translate(450, 100)">
            {/* Connection line backdrop - thick dark line to contrast grid */}
            <line x1="0" y1="60" x2="200" y2="60" stroke="#020408" strokeWidth="10" strokeLinecap="round" />
            {/* Bold dark navy/blue conduit line */}
            <line x1="0" y1="60" x2="200" y2="60" stroke="#002288" strokeWidth="7" strokeLinecap="round" />
            {/* Deep rich blue inner core */}
            <line x1="0" y1="60" x2="200" y2="60" stroke="#0055ff" strokeWidth="3" strokeDasharray="15,8" strokeLinecap="round" />
            {/* Animated pulse along line */}
            <circle cx={packet * 200} cy="60" r="5" fill="#00b4ff" opacity="0.9" filter="url(#glowBlue)"/>
            <circle cx={packet * 200} cy="60" r="2" fill="#fff"/>
            {/* Return packet */}
            <circle cx={200 - packet2 * 200} cy="60" r="4" fill="#ff6600" opacity="0.8" filter="url(#glowOrange)"/>
            <circle cx={200 - packet2 * 200} cy="60" r="1.5" fill="#fff"/>
            {/* WiFi waves in middle */}
            {[0,1,2].map(i => (
              <g key={i} transform={`translate(100, 60)`}>
                <circle r={12 + i * 10} fill="none" stroke="#0055ff"
                  strokeWidth={1.5 - i * 0.3}
                  strokeDasharray="4,4"
                  opacity={((phase + i * 20) % 60) < 35 ? 0.5 - i * 0.1 : 0.05}
                />
              </g>
            ))}
            {/* Protocol label */}
            <rect x="60" y="30" width="80" height="20" rx="4" fill="rgba(0,180,255,0.1)" stroke="rgba(0,180,255,0.3)" strokeWidth="0.5"/>
            <text x="100" y="44" textAnchor="middle" fontSize="8" fill="#0066ff" fontFamily="'Space Mono',monospace" fontWeight="bold">ESP-NOW</text>
            <text x="100" y="90" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="'Space Mono',monospace">painlessMesh · CH6</text>
            {/* Data label */}
            <text x="100" y="105" textAnchor="middle" fontSize="6" fill="rgba(255,100,0,0.5)" fontFamily="'Space Mono',monospace">↔ bidirectional · encrypted</text>
          </g>

          {/* ── ESP32 NODE 2 ── */}
          <g transform="translate(710, 95) scale(0.6)">
            <rect x="4" y="6" width="130" height="220" rx="6" fill="rgba(0,0,0,0.5)"/>
            <rect width="130" height="220" rx="6" fill="url(#pcbGreen)" stroke="#2a8a2a" strokeWidth="1"/>
            <line x1="20" y1="40" x2="110" y2="40" stroke="#2a8a2a" strokeWidth="0.5" opacity="0.5"/>
            <line x1="65" y1="30" x2="65" y2="190" stroke="#2a8a2a" strokeWidth="0.5" opacity="0.3"/>
            <line x1="20" y1="100" x2="110" y2="100" stroke="#2a8a2a" strokeWidth="0.5" opacity="0.3"/>
            <line x1="20" y1="150" x2="110" y2="150" stroke="#2a8a2a" strokeWidth="0.5" opacity="0.3"/>
            <rect x="10" y="6" width="110" height="30" rx="3" fill="rgba(0,0,0,0.15)"/>
            <path d="M25,12 L25,8 L40,8 L40,28 L60,28 L60,8 L80,8 L80,28 L100,28 L100,12" fill="none" stroke="#3a9a3a" strokeWidth="1.5"/>
            <text x="65" y="24" textAnchor="middle" fontSize="5" fill="#5ab55a" fontFamily="'Space Mono',monospace">ANT</text>
            <rect x="25" y="65" width="80" height="55" rx="4" fill="#111" stroke="#333" strokeWidth="1"/>
            <rect x="30" y="70" width="70" height="45" rx="2" fill="#1a1a2a"/>
            <text x="65" y="89" textAnchor="middle" fontSize="10" fill="#555" fontFamily="'Orbitron',monospace" fontWeight="700">ESP32</text>
            <text x="65" y="101" textAnchor="middle" fontSize="6" fill="#444" fontFamily="'Space Mono',monospace">WROOM-32</text>
            <circle cx="33" cy="73" r="2" fill="#333"/>
            {Array.from({length: 15}, (_, i) => (
              <g key={`lp2${i}`}>
                <rect x="-10" y={14 + i * 13} width="14" height="5" rx="1" fill="#c4a000" stroke="#a08000" strokeWidth="0.3"/>
                <rect x="-10" y={15 + i * 13} width="14" height="3" rx="0.5" fill="#d4b000"/>
              </g>
            ))}
            {Array.from({length: 15}, (_, i) => (
              <g key={`rp2${i}`}>
                <rect x="126" y={14 + i * 13} width="14" height="5" rx="1" fill="#c4a000" stroke="#a08000" strokeWidth="0.3"/>
                <rect x="126" y={15 + i * 13} width="14" height="3" rx="0.5" fill="#d4b000"/>
              </g>
            ))}
            <text x="8" y="20" fontSize="4" fill="#6a6" fontFamily="'Space Mono',monospace">3V3</text>
            <text x="8" y="33" fontSize="4" fill="#6a6" fontFamily="'Space Mono',monospace">GND</text>
            <text x="102" y="20" fontSize="4" fill="#6a6" fontFamily="'Space Mono',monospace" textAnchor="end">VIN</text>
            <rect x="40" y="200" width="50" height="16" rx="4" fill="#888" stroke="#666" strokeWidth="1"/>
            <rect x="48" y="204" width="34" height="8" rx="2" fill="#555"/>
            <circle cx="18" cy="180" r="3.5" fill={phase % 18 < 9 ? "#ff3333" : "#661111"} stroke="#333" strokeWidth="0.5"/>
            <circle cx="30" cy="180" r="3.5" fill={phase % 12 < 6 ? "#33ff33" : "#116611"} stroke="#333" strokeWidth="0.5"/>
            <text x="18" y="190" fontSize="4" fill="#5ab55a" fontFamily="'Space Mono',monospace" textAnchor="middle">PWR</text>
            <text x="30" y="190" fontSize="4" fill="#5ab55a" fontFamily="'Space Mono',monospace" textAnchor="middle">RX</text>
            <rect x="90" y="170" width="16" height="10" rx="2" fill="#444" stroke="#555" strokeWidth="0.5"/>
            <rect x="93" y="172" width="10" height="6" rx="1" fill="#333"/>
            <text x="65" y="248" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.6)" fontFamily="'Syne',sans-serif" fontWeight="600">ESP32 Node 2</text>
            <text x="65" y="260" textAnchor="middle" fontSize="7" fill="#00b4ff" fontFamily="'Space Mono',monospace">RELAY · 24:6F:28:A1:B3:C1</text>
          </g>

          {/* ── WiFi waves: ESP32-2 → Phone B ── */}
          <g transform="translate(805, 155) scale(1.1)">
            {/* Backdrops for high contrast */}
            {[0,1,2].map(i => (
              <path key={`bg-${i}`} d={`M0,0 Q${20+i*12},-${15+i*10} ${40+i*24},0`}
                fill="none" stroke="#020408"
                strokeWidth={8 - i * 1.0}
                strokeLinecap="round"
              />
            ))}
            {/* Main glowing blue/dark-blue waves */}
            {[0,1,2].map(i => (
              <path key={i} d={`M0,0 Q${20+i*12},-${15+i*10} ${40+i*24},0`}
                fill="none" stroke={i === 0 ? "#0044ff" : "#0022aa"}
                strokeWidth={4 - i * 0.6}
                strokeLinecap="round"
                opacity={((phase + 30 + i * 15) % 45) < 25 ? 0.95 : 0.4}
              />
            ))}
            <text x="35" y="22" fontSize="7" fill="#0066ff" fontFamily="'Space Mono',monospace" textAnchor="middle" fontWeight="bold" style={{ letterSpacing: "0.05em" }}>WiFi 2.4GHz</text>
          </g>

          {/* ── PHONE B (right) ── */}
          <g transform="translate(930, 25) scale(1.35)">
            <rect x="5" y="8" width="100" height="210" rx="18" fill="rgba(0,0,0,0.4)" filter="url(#glowBlue)"/>
            <rect width="100" height="210" rx="18" fill="url(#phoneBody)" stroke="#444" strokeWidth="1.5"/>
            <rect x="-3" y="50" width="3" height="20" rx="1.5" fill="#555"/>
            <rect x="-3" y="80" width="3" height="30" rx="1.5" fill="#555"/>
            <rect x="100" y="65" width="3" height="25" rx="1.5" fill="#555"/>
            <rect x="6" y="28" width="88" height="158" rx="4" fill="url(#screenGrad)"/>
            <rect x="6" y="28" width="88" height="16" rx="4" fill="rgba(0,180,255,0.05)"/>
            <text x="14" y="39" fontSize="6" fill="rgba(255,255,255,0.4)" fontFamily="'Space Mono',monospace">9:41</text>
            <text x="72" y="39" fontSize="6" fill="rgba(255,255,255,0.4)" fontFamily="'Space Mono',monospace">5G</text>
            <rect x="30" y="10" width="40" height="12" rx="6" fill="#111" stroke="#222" strokeWidth="0.5"/>
            <circle cx="56" cy="16" r="3.5" fill="#1a1a2e" stroke="#333" strokeWidth="0.5"/>
            <circle cx="56" cy="16" r="1.5" fill="#0a0a1e"/>
            <rect x="12" y="50" width="76" height="12" rx="3" fill="rgba(0,180,255,0.06)" stroke="rgba(0,180,255,0.15)" strokeWidth="0.5"/>
            <text x="20" y="59" fontSize="6" fill="rgba(0,180,255,0.7)" fontFamily="'Space Mono',monospace">Nexus-Grid Chat</text>
            {/* Received message (from Phone A) */}
            <rect x="12" y="72" width="58" height="22" rx="8" fill="rgba(255,255,255,0.08)"/>
            <text x="18" y="83" fontSize="7" fill="rgba(255,255,255,0.8)" fontFamily="'Syne',sans-serif">SOS - Zone Alpha</text>
            <text x="18" y="91" fontSize="5" fill="rgba(255,255,255,0.3)" fontFamily="'Space Mono',monospace">09:41</text>
            {/* Reply sent */}
            <rect x="30" y="102" width="58" height="22" rx="8" fill="#ff6600" opacity="0.8"/>
            <text x="36" y="113" fontSize="7" fill="#fff" fontFamily="'Syne',sans-serif" fontWeight="600">Copy. Deploying.</text>
            <text x="36" y="121" fontSize="5" fill="rgba(255,255,255,0.7)" fontFamily="'Space Mono',monospace">09:41 ✓✓</text>
            {/* Map preview */}
            <rect x="12" y="132" width="76" height="36" rx="4" fill="rgba(0,180,255,0.05)" stroke="rgba(0,180,255,0.1)" strokeWidth="0.5"/>
            <text x="50" y="146" textAnchor="middle" fontSize="5" fill="rgba(0,180,255,0.5)" fontFamily="'Space Mono',monospace">◉ Live Mesh Map</text>
            <circle cx="30" cy="156" r="2" fill="#00b4ff" opacity="0.6"/>
            <circle cx="50" cy="160" r="2" fill="#ff6600" opacity="0.6"/>
            <circle cx="70" cy="153" r="2" fill="#00e676" opacity="0.6"/>
            <line x1="30" y1="156" x2="50" y2="160" stroke="rgba(0,180,255,0.3)" strokeWidth="0.5"/>
            <line x1="50" y1="160" x2="70" y2="153" stroke="rgba(0,180,255,0.3)" strokeWidth="0.5"/>
            <rect x="30" y="196" width="40" height="4" rx="2" fill="#444"/>
            <text x="50" y="235" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.6)" fontFamily="'Syne',sans-serif" fontWeight="600">User B</text>
            <text x="50" y="247" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="'Space Mono',monospace">Android · WiFi</text>
          </g>

          {/* ── Flow direction arrows ── */}
          <g>
            <text x="550" y="25" textAnchor="middle" fontSize="9" fill="rgba(0,180,255,0.5)" fontFamily="'Space Mono',monospace">
              📱 → ⚡ ESP-NOW MESH ⚡ → 📱
            </text>
          </g>
        </svg>
      </div>
      </ScrollReveal>

      {/* ═══ ANIMATION 2: Breadboard + OLED ↔ Breadboard + OLED ═══ */}
      <ScrollReveal animation="fadeUp" duration={1.0} delay={0.1}>
      <div style={{
        background: "rgba(4,8,16,0.9)", border: "1px solid rgba(255,100,0,0.15)",
        borderRadius: 22, padding: "36px 24px 28px",
        backdropFilter: "blur(16px)", position: "relative", overflow: "hidden",
        boxShadow: "0 0 60px rgba(255,100,0,0.06)"
      }}>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#ff6600",
          letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 10
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff6600", boxShadow: "0 0 8px #ff6600" }} />
          ANIMATION 02 — Breadboard-to-Breadboard OLED Bridge
        </div>

        <svg viewBox="0 0 1100 420" style={{ width: "100%", height: "auto", display: "block" }}>
          <rect width="1100" height="420" fill="url(#hwGrid)"/>

          {/* ── BREADBOARD SETUP 1 (left) ── */}
          <g transform="translate(30, 30)">
            {/* Breadboard body */}
            <rect x="0" y="0" width="400" height="300" rx="8" fill="#e8e4d8" stroke="#ccc" strokeWidth="1.5"/>
            {/* Power rails top */}
            <rect x="10" y="10" width="380" height="30" rx="3" fill="#ddd8cc"/>
            <line x1="15" y1="18" x2="385" y2="18" stroke="#e44" strokeWidth="1" opacity="0.6"/>
            <text x="12" y="17" fontSize="5" fill="#e44" fontFamily="'Space Mono',monospace">+</text>
            <line x1="15" y1="32" x2="385" y2="32" stroke="#44e" strokeWidth="1" opacity="0.6"/>
            <text x="12" y="35" fontSize="5" fill="#44e" fontFamily="'Space Mono',monospace">−</text>
            {/* Power rail holes top */}
            {Array.from({length: 50}, (_, i) => (
              <g key={`pt${i}`}>
                <circle cx={20 + i * 7.4} cy="18" r="1.5" fill="#bbb" stroke="#aaa" strokeWidth="0.3"/>
                <circle cx={20 + i * 7.4} cy="32" r="1.5" fill="#bbb" stroke="#aaa" strokeWidth="0.3"/>
              </g>
            ))}
            {/* Main hole grid — top half */}
            {Array.from({length: 5}, (_, row) =>
              Array.from({length: 50}, (_, col) => (
                <circle key={`t${row}-${col}`}
                  cx={20 + col * 7.4} cy={55 + row * 10}
                  r="1.5" fill="#bbb" stroke="#aaa" strokeWidth="0.3"/>
              ))
            )}
            {/* DIP channel gap */}
            <rect x="10" y="108" width="380" height="14" rx="2" fill="#d8d4c8"/>
            <text x="200" y="118" textAnchor="middle" fontSize="5" fill="#999" fontFamily="'Space Mono',monospace">— DIP CHANNEL —</text>
            {/* Main hole grid — bottom half */}
            {Array.from({length: 5}, (_, row) =>
              Array.from({length: 50}, (_, col) => (
                <circle key={`b${row}-${col}`}
                  cx={20 + col * 7.4} cy={130 + row * 10}
                  r="1.5" fill="#bbb" stroke="#aaa" strokeWidth="0.3"/>
              ))
            )}
            {/* Power rails bottom */}
            <rect x="10" y="190" width="380" height="30" rx="3" fill="#ddd8cc"/>
            <line x1="15" y1="198" x2="385" y2="198" stroke="#e44" strokeWidth="1" opacity="0.6"/>
            <line x1="15" y1="212" x2="385" y2="212" stroke="#44e" strokeWidth="1" opacity="0.6"/>
            {Array.from({length: 50}, (_, i) => (
              <g key={`pb${i}`}>
                <circle cx={20 + i * 7.4} cy="198" r="1.5" fill="#bbb" stroke="#aaa" strokeWidth="0.3"/>
                <circle cx={20 + i * 7.4} cy="212" r="1.5" fill="#bbb" stroke="#aaa" strokeWidth="0.3"/>
              </g>
            ))}

            {/* ── ESP32 on breadboard (spanning DIP channel) ── */}
            <g transform="translate(60, 48)">
              <rect width="65" height="130" rx="3" fill="#145214" stroke="#1a6a1a" strokeWidth="1"/>
              {/* Chip */}
              <rect x="10" y="30" width="45" height="30" rx="2" fill="#111" stroke="#333" strokeWidth="0.5"/>
              <text x="32" y="49" textAnchor="middle" fontSize="7" fill="#555" fontFamily="'Orbitron',monospace" fontWeight="700">ESP32</text>
              {/* Antenna */}
              <path d="M15,5 L15,2 L50,2 L50,20" fill="none" stroke="#2a7a2a" strokeWidth="1"/>
              {/* USB port */}
              <rect x="18" y="115" width="28" height="10" rx="2" fill="#888"/>
              {/* LEDs */}
              <circle cx="12" cy="100" r="2.5" fill={phase % 20 < 10 ? "#ff3333" : "#661111"}/>
              <circle cx="20" cy="100" r="2.5" fill={phase % 14 < 7 ? "#33ff33" : "#116611"}/>
              {/* Pin representations */}
              {Array.from({length: 15}, (_, i) => (
                <g key={`ep${i}`}>
                  <rect x="-4" y={8 + i * 8} width="5" height="3" rx="0.5" fill="#c4a000"/>
                  <rect x="64" y={8 + i * 8} width="5" height="3" rx="0.5" fill="#c4a000"/>
                </g>
              ))}
            </g>

            {/* ── OLED Display (on breadboard) ── */}
            <g transform="translate(220, 50)">
              {/* OLED PCB */}
              <rect width="130" height="90" rx="4" fill="#1a1a2e" stroke="#333" strokeWidth="1"/>
              {/* OLED screen */}
              <rect x="8" y="8" width="114" height="58" rx="2" fill="#000" stroke="#222" strokeWidth="0.5"/>
              {/* Screen content — glowing text */}
              <rect x="10" y="10" width="110" height="54" rx="1" fill="#000a14" style={{ animation: "screen-glow 3s ease infinite" }}/>
              {oled1Lines[currentCmdIdx].map((line, i) => (
                <text key={i} x="16" y={24 + i * 12} fontSize="8" fill={cmdColors[currentCmdIdx]} fontFamily="'Space Mono',monospace" opacity="0.9">
                  {line}
                </text>
              ))}
              {/* Cursor blink */}
              <rect x={16 + oled1Lines[currentCmdIdx][3].length * 4.8} y={46} width="5" height="9" fill={cmdColors[currentCmdIdx]}
                opacity={phase % 20 < 10 ? 0.8 : 0}/>
              {/* OLED label */}
              <text x="65" y="80" textAnchor="middle" fontSize="6" fill="#555" fontFamily="'Space Mono',monospace">SSD1306 · 128×64 · I2C</text>
              {/* OLED pins (4 pins: VCC, GND, SCL, SDA) */}
              {["VCC", "GND", "SCL", "SDA"].map((pin, i) => (
                <g key={pin}>
                  <rect x={25 + i * 22} y="90" width="10" height="14" rx="1" fill="#c4a000" stroke="#a08000" strokeWidth="0.3"/>
                  <text x={30 + i * 22} y="110" fontSize="5" fill="#666" fontFamily="'Space Mono',monospace" textAnchor="middle">{pin}</text>
                </g>
              ))}
            </g>

            {/* ── Jumper wires (ESP32 → OLED) ── */}
            <path d="M125,78 C170,78 180,68 220,60" fill="none" stroke="#e44" strokeWidth="2" strokeLinecap="round"/>
            <path d="M125,86 C170,86 185,78 220,72" fill="none" stroke="#22e" strokeWidth="2" strokeLinecap="round"/>
            <path d="M125,94 C175,94 190,100 242,140" fill="none" stroke="#ee0" strokeWidth="2" strokeLinecap="round"/>
            <path d="M125,102 C175,102 195,110 264,140" fill="none" stroke="#0c0" strokeWidth="2" strokeLinecap="round"/>

            {/* ── Jumper wires (ESP32 → Push Buttons) ── */}
            <path d="M124,136 C135,136 140,130 150,130" fill="none" stroke="#ff3333" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
            <path d="M124,144 C150,144 160,130 180,130" fill="none" stroke="#00e676" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
            <path d="M124,152 C165,152 180,130 210,130" fill="none" stroke="#ff6600" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>

            {/* ── Push Buttons (Click to transmit) ── */}
            {cmdLabels.map((label, idx) => {
              const bx = 150 + idx * 30; // 150, 180, 210
              const by = 145;
              const color = cmdColors[idx];
              const isActive = currentCmdIdx === idx;
              return (
                <g 
                  key={idx} 
                  cursor="pointer" 
                  onClick={() => handleSelectCommand(idx)}
                  onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.2)"}
                  onMouseLeave={e => e.currentTarget.style.filter = "none"}
                  style={{
                    transform: isActive ? "scale(0.95)" : "none",
                    transformOrigin: `${bx}px ${by}px`,
                    transition: "all 0.15s ease"
                  }}
                >
                  {/* Button label */}
                  <text x={bx} y={by - 12} fontSize="5.5" fill={isActive ? color : "rgba(255,255,255,0.4)"} fontFamily="'Space Mono', monospace" textAnchor="middle" fontWeight={isActive ? "bold" : "normal"}>
                    {idx === 0 ? "HELP" : idx === 1 ? "SAFE" : "MEDS"}
                  </text>

                  {/* Switch Base */}
                  <rect x={bx - 8} y={by - 8} width="16" height="16" rx="2" fill="#222" stroke={isActive ? color : "#444"} strokeWidth="1" />
                  
                  {/* Metal terminals/legs */}
                  <rect x={bx - 10} y={by - 5} width="2" height="2" fill="#888" />
                  <rect x={bx + 8} y={by - 5} width="2" height="2" fill="#888" />
                  <rect x={bx - 10} y={by + 3} width="2" height="2" fill="#888" />
                  <rect x={bx + 8} y={by + 3} width="2" height="2" fill="#888" />

                  {/* Outer collar */}
                  <circle cx={bx} cy={by} r="6" fill="#111" stroke="#333" strokeWidth="0.5" />
                  
                  {/* Button plunger */}
                  <circle cx={bx} cy={by} r="4.5" fill={color} />
                  
                  {/* Metallic contact center */}
                  <circle cx={bx} cy={by} r="2" fill="#fff" opacity="0.4" />

                  {/* Glowing active ring */}
                  <circle cx={bx} cy={by} r="7.5" fill="none" stroke={color} strokeWidth="1.5" 
                    opacity={isActive ? 0.7 : 0} 
                    style={{ animation: isActive ? "led-blink 1s infinite" : "none" }}
                  />
                </g>
              );
            })}

            {/* Breadboard label */}
            <text x="200" y="245" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.5)" fontFamily="'Syne',sans-serif" fontWeight="600">Station A — Sensor Node</text>
            <text x="200" y="258" textAnchor="middle" fontSize="7" fill="rgba(255,100,0,0.5)" fontFamily="'Space Mono',monospace">ESP32 + SSD1306 OLED · I2C Bus</text>
          </g>

          {/* ── WIRELESS BRIDGE (center) ── */}
          <g transform="translate(470, 100)">
            {/* Connection line backdrop - thick dark line to contrast grid */}
            <line x1="0" y1="80" x2="160" y2="80" stroke="#020408" strokeWidth="8" strokeLinecap="round" />
            {/* Bold dark amber conduit line */}
            <line x1="0" y1="80" x2="160" y2="80" stroke="#b33600" strokeWidth="5.5" strokeLinecap="round" opacity="0.95" />
            {/* Rich amber/orange inner core */}
            <line x1="0" y1="80" x2="160" y2="80" stroke="#ff6600" strokeWidth="2" strokeDasharray="10,6" strokeLinecap="round" />
            {/* Animated data packets */}
            <circle cx={packet * 160} cy="80" r="6" fill={cmdColors[currentCmdIdx]} opacity="0.8" filter={currentCmdIdx === 1 ? "url(#glowBlue)" : "url(#glowOrange)"}/>
            <circle cx={packet * 160} cy="80" r="2.5" fill="#fff"/>
            <circle cx={160 - packet2 * 160} cy="80" r="5" fill="#00b4ff" opacity="0.7" filter="url(#glowBlue)"/>
            <circle cx={160 - packet2 * 160} cy="80" r="2" fill="#fff"/>
            {/* WiFi waves */}
            {[0,1,2,3].map(i => (
              <g key={i} transform="translate(80, 80)">
                <circle r={14 + i * 12} fill="none" stroke={cmdColors[currentCmdIdx]}
                  strokeWidth={1.5 - i * 0.25}
                  strokeDasharray="5,5"
                  opacity={((phase + i * 18) % 72) < 40 ? 0.45 - i * 0.08 : 0.03}
                />
              </g>
            ))}
            {/* Protocol label */}
            <rect x="35" y="40" width="90" height="24" rx="6" fill="rgba(255,100,0,0.1)" stroke="rgba(255,100,0,0.3)" strokeWidth="0.5"/>
            <text x="80" y="50" textAnchor="middle" fontSize="7" fill={cmdColors[currentCmdIdx]} fontFamily="'Orbitron',monospace" fontWeight="700">ESP-NOW</text>
            <text x="80" y="59" textAnchor="middle" fontSize="5" fill="rgba(255,100,0,0.5)" fontFamily="'Space Mono',monospace">MESH BRIDGE</text>
            <text x="80" y="115" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.25)" fontFamily="'Space Mono',monospace">2.4GHz · AES-128</text>
            <text x="80" y="128" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.2)" fontFamily="'Space Mono',monospace">Latency: ~{18 + (phase % 8)}ms</text>
          </g>

          {/* ── BREADBOARD SETUP 2 (right) ── */}
          <g transform="translate(670, 30)">
            <rect x="0" y="0" width="400" height="300" rx="8" fill="#e8e4d8" stroke="#ccc" strokeWidth="1.5"/>
            <rect x="10" y="10" width="380" height="30" rx="3" fill="#ddd8cc"/>
            <line x1="15" y1="18" x2="385" y2="18" stroke="#e44" strokeWidth="1" opacity="0.6"/>
            <text x="12" y="17" fontSize="5" fill="#e44" fontFamily="'Space Mono',monospace">+</text>
            <line x1="15" y1="32" x2="385" y2="32" stroke="#44e" strokeWidth="1" opacity="0.6"/>
            <text x="12" y="35" fontSize="5" fill="#44e" fontFamily="'Space Mono',monospace">−</text>
            {Array.from({length: 50}, (_, i) => (
              <g key={`pt2${i}`}>
                <circle cx={20 + i * 7.4} cy="18" r="1.5" fill="#bbb" stroke="#aaa" strokeWidth="0.3"/>
                <circle cx={20 + i * 7.4} cy="32" r="1.5" fill="#bbb" stroke="#aaa" strokeWidth="0.3"/>
              </g>
            ))}
            {Array.from({length: 5}, (_, row) =>
              Array.from({length: 50}, (_, col) => (
                <circle key={`t2${row}-${col}`}
                  cx={20 + col * 7.4} cy={55 + row * 10}
                  r="1.5" fill="#bbb" stroke="#aaa" strokeWidth="0.3"/>
              ))
            )}
            <rect x="10" y="108" width="380" height="14" rx="2" fill="#d8d4c8"/>
            <text x="200" y="118" textAnchor="middle" fontSize="5" fill="#999" fontFamily="'Space Mono',monospace">— DIP CHANNEL —</text>
            {Array.from({length: 5}, (_, row) =>
              Array.from({length: 50}, (_, col) => (
                <circle key={`b2${row}-${col}`}
                  cx={20 + col * 7.4} cy={130 + row * 10}
                  r="1.5" fill="#bbb" stroke="#aaa" strokeWidth="0.3"/>
              ))
            )}
            <rect x="10" y="190" width="380" height="30" rx="3" fill="#ddd8cc"/>
            <line x1="15" y1="198" x2="385" y2="198" stroke="#e44" strokeWidth="1" opacity="0.6"/>
            <line x1="15" y1="212" x2="385" y2="212" stroke="#44e" strokeWidth="1" opacity="0.6"/>
            {Array.from({length: 50}, (_, i) => (
              <g key={`pb2${i}`}>
                <circle cx={20 + i * 7.4} cy="198" r="1.5" fill="#bbb" stroke="#aaa" strokeWidth="0.3"/>
                <circle cx={20 + i * 7.4} cy="212" r="1.5" fill="#bbb" stroke="#aaa" strokeWidth="0.3"/>
              </g>
            ))}

            {/* ESP32 on breadboard 2 */}
            <g transform="translate(60, 48)">
              <rect width="65" height="130" rx="3" fill="#145214" stroke="#1a6a1a" strokeWidth="1"/>
              <rect x="10" y="30" width="45" height="30" rx="2" fill="#111" stroke="#333" strokeWidth="0.5"/>
              <text x="32" y="49" textAnchor="middle" fontSize="7" fill="#555" fontFamily="'Orbitron',monospace" fontWeight="700">ESP32</text>
              <path d="M15,5 L15,2 L50,2 L50,20" fill="none" stroke="#2a7a2a" strokeWidth="1"/>
              <rect x="18" y="115" width="28" height="10" rx="2" fill="#888"/>
              <circle cx="12" cy="100" r="2.5" fill={phase % 22 < 11 ? "#ff3333" : "#661111"}/>
              <circle cx="20" cy="100" r="2.5" fill={phase % 16 < 8 ? "#33ff33" : "#116611"}/>
              {Array.from({length: 15}, (_, i) => (
                <g key={`ep2${i}`}>
                  <rect x="-4" y={8 + i * 8} width="5" height="3" rx="0.5" fill="#c4a000"/>
                  <rect x="64" y={8 + i * 8} width="5" height="3" rx="0.5" fill="#c4a000"/>
                </g>
              ))}
            </g>

            {/* OLED Display 2 */}
            <g transform="translate(220, 50)">
              <rect width="130" height="90" rx="4" fill="#1a1a2e" stroke="#333" strokeWidth="1"/>
              <rect x="8" y="8" width="114" height="58" rx="2" fill="#000" stroke="#222" strokeWidth="0.5"/>
              <rect x="10" y="10" width="110" height="54" rx="1" fill="#000a14" style={{ animation: "screen-glow 3s ease infinite" }}/>
              {oled2Lines[currentCmdIdx].map((line, i) => (
                <text key={i} x="16" y={24 + i * 12} fontSize="8" fill={cmdColors[currentCmdIdx]} fontFamily="'Space Mono',monospace" opacity="0.9">
                  {line}
                </text>
              ))}
              <rect x={16 + oled2Lines[currentCmdIdx][3].length * 4.8} y={46} width="5" height="9" fill={cmdColors[currentCmdIdx]}
                opacity={phase % 20 < 10 ? 0.8 : 0}/>
              <text x="65" y="80" textAnchor="middle" fontSize="6" fill="#555" fontFamily="'Space Mono',monospace">SSD1306 · 128×64 · I2C</text>
              {["VCC", "GND", "SCL", "SDA"].map((pin, i) => (
                <g key={pin}>
                  <rect x={25 + i * 22} y="90" width="10" height="14" rx="1" fill="#c4a000" stroke="#a08000" strokeWidth="0.3"/>
                  <text x={30 + i * 22} y="110" fontSize="5" fill="#666" fontFamily="'Space Mono',monospace" textAnchor="middle">{pin}</text>
                </g>
              ))}
            </g>

            {/* Jumper wires */}
            <path d="M125,78 C170,78 180,68 220,60" fill="none" stroke="#e44" strokeWidth="2" strokeLinecap="round"/>
            <path d="M125,86 C170,86 185,78 220,72" fill="none" stroke="#22e" strokeWidth="2" strokeLinecap="round"/>
            <path d="M125,94 C175,94 190,100 242,140" fill="none" stroke="#ee0" strokeWidth="2" strokeLinecap="round"/>
            <path d="M125,102 C175,102 195,110 264,140" fill="none" stroke="#0c0" strokeWidth="2" strokeLinecap="round"/>

            {/* ── Jumper wires (ESP32 → Push Buttons) ── */}
            <path d="M124,136 C135,136 140,130 150,130" fill="none" stroke="#ff3333" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
            <path d="M124,144 C150,144 160,130 180,130" fill="none" stroke="#00e676" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
            <path d="M124,152 C165,152 180,130 210,130" fill="none" stroke="#ff6600" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>

            {/* ── Push Buttons (Click to transmit) ── */}
            {cmdLabels.map((label, idx) => {
              const bx = 150 + idx * 30; // 150, 180, 210
              const by = 145;
              const color = cmdColors[idx];
              const isActive = currentCmdIdx === idx;
              return (
                <g 
                  key={idx} 
                  cursor="pointer" 
                  onClick={() => handleSelectCommand(idx)}
                  onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.2)"}
                  onMouseLeave={e => e.currentTarget.style.filter = "none"}
                  style={{
                    transform: isActive ? "scale(0.95)" : "none",
                    transformOrigin: `${bx}px ${by}px`,
                    transition: "all 0.15s ease"
                  }}
                >
                  {/* Button label */}
                  <text x={bx} y={by - 12} fontSize="5.5" fill={isActive ? color : "rgba(255,255,255,0.4)"} fontFamily="'Space Mono', monospace" textAnchor="middle" fontWeight={isActive ? "bold" : "normal"}>
                    {idx === 0 ? "HELP" : idx === 1 ? "SAFE" : "MEDS"}
                  </text>

                  {/* Switch Base */}
                  <rect x={bx - 8} y={by - 8} width="16" height="16" rx="2" fill="#222" stroke={isActive ? color : "#444"} strokeWidth="1" />
                  
                  {/* Metal terminals/legs */}
                  <rect x={bx - 10} y={by - 5} width="2" height="2" fill="#888" />
                  <rect x={bx + 8} y={by - 5} width="2" height="2" fill="#888" />
                  <rect x={bx - 10} y={by + 3} width="2" height="2" fill="#888" />
                  <rect x={bx + 8} y={by + 3} width="2" height="2" fill="#888" />

                  {/* Outer collar */}
                  <circle cx={bx} cy={by} r="6" fill="#111" stroke="#333" strokeWidth="0.5" />
                  
                  {/* Button plunger */}
                  <circle cx={bx} cy={by} r="4.5" fill={color} />
                  
                  {/* Metallic contact center */}
                  <circle cx={bx} cy={by} r="2" fill="#fff" opacity="0.4" />

                  {/* Glowing active ring */}
                  <circle cx={bx} cy={by} r="7.5" fill="none" stroke={color} strokeWidth="1.5" 
                    opacity={isActive ? 0.7 : 0} 
                    style={{ animation: isActive ? "led-blink 1s infinite" : "none" }}
                  />
                </g>
              );
            })}

            <text x="200" y="245" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.5)" fontFamily="'Syne',sans-serif" fontWeight="600">Station B — Relay Node</text>
            <text x="200" y="258" textAnchor="middle" fontSize="7" fill="rgba(255,100,0,0.5)" fontFamily="'Space Mono',monospace">ESP32 + SSD1306 OLED · I2C Bus</text>
          </g>

          {/* Top label */}
          <text x="550" y="18" textAnchor="middle" fontSize="9" fill="rgba(255,100,0,0.4)" fontFamily="'Space Mono',monospace">
            BREADBOARD A ←── ESP-NOW WIRELESS BRIDGE ──→ BREADBOARD B
          </text>
        </svg>

        {/* Premium Dashboard Panel */}
        <div className="mt-8 pt-8 border-t border-orange-500/20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Panel 1: Interactive Signal Console */}
          <div className="bg-black/50 border border-orange-500/10 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-orange-500 animate-pulse">◉</span>
                <h3 className="font-mono text-xs text-orange-400 uppercase tracking-widest">Signal Console</h3>
              </div>
              <div className="flex flex-col gap-3">
                {cmdLabels.map((label, idx) => {
                  const isActive = currentCmdIdx === idx;
                  const color = cmdColors[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectCommand(idx)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border font-mono text-xs tracking-wider transition-all duration-300 ${
                        isActive
                          ? "text-white"
                          : "bg-transparent border-white/5 hover:border-white/20 text-white/50 hover:text-white"
                      }`}
                      style={{
                        borderColor: isActive ? color : undefined,
                        boxShadow: isActive ? `0 0 15px ${color}33` : undefined,
                        backgroundColor: isActive ? `${color}15` : undefined
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
                        {label}
                      </span>
                      <span className="text-[10px] opacity-60">
                        {isActive ? "[ TRANSMITTING ]" : "[ IDLE ]"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
              <span className="font-mono text-[10px] text-white/40">MODE SELECTOR:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAuto(true)}
                  className={`px-3 py-1 rounded text-[10px] font-mono transition-all ${
                    isAuto 
                      ? "bg-orange-500/20 border border-orange-500 text-orange-400" 
                      : "bg-white/5 border border-white/10 text-white/40 hover:text-white"
                  }`}
                >
                  AUTO-CYCLE
                </button>
                <button
                  onClick={() => handleSelectCommand(currentCmdIdx)}
                  className={`px-3 py-1 rounded text-[10px] font-mono transition-all ${
                    !isAuto 
                      ? "bg-orange-500/20 border border-orange-500 text-orange-400" 
                      : "bg-white/5 border border-white/10 text-white/40 hover:text-white"
                  }`}
                >
                  MANUAL
                </button>
              </div>
            </div>
          </div>

          {/* Panel 2: Hardware Wiring Map */}
          <div className="bg-black/50 border border-orange-500/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-400">⚡</span>
              <h3 className="font-mono text-xs text-orange-400 uppercase tracking-widest">Hardware Wire Map (I2C)</h3>
            </div>
            <div className="flex flex-col gap-3 font-mono text-[11px] text-white/60">
              <div className="flex items-start gap-3 p-2.5 rounded bg-white/[0.02] border border-white/5">
                <span className="w-3 h-1 mt-1.5 rounded bg-[#e44] shadow-[0_0_6px_#e44]" />
                <div>
                  <span className="text-white font-bold block mb-0.5">VCC (3.3V)</span>
                  <span className="text-[10px] leading-relaxed text-white/40">Powers the SSD1306 OLED display via ESP32 3V3 out.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded bg-white/[0.02] border border-white/5">
                <span className="w-3 h-1 mt-1.5 rounded bg-[#22e] shadow-[0_0_6px_#22e]" />
                <div>
                  <span className="text-white font-bold block mb-0.5">GND (Ground)</span>
                  <span className="text-[10px] leading-relaxed text-white/40">Common ground link to complete the circuit loop.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded bg-white/[0.02] border border-white/5">
                <span className="w-3 h-1 mt-1.5 rounded bg-[#ee0] shadow-[0_0_6px_#ee0]" />
                <div>
                  <span className="text-white font-bold block mb-0.5">SCL (GPIO22)</span>
                  <span className="text-[10px] leading-relaxed text-white/40">Serial Clock line for synchronous I2C transmission.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded bg-white/[0.02] border border-white/5">
                <span className="w-3 h-1 mt-1.5 rounded bg-[#0c0] shadow-[0_0_6px_#0c0]" />
                <div>
                  <span className="text-white font-bold block mb-0.5">SDA (GPIO21)</span>
                  <span className="text-[10px] leading-relaxed text-white/40">Serial Data line for rendering display screen buffer.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 3: Live Telemetry Terminal */}
          <div className="bg-black/80 border border-orange-500/10 rounded-xl p-5 flex flex-col justify-between font-mono">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs text-orange-400 uppercase tracking-widest">Mesh Telemetry</span>
                </div>
                <span className="text-[9px] text-white/30">AES-128 SECURE</span>
              </div>
              <div className="text-[11px] space-y-1.5 text-orange-500/80 leading-normal">
                <div><span className="text-white/40">PROTOCOL:</span> ESP-NOW Broadcast</div>
                <div><span className="text-white/40">FREQUENCY:</span> 2.40 GHz (CH 6)</div>
                <div><span className="text-white/40">LATENCY:</span> ~{18 + (phase % 5)}ms (Normal)</div>
                <div><span className="text-white/40">ENCRYPTION:</span> ACTIVE (painlessMesh)</div>
                <div className="mt-3 p-2 rounded bg-orange-500/5 border border-orange-500/10 text-[10px] text-orange-300">
                  <span className="text-white/40 block mb-1">PAYLOAD DUMP:</span>
                  {"{"} cmd: "{cmdLabels[currentCmdIdx]}", node_src: 1, rssi_dbm: -{50 + (phase % 10)} {"}"}
                </div>
              </div>
            </div>
            <div className="mt-4 border-t border-white/5 pt-4 flex items-center justify-between text-[10px]">
              <span className="text-white/30">PACKETS SENT: {128 + Math.floor(phase / 10)}</span>
              <span className="text-green-400">ACK RECEIVED</span>
            </div>
          </div>
        </div>
      </div>
      </ScrollReveal>
    </section>
  );
}

// ─── ESP32 Mesh Dashboard ─────────────────────────────────────────────────────
function Dashboard() {
  const [tick, setTick] = useState(0);
  const [activeLink, setActiveLink] = useState(0);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState(0);
  const [offlineNodes, setOfflineNodes] = useState([]);
  const [tracerSrc, setTracerSrc] = useState(0);
  const [tracerDest, setTracerDest] = useState(4);
  const [tracerPath, setTracerPath] = useState(null);
  const [tracerStep, setTracerStep] = useState(0);
  const [isTracerRunning, setIsTracerRunning] = useState(false);
  const [diagLogs, setDiagLogs] = useState([
    { time: "00:00", type: "BOOT", msg: "painlessMesh v3.1 initialized", color: "#00b4ff" },
    { time: "00:01", type: "MESH", msg: "Root election complete → N1 elected", color: "#00e676" },
    { time: "00:02", type: "SYNC", msg: "All 5 nodes synced on CH6", color: "#00e676" },
  ]);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setActiveLink(a => (a + 1) % 10);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // Tracer animation stepper
  useEffect(() => {
    if (!isTracerRunning || !tracerPath) return;
    if (tracerStep >= tracerPath.length - 1) {
      const fromNode = espNodes[tracerPath[0]];
      const toNode = espNodes[tracerPath[tracerPath.length - 1]];
      addLog("DELIVER", `Payload delivered: ${fromNode.name} → ${toNode.name} (${tracerPath.length - 1} hops, ~${12 + tracerPath.length * 6}ms)`, "#00e676");
      setIsTracerRunning(false);
      return;
    }
    const timer = setTimeout(() => {
      const curr = espNodes[tracerPath[tracerStep]];
      const next = espNodes[tracerPath[tracerStep + 1]];
      addLog("HOP", `Relay: ${curr.name} → ${next.name} | RSSI: ${next.rssi}dBm`, "#00b4ff");
      setTracerStep(s => s + 1);
    }, 800);
    return () => clearTimeout(timer);
  }, [isTracerRunning, tracerStep, tracerPath]);

  // 5 real ESP32 nodes with realistic data
  const espNodes = [
    { id: 1, name: "ESP32-ROOT", mac: "24:6F:28:A1:B3:C0", role: "Root", ip: "192.168.4.1", rssi: -42, heap: 245760, channel: 6, x: 50, y: 12, color: "#ff6600", battery: 98, cpuTemp: 42, uptime: "4h 22m", gasLevel: 12, ambientTemp: 26 },
    { id: 2, name: "ESP32-BRIDGE", mac: "24:6F:28:A1:B3:C1", role: "Bridge", ip: "192.168.4.2", rssi: -55, heap: 198432, channel: 6, x: 15, y: 45, color: "#00b4ff", battery: 84, cpuTemp: 45, uptime: "4h 18m", gasLevel: 8, ambientTemp: 27 },
    { id: 3, name: "ESP32-RELAY-1", mac: "24:6F:28:A1:B3:C2", role: "Relay", ip: "192.168.4.3", rssi: -63, heap: 212544, channel: 6, x: 85, y: 45, color: "#00b4ff", battery: 72, cpuTemp: 48, uptime: "3h 55m", gasLevel: 22, ambientTemp: 29 },
    { id: 4, name: "ESP32-RELAY-2", mac: "24:6F:28:A1:B3:C3", role: "Relay", ip: "192.168.4.4", rssi: -71, heap: 178208, channel: 6, x: 25, y: 82, color: "#00e676", battery: 61, cpuTemp: 51, uptime: "3h 40m", gasLevel: 35, ambientTemp: 31 },
    { id: 5, name: "ESP32-LEAF", mac: "24:6F:28:A1:B3:C4", role: "Leaf", ip: "192.168.4.5", rssi: -78, heap: 156672, channel: 6, x: 75, y: 82, color: "#00e676", battery: 45, cpuTemp: 55, uptime: "2h 12m", gasLevel: 58, ambientTemp: 34 },
  ];

  const meshLinks = [
    { from: 0, to: 1, rssi: -52, hops: 1 },
    { from: 0, to: 2, rssi: -48, hops: 1 },
    { from: 0, to: 3, rssi: -67, hops: 2 },
    { from: 0, to: 4, rssi: -72, hops: 2 },
    { from: 1, to: 2, rssi: -58, hops: 1 },
    { from: 1, to: 3, rssi: -45, hops: 1 },
    { from: 1, to: 4, rssi: -69, hops: 2 },
    { from: 2, to: 3, rssi: -74, hops: 2 },
    { from: 2, to: 4, rssi: -51, hops: 1 },
    { from: 3, to: 4, rssi: -56, hops: 1 },
  ];

  const alerts = [
    { type: "ESP-NOW", msg: "Node 01 → broadcast beacon sent", color: "#00b4ff", time: "00:03" },
    { type: "MESH", msg: "ESP32-BRIDGE joined mesh tree", color: "#00e676", time: "00:12" },
    { type: "WARNING", msg: "ESP32-LEAF RSSI dropping (−78 dBm)", color: "#ff9900", time: "01:34" },
    { type: "ROUTE", msg: "Path updated: ROOT → RELAY-1 → LEAF", color: "#00b4ff", time: "02:10" },
    { type: "SYNC", msg: "painlessMesh sync — 5/5 nodes", color: "#00e676", time: "03:08" },
    { type: "HEAP", msg: "ESP32-RELAY-2 heap: 174KB free", color: "#ff9900", time: "03:44" },
  ];

  const throughputBars = [72, 85, 68, 91, 76, 88, 65, 94, 79, 83];
  const rssiToPercent = (rssi) => Math.max(0, Math.min(100, 2 * (rssi + 100)));

  const addLog = (type, msg, color) => {
    const now = new Date();
    const time = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setDiagLogs(prev => [...prev.slice(-19), { time, type, msg, color }]);
  };

  // BFS shortest path respecting offline nodes
  const findPath = (srcIdx, destIdx) => {
    if (offlineNodes.includes(srcIdx) || offlineNodes.includes(destIdx)) return null;
    const adj = {};
    espNodes.forEach((_, i) => { adj[i] = []; });
    meshLinks.forEach(link => {
      if (!offlineNodes.includes(link.from) && !offlineNodes.includes(link.to)) {
        adj[link.from].push(link.to);
        adj[link.to].push(link.from);
      }
    });
    const visited = new Set([srcIdx]);
    const queue = [[srcIdx]];
    while (queue.length > 0) {
      const path = queue.shift();
      const last = path[path.length - 1];
      if (last === destIdx) return path;
      for (const neighbor of adj[last]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }
    return null;
  };

  const handleToggleOffline = (idx) => {
    if (offlineNodes.includes(idx)) {
      setOfflineNodes(prev => prev.filter(n => n !== idx));
      addLog("RECOVER", `${espNodes[idx].name} back ONLINE — heartbeat restored`, "#00e676");
    } else {
      setOfflineNodes(prev => [...prev, idx]);
      addLog("CRITICAL", `${espNodes[idx].name} heartbeat LOST! Node offline.`, "#ff4444");
      if (idx === 0) {
        const backupRoot = espNodes.find((_, i) => i !== 0 && !offlineNodes.includes(i) && !([...offlineNodes, idx].includes(i)));
        if (backupRoot) {
          addLog("ELECTION", `Root failover: ${backupRoot.name} elected as backup ROOT`, "#ff9900");
        }
      }
      addLog("ROUTE", "Recalculating mesh routing table...", "#ff9900");
    }
  };

  const handleSendTracer = () => {
    const path = findPath(tracerSrc, tracerDest);
    if (!path) {
      addLog("ERROR", `Route BLOCKED: ${espNodes[tracerSrc].name} → ${espNodes[tracerDest].name} — destination unreachable!`, "#ff4444");
      return;
    }
    setTracerPath(path);
    setTracerStep(0);
    setIsTracerRunning(true);
    addLog("TRACER", `Sending test payload: ${espNodes[tracerSrc].name} → ${espNodes[tracerDest].name}`, "#00b4ff");
  };

  const selectedNode = espNodes[selectedNodeIdx];
  const isSelectedOffline = offlineNodes.includes(selectedNodeIdx);
  const onlineCount = espNodes.length - offlineNodes.length;

  // Build routing table for selected node
  const routingTable = espNodes.map((_, destIdx) => {
    if (destIdx === selectedNodeIdx) return { dest: destIdx, nextHop: "-", hops: 0, status: "self" };
    const path = findPath(selectedNodeIdx, destIdx);
    if (!path) return { dest: destIdx, nextHop: "—", hops: -1, status: "unreachable" };
    return { dest: destIdx, nextHop: `N${espNodes[path[1]].id}`, hops: path.length - 1, status: "reachable" };
  });

  return (
    <section style={{ padding: "60px max(24px, calc((100% - 1400px)/2)) 100px" }}>
      <style>{`
        @keyframes data-pulse { 0% { opacity: 0; offset-distance: 0%; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; offset-distance: 100%; } }
        @keyframes esp-breathe { 0%,100% { filter: drop-shadow(0 0 4px var(--glow)); } 50% { filter: drop-shadow(0 0 12px var(--glow)); } }
        .esp-node-label { font-family: 'Space Mono', monospace; font-size: 8px; fill: rgba(255,255,255,0.5); letter-spacing: 0.05em; }
        .esp-mac-label { font-family: 'Space Mono', monospace; font-size: 7px; fill: rgba(255,255,255,0.3); }
        .mesh-link-active { animation: link-glow 1.5s ease infinite; }
        @keyframes link-glow { 0%,100% { stroke-opacity: 0.15; } 50% { stroke-opacity: 0.6; } }
        @keyframes tracer-pulse { 0%,100% { r: 4; opacity: 1; } 50% { r: 8; opacity: 0.5; } }
        .dash-select { background: rgba(0,180,255,0.08); border: 1px solid rgba(0,180,255,0.2); color: #00b4ff; font-family: 'Space Mono', monospace; font-size: 11px; padding: 6px 10px; border-radius: 6px; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; }
        .dash-select option { background: #0a0e1a; color: #fff; }
        .dash-btn { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.08em; padding: 8px 16px; border-radius: 6px; border: 1px solid; cursor: pointer; transition: all 0.25s ease; text-transform: uppercase; }
      `}</style>
      <SectionHeadingReveal
        badge="ESP32 Mesh Command"
        title="Nexus Control Center"
        subtitle="Real-time ESP32 mesh network topology — 5 nodes connected via painlessMesh protocol. Click nodes to inspect, simulate failures, and trace packet routes in real-time."
        badgeColor="#00b4ff"
      />

      {/* Dashboard frame */}
      <ScrollReveal animation="scaleUp" duration={1.1}>
      <div style={{
        background: "rgba(4,8,16,0.95)", border: "1px solid rgba(0,180,255,0.2)",
        borderRadius: 22, overflow: "hidden",
        boxShadow: "0 0 80px rgba(0,180,255,0.12), 0 0 160px rgba(0,0,0,0.8)",
        backdropFilter: "blur(20px)"
      }}>
        {/* Title bar */}
        <div style={{
          background: "rgba(0,180,255,0.06)", borderBottom: "1px solid rgba(0,180,255,0.12)",
          padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff4444", boxShadow: "0 0 6px #ff4444" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff9900", boxShadow: "0 0 6px #ff9900" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00e676", boxShadow: "0 0 6px #00e676" }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", marginLeft: 10, letterSpacing: "0.1em" }}>
              NEXUS-GRID · ESP32 MESH v3.1 · painlessMesh
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: offlineNodes.length > 0 ? "#ff9900" : "#00b4ff" }}>
              MESH: {offlineNodes.length > 0 ? "DEGRADED" : "SYNCED"}
            </div>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: offlineNodes.length > 0 ? "#ff9900" : "#00e676",
              animation: "blink 2s infinite",
              boxShadow: `0 0 8px ${offlineNodes.length > 0 ? "#ff9900" : "#00e676"}`
            }} />
          </div>
        </div>

        {/* Main dashboard grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr 1fr", gap: 1, background: "rgba(0,180,255,0.06)" }}>
          {/* Left panel — ESP32 Alert Feed */}
          <div style={{ background: "rgba(4,8,16,0.98)", padding: 20 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(0,180,255,0.7)", letterSpacing: "0.12em", marginBottom: 14 }}>◈ MESH EVENT LOG</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {alerts.map((a, i) => (
                <div key={i} style={{
                  padding: "8px 10px", borderRadius: 8,
                  background: `rgba(${a.color === "#ff4444" ? "255,68,68" : a.color === "#ff9900" ? "255,153,0" : a.color === "#00b4ff" ? "0,180,255" : "0,230,118"},0.06)`,
                  border: `1px solid ${a.color}20`,
                  borderLeft: `3px solid ${a.color}`,
                  opacity: i === tick % alerts.length ? 1 : 0.7,
                  transition: "opacity 0.5s"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: a.color, letterSpacing: "0.1em" }}>{a.type}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.3)" }}>{a.time}s</span>
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>{a.msg}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Center — ESP32 Mesh Topology (ENLARGED) */}
          <div style={{ background: "rgba(4,8,16,0.98)", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(0,180,255,0.7)", letterSpacing: "0.12em" }}>◉ ESP32 MESH TOPOLOGY · LIVE</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)" }}>CH:6 · ESP-NOW · {onlineCount}/5 ONLINE</div>
            </div>
            <div style={{
              height: 380, borderRadius: 10, background: "rgba(0,180,255,0.02)",
              border: "1px solid rgba(0,180,255,0.12)", position: "relative",
              overflow: "hidden"
            }}>
              <svg width="100%" height="100%" viewBox="0 0 600 380" style={{ position: "absolute", inset: 0 }}>
                <defs>
                  <pattern id="espgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,180,255,0.05)" strokeWidth="0.5" />
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <filter id="glowStrong">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <rect width="600" height="380" fill="url(#espgrid)" />

                {/* Mesh connections */}
                {meshLinks.map((link, i) => {
                  const from = espNodes[link.from];
                  const to = espNodes[link.to];
                  const x1 = from.x * 6;
                  const y1 = from.y * 3.8 + 20;
                  const x2 = to.x * 6;
                  const y2 = to.y * 3.8 + 20;
                  const fromOffline = offlineNodes.includes(link.from);
                  const toOffline = offlineNodes.includes(link.to);
                  const linkBroken = fromOffline || toOffline;
                  const isOnTracer = tracerPath && isTracerRunning && !linkBroken;
                  const isActive = i === activeLink && !linkBroken;
                  const strength = rssiToPercent(link.rssi);

                  // Check if this link is on the active tracer path segment
                  let isTracerLink = false;
                  if (tracerPath && tracerStep > 0) {
                    for (let s = 0; s < tracerStep; s++) {
                      const a = tracerPath[s], b = tracerPath[s + 1];
                      if ((link.from === a && link.to === b) || (link.from === b && link.to === a)) {
                        isTracerLink = true;
                      }
                    }
                  }

                  return (
                    <g key={`link-${i}`}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke={linkBroken ? "#ff444466" : isTracerLink ? "#00e676" : isActive ? "#00b4ff" : "rgba(0,180,255,0.15)"}
                        strokeWidth={isTracerLink ? 3 : isActive ? 2 : 1}
                        strokeDasharray={linkBroken ? "4,6" : link.hops > 1 ? "6,4" : "none"}
                        style={{ transition: "all 0.5s ease" }}
                      />
                      {!linkBroken && (
                        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8}
                          textAnchor="middle" fontSize="8"
                          fill={strength > 60 ? "rgba(0,230,118,0.6)" : strength > 40 ? "rgba(255,153,0,0.6)" : "rgba(255,68,68,0.6)"}
                          fontFamily="'Space Mono', monospace"
                        >{link.rssi}dBm</text>
                      )}
                      {linkBroken && (
                        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8}
                          textAnchor="middle" fontSize="7" fill="rgba(255,68,68,0.5)" fontFamily="'Space Mono', monospace"
                        >BROKEN</text>
                      )}
                      {isActive && !linkBroken && (
                        <circle r="4" fill="#00b4ff" opacity="0.9" filter="url(#glow)">
                          <animateMotion dur="1.2s" repeatCount="indefinite"
                            path={`M${x1},${y1} L${x2},${y2}`} />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* ESP32 Nodes */}
                {espNodes.map((node, i) => {
                  const cx = node.x * 6;
                  const cy = node.y * 3.8 + 20;
                  const isOff = offlineNodes.includes(i);
                  const isSel = selectedNodeIdx === i;
                  const nodeColor = isOff ? "#555" : node.color;
                  const isTracerNode = tracerPath && tracerPath.includes(i) && isTracerRunning;
                  const isTracerHead = tracerPath && tracerPath[tracerStep] === i && isTracerRunning;
                  return (
                    <g key={`node-${i}`} cursor="pointer" onClick={() => setSelectedNodeIdx(i)}>
                      {/* Selection ring */}
                      {isSel && !isOff && (
                        <circle cx={cx} cy={cy} r="28" fill="none"
                          stroke={nodeColor} strokeWidth="2" strokeDasharray="6,3"
                          opacity="0.6" filter="url(#glow)"
                          style={{ animation: `ripple ${2}s ease-out infinite` }}
                        />
                      )}
                      {/* Tracer head glow */}
                      {isTracerHead && (
                        <circle cx={cx} cy={cy} r="22" fill="none"
                          stroke="#00e676" strokeWidth="3" opacity="0.8" filter="url(#glowStrong)"
                        />
                      )}
                      {/* Outer pulse ring */}
                      {!isOff && (
                        <circle cx={cx} cy={cy} r="22" fill="none"
                          stroke={nodeColor} strokeWidth="1" opacity="0.15"
                          style={{ animation: `ripple ${3 + i * 0.3}s ease-out infinite` }}
                        />
                      )}
                      {/* Node background */}
                      <rect x={cx - 18} y={cy - 18} width="36" height="36" rx="8"
                        fill={isOff ? "rgba(80,80,80,0.2)" : `${nodeColor}15`}
                        stroke={nodeColor} strokeWidth={isSel ? 2.5 : 1.5}
                        style={{ filter: isOff ? "none" : `drop-shadow(0 0 10px ${nodeColor}60)` }}
                      />
                      {/* ESP32 chip icon */}
                      <rect x={cx - 9} y={cy - 9} width="18" height="18" rx="3"
                        fill={nodeColor} opacity={isOff ? 0.3 : 0.8}
                      />
                      {/* Chip pins */}
                      {[-7, 0, 7].map(offset => (
                        <g key={offset}>
                          <line x1={cx + offset} y1={cy - 12} x2={cx + offset} y2={cy - 16}
                            stroke={nodeColor} strokeWidth="1.2" opacity={isOff ? 0.2 : 0.5} />
                          <line x1={cx + offset} y1={cy + 12} x2={cx + offset} y2={cy + 16}
                            stroke={nodeColor} strokeWidth="1.2" opacity={isOff ? 0.2 : 0.5} />
                        </g>
                      ))}
                      {[-7, 7].map(offset => (
                        <g key={`h-${offset}`}>
                          <line x1={cx - 12} y1={cy + offset} x2={cx - 16} y2={cy + offset}
                            stroke={nodeColor} strokeWidth="1.2" opacity={isOff ? 0.2 : 0.5} />
                          <line x1={cx + 12} y1={cy + offset} x2={cx + 16} y2={cy + offset}
                            stroke={nodeColor} strokeWidth="1.2" opacity={isOff ? 0.2 : 0.5} />
                        </g>
                      ))}
                      {/* Node ID in chip */}
                      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10"
                        fill={isOff ? "#777" : "#fff"} fontFamily="'Orbitron', monospace" fontWeight="700"
                      >{`N${node.id}`}</text>
                      {/* Offline X marker */}
                      {isOff && (
                        <>
                          <line x1={cx - 10} y1={cy - 10} x2={cx + 10} y2={cy + 10} stroke="#ff4444" strokeWidth="2.5" opacity="0.8" />
                          <line x1={cx + 10} y1={cy - 10} x2={cx - 10} y2={cy + 10} stroke="#ff4444" strokeWidth="2.5" opacity="0.8" />
                        </>
                      )}
                      {/* Node name label */}
                      <text x={cx} y={cy + 32} textAnchor="middle" fontSize="9"
                        fill={isOff ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.5)"}
                        fontFamily="'Space Mono', monospace" letterSpacing="0.05em"
                      >{node.name}</text>
                      {/* Role badge */}
                      <text x={cx} y={cy + 43} textAnchor="middle" fontSize="8"
                        fill={isOff ? "rgba(255,68,68,0.5)" : "rgba(255,255,255,0.3)"}
                        fontFamily="'Space Mono', monospace"
                      >{isOff ? "OFFLINE" : `${node.role.toUpperCase()} · ${node.mac.slice(-5)}`}</text>
                    </g>
                  );
                })}
              </svg>
              {/* Scan line */}
              <div style={{
                position: "absolute", left: 0, right: 0, height: 1,
                background: "linear-gradient(90deg, transparent, rgba(0,180,255,0.4), transparent)",
                animation: "scan 4s linear infinite"
              }} />
            </div>
            {/* Node stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginTop: 12 }}>
              {espNodes.map((node, i) => {
                const isOff = offlineNodes.includes(i);
                const isSel = selectedNodeIdx === i;
                return (
                  <div key={i} onClick={() => setSelectedNodeIdx(i)} style={{
                    textAlign: "center", padding: "10px 6px",
                    background: isSel ? `${node.color}18` : isOff ? "rgba(255,68,68,0.04)" : `${node.color}08`,
                    borderRadius: 8, cursor: "pointer",
                    border: isSel ? `2px solid ${node.color}` : isOff ? "1px solid rgba(255,68,68,0.2)" : `1px solid ${node.color}20`,
                    transition: "all 0.3s",
                    opacity: isOff ? 0.5 : 1
                  }}>
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 800, color: isOff ? "#ff4444" : node.color, marginBottom: 2 }}>N{node.id}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: isOff ? "rgba(255,68,68,0.6)" : "rgba(255,255,255,0.4)" }}>
                      {isOff ? "OFFLINE" : `${node.rssi}dBm`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel — ESP32 Node Details */}
          <div style={{ background: "rgba(4,8,16,0.98)", padding: 20 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(0,180,255,0.7)", letterSpacing: "0.12em", marginBottom: 14 }}>◆ NODE RSSI LEVELS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {espNodes.map((node, i) => {
                const isOff = offlineNodes.includes(i);
                const pct = isOff ? 0 : rssiToPercent(node.rssi);
                const barColor = isOff ? "#ff4444" : pct > 70 ? "#00e676" : pct > 50 ? "#00b4ff" : pct > 30 ? "#ff9900" : "#ff4444";
                return (
                  <div key={i} style={{ opacity: isOff ? 0.4 : 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.55)" }}>N{node.id} · {node.role}</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: barColor }}>{isOff ? "DOWN" : `${node.rssi}dBm`}</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{
                        width: `${pct}%`, height: "100%",
                        background: `linear-gradient(90deg, ${barColor}80, ${barColor})`,
                        borderRadius: 2, transition: "width 0.8s ease"
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(0,180,255,0.7)", letterSpacing: "0.12em", marginBottom: 10 }}>▣ MESH THROUGHPUT</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 55 }}>
              {throughputBars.map((b, i) => (
                <div key={i} style={{
                  flex: 1,
                  height: `${b}%`,
                  background: i === tick % throughputBars.length
                    ? "linear-gradient(to top, #ff6600, #ff9900)"
                    : "linear-gradient(to top, rgba(0,180,255,0.3), rgba(0,180,255,0.6))",
                  borderRadius: "3px 3px 0 0",
                  transition: "all 0.5s ease"
                }} />
              ))}
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(0,180,255,0.7)", letterSpacing: "0.12em", marginBottom: 8, marginTop: 16 }}>⬡ HEAP MEMORY</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {espNodes.map((node, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: offlineNodes.includes(i) ? 0.3 : 1 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)" }}>N{node.id}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: offlineNodes.includes(i) ? "#ff4444" : node.heap > 200000 ? "#00e676" : node.heap > 170000 ? "#ff9900" : "#ff4444" }}>
                    {offlineNodes.includes(i) ? "—" : `${(node.heap / 1024).toFixed(0)}KB`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════ INTERACTIVE DIAGNOSTICS LAB ═══════ */}
        <div style={{ borderTop: "1px solid rgba(0,180,255,0.15)", background: "rgba(0,180,255,0.02)" }}>
          <div style={{ padding: "16px 24px 8px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff6600", boxShadow: "0 0 8px #ff6600" }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#ff6600", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Interactive Diagnostics Lab
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.25)", marginLeft: "auto" }}>
              Click nodes above · Inject faults · Trace routes
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1.2fr", gap: 1, background: "rgba(0,180,255,0.06)" }}>

            {/* Panel 1: Node Inspector + Fault Injector */}
            <div style={{ background: "rgba(4,8,16,0.98)", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(0,180,255,0.7)", letterSpacing: "0.12em" }}>◈ NODE INSPECTOR</div>
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 9, padding: "2px 8px", borderRadius: 4,
                  background: isSelectedOffline ? "rgba(255,68,68,0.15)" : "rgba(0,230,118,0.1)",
                  border: `1px solid ${isSelectedOffline ? "rgba(255,68,68,0.3)" : "rgba(0,230,118,0.2)"}`,
                  color: isSelectedOffline ? "#ff4444" : "#00e676"
                }}>{isSelectedOffline ? "OFFLINE" : "ONLINE"}</div>
              </div>

              {/* Node identity */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "12px", borderRadius: 10, background: `${selectedNode.color}08`, border: `1px solid ${selectedNode.color}15` }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${selectedNode.color}20`, border: `2px solid ${selectedNode.color}`,
                  boxShadow: isSelectedOffline ? "none" : `0 0 15px ${selectedNode.color}40`
                }}>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, fontWeight: 800, color: isSelectedOffline ? "#777" : "#fff" }}>N{selectedNode.id}</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#fff", fontWeight: 600, marginBottom: 2 }}>{selectedNode.name}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{selectedNode.role} · {selectedNode.mac}</div>
                </div>
              </div>

              {/* System stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
                {[
                  ["IP Address", selectedNode.ip, "#00b4ff"],
                  ["RSSI", `${selectedNode.rssi} dBm`, rssiToPercent(selectedNode.rssi) > 60 ? "#00e676" : "#ff9900"],
                  ["Heap Free", `${(selectedNode.heap / 1024).toFixed(0)} KB`, selectedNode.heap > 200000 ? "#00e676" : "#ff9900"],
                  ["Battery", `${selectedNode.battery}%`, selectedNode.battery > 60 ? "#00e676" : selectedNode.battery > 30 ? "#ff9900" : "#ff4444"],
                  ["CPU Temp", `${selectedNode.cpuTemp}°C`, selectedNode.cpuTemp < 50 ? "#00e676" : "#ff9900"],
                  ["Uptime", selectedNode.uptime, "#00b4ff"],
                  ["Amb. Temp", `${selectedNode.ambientTemp}°C`, selectedNode.ambientTemp < 30 ? "#00e676" : "#ff9900"],
                  ["Gas Level", `${selectedNode.gasLevel} ppm`, selectedNode.gasLevel < 20 ? "#00e676" : selectedNode.gasLevel < 40 ? "#ff9900" : "#ff4444"],
                ].map(([label, value, color]) => (
                  <div key={label} style={{ padding: "6px 8px", borderRadius: 6, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.35)", marginBottom: 2, letterSpacing: "0.05em" }}>{label}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: isSelectedOffline ? "#555" : color, fontWeight: 600 }}>{isSelectedOffline ? "—" : value}</div>
                  </div>
                ))}
              </div>

              {/* Fault injection button */}
              <button
                onClick={() => handleToggleOffline(selectedNodeIdx)}
                className="dash-btn"
                style={{
                  width: "100%",
                  background: isSelectedOffline ? "rgba(0,230,118,0.08)" : "rgba(255,68,68,0.08)",
                  borderColor: isSelectedOffline ? "rgba(0,230,118,0.4)" : "rgba(255,68,68,0.4)",
                  color: isSelectedOffline ? "#00e676" : "#ff4444"
                }}
              >
                {isSelectedOffline ? "⚡ RESTORE NODE" : "⚠ SIMULATE FAILURE"}
              </button>
            </div>

            {/* Panel 2: Packet Tracer */}
            <div style={{ background: "rgba(4,8,16,0.98)", padding: 20 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(0,180,255,0.7)", letterSpacing: "0.12em", marginBottom: 14 }}>◉ PACKET ROUTE TRACER</div>

              {/* Source / Dest selectors */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.35)", marginBottom: 4, letterSpacing: "0.1em" }}>SOURCE NODE</div>
                  <select className="dash-select" style={{ width: "100%" }} value={tracerSrc} onChange={e => setTracerSrc(Number(e.target.value))}>
                    {espNodes.map((n, i) => <option key={i} value={i}>{`N${n.id} — ${n.name}`}</option>)}
                  </select>
                </div>
                <div style={{ textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: 16, color: "rgba(0,180,255,0.3)" }}>↓</div>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.35)", marginBottom: 4, letterSpacing: "0.1em" }}>DESTINATION NODE</div>
                  <select className="dash-select" style={{ width: "100%" }} value={tracerDest} onChange={e => setTracerDest(Number(e.target.value))}>
                    {espNodes.map((n, i) => <option key={i} value={i}>{`N${n.id} — ${n.name}`}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSendTracer}
                disabled={isTracerRunning || tracerSrc === tracerDest}
                className="dash-btn"
                style={{
                  width: "100%", marginBottom: 16,
                  background: isTracerRunning ? "rgba(255,255,255,0.03)" : "rgba(0,180,255,0.1)",
                  borderColor: isTracerRunning ? "rgba(255,255,255,0.1)" : "rgba(0,180,255,0.4)",
                  color: isTracerRunning ? "rgba(255,255,255,0.3)" : "#00b4ff",
                  cursor: isTracerRunning || tracerSrc === tracerDest ? "not-allowed" : "pointer"
                }}
              >
                {isTracerRunning ? "⏳ TRACING..." : "▶ SEND TEST PAYLOAD"}
              </button>

              {/* Routing table for selected node */}
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(0,180,255,0.6)", letterSpacing: "0.1em", marginBottom: 8 }}>ROUTING TABLE · N{selectedNode.id}</div>
              <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,180,255,0.1)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.7fr 1fr", gap: 0, background: "rgba(0,180,255,0.06)", padding: "5px 8px" }}>
                  {["DEST", "NEXT", "HOPS", "STATUS"].map(h => (
                    <span key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: "rgba(0,180,255,0.5)", letterSpacing: "0.1em" }}>{h}</span>
                  ))}
                </div>
                {routingTable.map((row, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr 0.7fr 1fr", gap: 0,
                    padding: "4px 8px", borderTop: "1px solid rgba(255,255,255,0.03)",
                    background: row.status === "self" ? "rgba(0,180,255,0.03)" : "transparent"
                  }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.5)" }}>N{espNodes[row.dest].id}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{row.nextHop}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{row.hops >= 0 ? row.hops : "—"}</span>
                    <span style={{
                      fontFamily: "'Space Mono', monospace", fontSize: 8,
                      color: row.status === "reachable" ? "#00e676" : row.status === "self" ? "#00b4ff" : "#ff4444"
                    }}>{row.status.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 3: Live Diagnostics Console */}
            <div style={{ background: "rgba(4,8,16,0.98)", padding: 20, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4444", animation: "blink 1s infinite", boxShadow: "0 0 6px #ff4444" }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(0,180,255,0.7)", letterSpacing: "0.12em" }}>DIAGNOSTICS CONSOLE</span>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.2)" }}>LIVE</span>
              </div>

              <div style={{
                flex: 1, borderRadius: 8, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,180,255,0.08)",
                padding: 10, overflowY: "auto", maxHeight: 320, minHeight: 200,
                display: "flex", flexDirection: "column", gap: 3
              }}>
                {diagLogs.map((log, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.2)", minWidth: 36, flexShrink: 0 }}>{log.time}</span>
                    <span style={{
                      fontFamily: "'Space Mono', monospace", fontSize: 7, padding: "1px 5px", borderRadius: 3,
                      background: `${log.color}15`, color: log.color, minWidth: 48, textAlign: "center", flexShrink: 0,
                      letterSpacing: "0.05em"
                    }}>{log.type}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{log.msg}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button
                  onClick={() => setDiagLogs([])}
                  className="dash-btn"
                  style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontSize: 9 }}
                >CLEAR LOG</button>
                <button
                  onClick={() => { setOfflineNodes([]); addLog("RESTORE", "All nodes restored — full mesh operational", "#00e676"); }}
                  className="dash-btn"
                  style={{ flex: 1, background: "rgba(0,230,118,0.06)", borderColor: "rgba(0,230,118,0.3)", color: "#00e676", fontSize: 9 }}
                >RESET MESH</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
        <div style={{
          background: "rgba(0,180,255,0.04)", borderTop: "1px solid rgba(0,180,255,0.1)",
          padding: "12px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap"
        }}>
          {[
            ["◉ MESH", offlineNodes.length > 0 ? "DEGRADED" : "ACTIVE", offlineNodes.length > 0 ? "#ff9900" : "#00e676"],
            ["⚡ PROTOCOL", "ESP-NOW", "#00b4ff"],
            ["◈ NODES", `${onlineCount}/5`, onlineCount === 5 ? "#00e676" : "#ff9900"],
            ["⬢ CHANNEL", "6", "#00b4ff"],
            ["◆ HOPS MAX", "2", "#ff9900"],
            ["⟲ SYNC", onlineCount === 5 ? "100%" : `${Math.floor(onlineCount / 5 * 100)}%`, onlineCount === 5 ? "#00e676" : "#ff9900"],
            ["▣ FIRMWARE", "v4.4.7", "#00b4ff"],
          ].map(([label, val, color]) => (
            <div key={label} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>{label}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color, fontWeight: 700 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
      </ScrollReveal>
    </section>
  );
}

// ─── Impact ───────────────────────────────────────────────────────────────────
function Impact() {
  const stats = [
    { value: "6×", label: "Faster Emergency Response", sub: "vs. legacy radio systems", color: "#ff6600" },
    { value: "100+", label: "Simultaneous Agencies", sub: "coordinated in real-time", color: "#00b4ff" },
    { value: "0", label: "Single Points of Failure", sub: "true decentralization", color: "#00e676" },
    { value: "48h", label: "Offline Operation", sub: "battery + solar capable", color: "#ff6600" },
    { value: "∞", label: "Scalable Coverage", sub: "from block to continent", color: "#00b4ff" },
  ];

  return (
    <section id="impact" style={{ padding: "80px max(24px, calc((100% - 1100px)/2))", position: "relative", scrollMarginTop: 90 }}>
      <ScrollReveal animation="fadeUp" duration={1.1}>
        <div style={{
          background: "rgba(0,180,255,0.03)", border: "1px solid rgba(0,180,255,0.1)",
          borderRadius: 28, padding: "60px 40px", backdropFilter: "blur(20px)",
          position: "relative", overflow: "hidden"
        }}>
          {/* Glow */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: "60%", height: "60%",
            background: "radial-gradient(ellipse, rgba(0,180,255,0.04) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />
          
          <SectionHeadingReveal
            badge="Humanitarian Impact"
            title="Numbers That Matter"
            badgeColor="#ff6600"
          />

          <StaggerContainer
            animation="cardRise"
            staggerDelay={0.1}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24, position: "relative" }}
          >
            {stats.map((s, i) => {
              const isInf = s.value === "∞";
              const num = isInf ? "∞" : parseFloat(s.value);
              const suf = isInf ? "" : s.value.replace(num.toString(), "");
              
              return (
                <div key={i} style={{
                  textAlign: "center", padding: "30px 20px",
                  background: "rgba(255,255,255,0.03)", borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.06)",
                  transition: "all 0.3s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = `rgba(${s.color === "#ff6600" ? "255,100,0" : s.color === "#00b4ff" ? "0,180,255" : "0,230,118"},0.06)`; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), 0 0 30px ${s.color}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{
                    fontFamily: "'Orbitron', monospace", fontSize: "clamp(36px,4vw,52px)",
                    fontWeight: 900, color: s.color,
                    marginBottom: 8,
                    textShadow: `0 0 30px ${s.color}80`
                  }}>
                    <AnimatedCounter value={num} suffix={suf} color={s.color} />
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{s.sub}</div>
                </div>
              );
            })}
          </StaggerContainer>
        </div>
      </ScrollReveal>
    </section>
  );
}

// ─── Trust / Future ───────────────────────────────────────────────────────────
function TrustFuture() {
  const deployments = [
    { icon: "🏙️", label: "Smart Cities", desc: "Urban emergency mesh for millions of citizens" },
    { icon: "🏕️", label: "Remote Regions", desc: "Off-grid coverage for isolated communities" },
    { icon: "🏫", label: "Campuses", desc: "University and institutional resilience networks" },
    { icon: "🚁", label: "Rescue Ops", desc: "Field-deployed networks for active rescue teams" },
    { icon: "🌊", label: "Flood Zones", desc: "Waterproof nodes for coastal disaster response" },
    { icon: "⛰️", label: "Wildfire Command", desc: "Smoke-resistant coordination infrastructure" },
  ];
  return (
    <section id="vision" style={{ padding: "80px max(24px, calc((100% - 1100px)/2))", scrollMarginTop: 90 }}>
      <ScrollReveal animation="fadeUp" duration={1.1}>
        <SectionHeadingReveal
          badge="Deployment Scenarios"
          title="Built for Every Crisis"
          subtitle="From megacities to mountain rescues — Nexus-Grid deploys wherever communication matters most."
          badgeColor="#00b4ff"
        />
        
        <StaggerContainer
          animation="tilt3D"
          staggerDelay={0.08}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}
        >
          {deployments.map((d, i) => (
            <MagneticCard key={i} style={{ borderRadius: 16 }}>
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 16,
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: "24px 22px",
                backdropFilter: "blur(10px)", transition: "all 0.3s",
                boxSizing: "border-box", height: "100%"
              }}>
                <div style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{d.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{d.label}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{d.desc}</div>
                </div>
              </div>
            </MagneticCard>
          ))}
        </StaggerContainer>
      </ScrollReveal>
    </section>
  );
}

// ─── Ticker ────────────────────────────────────────────────────────────────────
function Ticker() {
  const items = ["Adaptive Mesh Intelligence", "Zero-Infrastructure Deployment", "Military-Grade Encryption", "99.9% Uptime Protocol", "Multi-Agency Coordination", "Real-Time Node Monitoring", "Offline-First Architecture", "Crisis Response AI"];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid rgba(0,180,255,0.1)", borderBottom: "1px solid rgba(0,180,255,0.1)", padding: "16px 0", margin: "0 0 20px" }}>
      <div style={{ display: "flex", gap: 60, animation: "marquee 20s linear infinite", width: "max-content" }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: i % 3 === 0 ? "#ff6600" : "#00b4ff", boxShadow: `0 0 6px ${i % 3 === 0 ? "#ff6600" : "#00b4ff"}` }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section id="deploy" style={{ padding: "80px max(24px, calc((100% - 1000px)/2)) 120px", textAlign: "center", position: "relative", scrollMarginTop: 90 }}>
      {/* Large glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 600, height: 400,
        background: "radial-gradient(ellipse, rgba(0,100,255,0.08) 0%, rgba(255,80,0,0.04) 50%, transparent 70%)",
        pointerEvents: "none"
      }} />
      
      <ScrollReveal animation="fadeUp" delay={0} duration={0.8}>
        <div style={{
          display: "inline-block", fontFamily: "'Space Mono', monospace", fontSize: 11,
          color: "#ff6600", letterSpacing: "0.15em", textTransform: "uppercase",
          marginBottom: 24, padding: "5px 14px",
          background: "rgba(255,100,0,0.08)", border: "1px solid rgba(255,100,0,0.2)", borderRadius: 100
        }}>Deploy Nexus-Grid</div>
      </ScrollReveal>

      <ScrollReveal animation="fadeUp" delay={0.15} duration={0.8}>
        <h2 style={{
          fontFamily: "'Orbitron', monospace", fontSize: "clamp(32px,5vw,72px)",
          fontWeight: 900, color: "#fff", marginBottom: 24,
          lineHeight: 1.05, letterSpacing: "-0.02em"
        }}>
          Build Resilience<br />
          <span style={{
            background: "linear-gradient(90deg, #ff6600, #00b4ff)",
            backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>Before Disaster Strikes.</span>
        </h2>
      </ScrollReveal>

      <ScrollReveal animation="fadeUp" delay={0.3} duration={0.8}>
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 19, color: "rgba(255,255,255,0.5)",
          maxWidth: 500, margin: "0 auto 48px", lineHeight: 1.7
        }}>
          The window for preparation is closing. Ensure your team stays connected when the grid goes down.
        </p>
      </ScrollReveal>

      <ScrollReveal animation="scaleUp" delay={0.45} duration={0.8}>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            background: "linear-gradient(135deg, #ff6600, #ff4000)", border: "none", borderRadius: 12, padding: "18px 40px",
            color: "#fff", fontSize: 16, fontFamily: "'Syne', sans-serif", fontWeight: 700, cursor: "pointer",
            boxShadow: "0 0 30px rgba(255,100,0,0.5)", transition: "all 0.3s"
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 0 45px rgba(255,100,0,0.7)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 0 30px rgba(255,100,0,0.5)"; }}
          >Get Deployment Kit</button>
          <button style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "18px 40px",
            color: "#fff", fontSize: 16, fontFamily: "'Syne', sans-serif", fontWeight: 600, cursor: "pointer",
            backdropFilter: "blur(10px)", transition: "all 0.3s"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "none"; }}
          >Contact Sales</button>
        </div>
      </ScrollReveal>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding: "40px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(4,6,10,0.9)" }}>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
        © {new Date().getFullYear()} NEXUS-GRID. SECURE COMM PROTOCOL V3.1
      </p>
    </footer>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ backgroundColor: "#04060a", minHeight: "100vh", color: "#fff", overflowX: "hidden" }}>
      <ScrollProgressBar />
      <GridBackground />
      <Navbar />
      <Hero />
      <Ticker />
      <About />
      <SectionDivider color="#00b4ff" />
      <Capabilities />
      <SectionDivider color="#ff6600" />
      <HowItWorks />
      <SectionDivider color="#00b4ff" />
      <Dashboard />
      <SectionDivider color="#ff6600" />
      <Impact />
      <SectionDivider color="#00b4ff" />
      <TrustFuture />
      <SectionDivider color="#ff6600" />
      <FinalCTA />
      <Footer />
    </div>
  );
}
