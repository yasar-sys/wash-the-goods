import { useEffect, useState } from "react";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const AnimatedBackground = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate random bubbles
    const generatedBubbles: Bubble[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
    }));
    setBubbles(generatedBubbles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-full blur-3xl animate-blob" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-secondary/30 via-secondary/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/3 w-[450px] h-[450px] bg-gradient-to-tr from-accent/20 via-accent/5 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Floating bubbles (representing soap bubbles for washing theme) */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 backdrop-blur-sm animate-float-up"
          style={{
            left: `${bubble.x}%`,
            bottom: `-${bubble.size}px`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        >
          {/* Bubble shine effect */}
          <div 
            className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white/40 rounded-full blur-sm"
          />
        </div>
      ))}

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Subtle radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/50" />
    </div>
  );
};

export default AnimatedBackground;
