import { useEffect, useRef } from "react";

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      baseY: number;
      size: number;
      speedX: number;
      amplitude: number;
      frequency: number;
      phase: number;
      opacity: number;
      hue: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.baseY = Math.random() * canvas!.height;
        this.y = this.baseY;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = Math.random() * 0.4 + 0.1;
        this.amplitude = Math.random() * 60 + 20;
        this.frequency = Math.random() * 0.02 + 0.01;
        this.phase = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.hue = 180 + Math.random() * 30; // Cyan to teal range
      }

      update() {
        this.x += this.speedX;
        this.y = this.baseY + Math.sin(time * this.frequency + this.phase) * this.amplitude;

        if (this.x > canvas!.width + 10) {
          this.x = -10;
          this.baseY = Math.random() * canvas!.height;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 85%, 50%, ${this.opacity})`;
        ctx.fill();
      }
    }

    const createParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 7000);
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const drawWaves = () => {
      if (!ctx) return;

      // Wave 1 - Teal
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 5) {
        const y = canvas.height * 0.55 + 
          Math.sin(x * 0.004 + time * 0.015) * 50 +
          Math.sin(x * 0.008 + time * 0.01) * 25;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      const gradient1 = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height);
      gradient1.addColorStop(0, "rgba(6, 182, 212, 0.12)");
      gradient1.addColorStop(1, "rgba(6, 182, 212, 0.02)");
      ctx.fillStyle = gradient1;
      ctx.fill();

      // Wave 2 - Cyan
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 5) {
        const y = canvas.height * 0.65 + 
          Math.sin(x * 0.006 + time * 0.02 + 1) * 35 +
          Math.sin(x * 0.012 + time * 0.008) * 18;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      const gradient2 = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height);
      gradient2.addColorStop(0, "rgba(8, 145, 178, 0.1)");
      gradient2.addColorStop(1, "rgba(8, 145, 178, 0.01)");
      ctx.fillStyle = gradient2;
      ctx.fill();

      // Wave 3 - Deep blue accent
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 5) {
        const y = canvas.height * 0.75 + 
          Math.sin(x * 0.005 + time * 0.025 + 2) * 30 +
          Math.sin(x * 0.01 + time * 0.018) * 12;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      const gradient3 = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
      gradient3.addColorStop(0, "rgba(14, 165, 233, 0.08)");
      gradient3.addColorStop(1, "rgba(14, 165, 233, 0.01)");
      ctx.fillStyle = gradient3;
      ctx.fill();
    };

    const drawFlowingLines = () => {
      if (!ctx) return;

      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 - i * 0.015})`;
        ctx.lineWidth = 1.5;

        const yOffset = canvas.height * 0.25 + i * 50;
        ctx.moveTo(-50, yOffset);

        for (let x = -50; x <= canvas.width + 50; x += 10) {
          const y = yOffset + 
            Math.sin(x * 0.006 + time * 0.015 + i) * 60 +
            Math.sin(x * 0.003 + time * 0.01) * 35;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const drawBubbles = () => {
      if (!ctx) return;

      // Floating bubble effect
      for (let i = 0; i < 8; i++) {
        const x = ((time * 0.3 + i * 150) % (canvas.width + 100)) - 50;
        const y = canvas.height - ((time * 0.5 + i * 200) % (canvas.height + 100));
        const size = 8 + Math.sin(time * 0.02 + i) * 4;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${0.1 + Math.sin(time * 0.03 + i) * 0.05})`;
        ctx.fill();

        // Bubble shine
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fill();
      }
    };

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw flowing lines
      drawFlowingLines();

      // Draw waves
      drawWaves();

      // Draw bubbles
      drawBubbles();

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      time++;
      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* Canvas for particle and wave animations */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Static gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large cyan orb - top left */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/25 via-teal-400/15 to-transparent rounded-full blur-3xl animate-blob" />
        
        {/* Teal orb - top right */}
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-teal-400/20 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
        
        {/* Blue orb - bottom left */}
        <div className="absolute bottom-0 -left-20 w-[450px] h-[450px] bg-gradient-to-tr from-sky-500/20 via-blue-400/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000" />
        
        {/* Cyan orb - bottom right */}
        <div className="absolute -bottom-32 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-cyan-400/20 via-teal-500/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />

        {/* Subtle mesh overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(8, 145, 178, 0.4) 0%, transparent 50%)
            `,
          }}
        />
      </div>
    </>
  );
};

export default AnimatedBackground;
