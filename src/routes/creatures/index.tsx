import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/creatures/")({
  component: MathCreatures,
});

// Perlin noise implementation
class PerlinNoise {
  private perm: number[] = [];
  constructor(seed = Math.random() * 10000) {
    const p = [];
    for (let i = 0; i < 256; i++) p[i] = i;
    let n = seed;
    for (let i = 255; i > 0; i--) {
      n = (n * 16807) % 2147483647;
      const j = n % (i + 1);
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }
  private fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
  private lerp(a: number, b: number, t: number) { return a + t * (b - a); }
  private grad(hash: number, x: number, y: number, z: number = 0) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  }
  noise(x: number, y: number, z: number = 0): number {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    const u = this.fade(x), v = this.fade(y), w = this.fade(z);
    const A = this.perm[X] + Y, AA = this.perm[A] + Z, AB = this.perm[A + 1] + Z;
    const B = this.perm[X + 1] + Y, BA = this.perm[B] + Z, BB = this.perm[B + 1] + Z;
    return this.lerp(this.lerp(this.lerp(this.grad(this.perm[AA], x, y, z), this.grad(this.perm[BA], x - 1, y, z), u),
      this.lerp(this.grad(this.perm[AB], x, y - 1, z), this.grad(this.perm[BB], x - 1, y - 1, z), u), v),
      this.lerp(this.lerp(this.grad(this.perm[AA + 1], x, y, z - 1), this.grad(this.perm[BA + 1], x - 1, y, z - 1), u),
      this.lerp(this.grad(this.perm[AB + 1], x, y - 1, z - 1), this.grad(this.perm[BB + 1], x - 1, y - 1, z - 1), u), v), w) * 0.5 + 0.5;
  }
}

interface Pattern {
  id: string;
  description: string;
  code: string;
}

const yuruyuruPatterns: Pattern[] = [
  { id: "triangleMesh", description: "Perlin noise distorts a triangle mesh grid into organic, fluid-like warping.", code: `a=(x,y,d=-exp(-mag(k=w*noise(t)-x,e=w*noise(t,9)-y)/(40+145*noise(x/50,y/50))))=>[x+k*d,y+e*d]` },
  { id: "flowingCreature", description: "Flowing tentacle structure with undulating amplitude and hypnotic movement.", code: `a=(x,y,d=mag(k=(4+sin(y*2-t)*3)*cos(x/29),e=y/8-13))=>point(...)` },
  { id: "spiralPattern", description: "Grid-based iteration with center-out distance. Creates expanding spiral.", code: `a=(x,y,d=mag(k=x/8-25,e=y/8-25)**2/99)=>[...]` },
  { id: "radialCreature", description: "Uses atan2 for radial symmetry. Modular patterns create segments.", code: `a=(x,y,d=mag(k=9*cos(x/8),e=y/8-12.5)**2/99+sin(t)/6+.5)=>point(...)` },
  { id: "cloudCreature", description: "Low opacity creates ethereal cloud effect. Dense, misty structure.", code: `a=(d=mag(k=cos(i/48),e=cos(i/49))**4/5+3)=>point(...)` },
  { id: "spikyCreature", description: "Sharp angular variations from atan(). Modular patterns add spiky segments.", code: `a=(y,d=mag(k=(1.5+atan(cos(y%12)*8))*cos(i/3),e=y/8-13))=>point(...)` },
  { id: "jellyfishFlow", description: "Conditional creates head vs tentacle distinction. XOR adds chaos.", code: `a=(y=i/790,d=mag(k=(y<8?9+sin(y^9)*6:4+cos(y))*cos(i+t/4),e=y/3-13)+cos(...))=>point(...)` },
  { id: "spiralCreature", description: "Bitwise operations create layered spiral arms.", code: `a=(y,d=mag(k=5*cos(i/48),e=5*cos(y/9))**2/59+4)=>point(...)` },
];

const junkiyoshiPatterns: Pattern[] = [
  { id: "multilayer", description: "Topographic contour lines using Perlin noise. 10 threshold bands create layered terrain.", code: `for each pixel: if noise in band → draw` },
];

// Presets for Build Your Own
interface BuilderPreset {
  name: string;
  points: number;
  complexity: number;
  spread: number;
  waveIntensity: number;
  speed: number;
  density: number;
  spiral: number;
  layers: number;
}

const builderPresets: BuilderPreset[] = [
  { name: "Spiral Creature", points: 30000, complexity: 48, spread: 59, waveIntensity: 5, speed: 40, density: 96, spiral: 9, layers: 5 },
  { name: "Flowing Tentacles", points: 10000, complexity: 29, spread: 39, waveIntensity: 4, speed: 80, density: 96, spiral: 3, layers: 4 },
  { name: "Ethereal Cloud", points: 30000, complexity: 48, spread: 5, waveIntensity: 5, speed: 40, density: 26, spiral: 9, layers: 5 },
  { name: "Radial Burst", points: 10000, complexity: 8, spread: 99, waveIntensity: 9, speed: 45, density: 66, spiral: 7, layers: 6 },
  { name: "Spiky Form", points: 20000, complexity: 3, spread: 13, waveIntensity: 8, speed: 90, density: 86, spiral: 6, layers: 6 },
  { name: "Calm Waves", points: 15000, complexity: 60, spread: 80, waveIntensity: 3, speed: 120, density: 50, spiral: 4, layers: 3 },
];

function MathCreatures() {
  const [activeTab, setActiveTab] = useState<"yuruyuru" | "junkiyoshi" | "builder">("yuruyuru");

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 shadow-lg">
        <div className="max-w-5xl mx-auto px-4">
          <a href="/" className="text-white/70 hover:text-white text-sm">← Back</a>
          <div className="text-center mt-4">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">Mathematical Art</h1>
            <p className="text-white/80 mt-2">Organic movement from pure mathematics</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => setActiveTab("yuruyuru")}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                activeTab === "yuruyuru" ? "bg-white text-indigo-600 shadow-lg" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              🦑 yuruyurau
            </button>
            <button
              onClick={() => setActiveTab("junkiyoshi")}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                activeTab === "junkiyoshi" ? "bg-white text-purple-600 shadow-lg" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              🌊 junkiyoshi
            </button>
            <button
              onClick={() => setActiveTab("builder")}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                activeTab === "builder" ? "bg-white text-pink-600 shadow-lg" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              🔧 Build Your Own
            </button>
          </div>
        </div>
      </header>

      {activeTab === "builder" ? (
        <BuilderSection />
      ) : (
        <>
          {/* Subtitle */}
          <div className="bg-gray-50 border-b py-4">
            <div className="max-w-5xl mx-auto px-4 text-center">
              {activeTab === "yuruyuru" ? (
                <p className="text-gray-600">
                  <a href="https://x.com/yuruyurau" className="text-indigo-600 font-semibold hover:underline">@yuruyurau</a>
                  {" "}— Trigonometric creatures using nested sin/cos functions
                </p>
              ) : (
                <p className="text-gray-600">
                  <a href="https://junkiyoshi.com" className="text-purple-600 font-semibold hover:underline">junkiyoshi.com</a>
                  {" "}— Perlin noise patterns using openFrameworks
                </p>
              )}
            </div>
          </div>

          {/* Stacked Examples */}
          <main className="max-w-4xl mx-auto px-4 py-12">
            <div className="space-y-12">
              {(activeTab === "yuruyuru" ? yuruyuruPatterns : junkiyoshiPatterns).map((pattern, index) => (
                <PatternCard key={pattern.id} pattern={pattern} index={index} style={activeTab} />
              ))}
            </div>
          </main>
        </>
      )}

      {/* Footer */}
      <footer className="bg-gray-100 py-8 text-center border-t">
        <p className="text-gray-500 text-sm">
          Inspired by <a href="https://x.com/yuruyurau" className="text-indigo-600 hover:underline">@yuruyurau</a>
          {" & "}<a href="https://junkiyoshi.com" className="text-purple-600 hover:underline">junkiyoshi.com</a>
        </p>
      </footer>
    </div>
  );
}

function PatternCard({ pattern, index, style }: { pattern: Pattern; index: number; style: string }) {
  const [showCode, setShowCode] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 items-center`}>
      <div className="w-full lg:w-1/2">
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
          <CreatureCanvas pattern={pattern.id} style={style} />
        </div>
      </div>
      <div className="w-full lg:w-1/2 space-y-3">
        <p className="text-gray-600 leading-relaxed">{pattern.description}</p>
        <button onClick={() => setShowCode(!showCode)} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
          {showCode ? "▼ Hide Code" : "▶ View Code"}
        </button>
        {showCode && (
          <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-cyan-300 whitespace-pre-wrap">{pattern.code}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

function BuilderSection() {
  const [params, setParams] = useState<BuilderPreset>({ ...builderPresets[0] });

  const handlePreset = (preset: BuilderPreset) => {
    setParams({ ...preset });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Presets */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Start from a preset</h2>
        <div className="flex flex-wrap gap-3">
          {builderPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                params.name === preset.name
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Canvas */}
        <div>
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
            <BuilderCanvas params={params} />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6 border">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Adjust Parameters</h3>
            
            <div className="space-y-5">
              <SliderControl 
                label="Speed" 
                hint="How fast the animation moves"
                value={params.speed} 
                min={10} max={200} 
                onChange={(v) => setParams({...params, speed: v})} 
              />
              <SliderControl 
                label="Complexity" 
                hint="Detail level and intricacy"
                value={params.complexity} 
                min={3} max={100} 
                onChange={(v) => setParams({...params, complexity: v})} 
              />
              <SliderControl 
                label="Spread" 
                hint="How spread out vs compact"
                value={params.spread} 
                min={5} max={150} 
                onChange={(v) => setParams({...params, spread: v})} 
              />
              <SliderControl 
                label="Wave Intensity" 
                hint="Amount of undulation"
                value={params.waveIntensity} 
                min={1} max={15} 
                onChange={(v) => setParams({...params, waveIntensity: v})} 
              />
              <SliderControl 
                label="Density" 
                hint="Brightness and opacity"
                value={params.density} 
                min={10} max={150} 
                onChange={(v) => setParams({...params, density: v})} 
              />
              <SliderControl 
                label="Spiral" 
                hint="Rotation and swirl effect"
                value={params.spiral} 
                min={1} max={15} 
                onChange={(v) => setParams({...params, spiral: v})} 
              />
              <SliderControl 
                label="Layers" 
                hint="Number of distinct segments"
                value={params.layers} 
                min={2} max={10} 
                onChange={(v) => setParams({...params, layers: v})} 
              />
              <SliderControl 
                label="Resolution" 
                hint="Number of points (affects performance)"
                value={params.points / 1000} 
                min={5} max={40} 
                displayValue={`${(params.points / 1000).toFixed(0)}K`}
                onChange={(v) => setParams({...params, points: v * 1000})} 
              />
            </div>
          </div>

          {/* Generated formula preview */}
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-2">Generated formula:</p>
            <pre className="text-xs font-mono text-cyan-300 whitespace-pre-wrap">
{`points: ${params.points}, freq: 1/${params.complexity}
spread: ${params.spread}, wave: ${params.waveIntensity}
speed: PI/${params.speed}, opacity: ${params.density}/255
spiral: ${params.spiral}, layers: ${params.layers}`}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}

function SliderControl({ label, hint, value, min, max, displayValue, onChange }: {
  label: string; hint: string; value: number; min: number; max: number; displayValue?: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <label className="text-sm font-semibold text-gray-800">{label}</label>
        <span className="text-sm font-mono text-indigo-600">{displayValue || value}</span>
      </div>
      <p className="text-xs text-gray-500 mb-2">{hint}</p>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
    </div>
  );
}

function BuilderCanvas({ params }: { params: BuilderPreset }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const mag = (a: number, b: number) => Math.sqrt(a * a + b * b);
    const scale = w / 400;

    const draw = () => {
      timeRef.current += Math.PI / params.speed;
      const t = timeRef.current;

      ctx.fillStyle = "rgb(9, 9, 9)";
      ctx.fillRect(0, 0, w, w);
      ctx.fillStyle = `rgba(255, 255, 255, ${params.density / 255})`;

      const { points, complexity, spread, waveIntensity, spiral, layers } = params;

      for (let i = points; i > 0; i--) {
        const y = i / (points / 30);
        const k = waveIntensity * Math.cos(i / complexity);
        const e = waveIntensity * Math.cos(y / (complexity / 5));
        const d = Math.pow(mag(k, e), 2) / spread + layers;
        const q = k * (3 + 2 * Math.sin(d * d - t + (i % layers))) 
                  - 3 * Math.sin(Math.atan2(k, e) * spiral) 
                  - (((i & 1) + 1) * 40);
        const c = d - t / (spiral + 1) + (i % layers) * 5 + (i % 2) * 2;
        const px = (q * Math.sin(c) + 200) * scale;
        const py = ((q + 80) * Math.cos(c) + 200) * scale;
        ctx.fillRect(px, py, 1.5, 1.5);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    timeRef.current = 0;
    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [params]);

  return <canvas ref={canvasRef} width={400} height={400} className="w-full aspect-square" />;
}

function CreatureCanvas({ pattern, style }: { pattern: string; style: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const noiseRef = useRef(new PerlinNoise());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const noise = noiseRef.current;
    const mag = (a: number, b: number) => Math.sqrt(a * a + b * b);

    // Faster speeds
    const speeds: Record<string, number> = {
      triangleMesh: 0.04, flowingCreature: Math.PI/60, spiralPattern: Math.PI/30,
      radialCreature: Math.PI/20, cloudCreature: Math.PI/20, spikyCreature: Math.PI/40,
      jellyfishFlow: Math.PI/40, spiralCreature: Math.PI/20, multilayer: 0.003
    };

    const draw = () => {
      timeRef.current += speeds[pattern] || Math.PI/20;
      const t = timeRef.current;

      if (style === "junkiyoshi") {
        ctx.fillStyle = "rgb(39, 39, 39)";
        ctx.fillRect(0, 0, w, w);
        const imageData = ctx.getImageData(0, 0, w, w);
        const data = imageData.data;
        for (let x = 0; x < w; x++) {
          for (let y = 0; y < w; y++) {
            const n = noise.noise(x * 0.005, y * 0.005, t);
            for (let i = 0; i < 10; i++) {
              if (n > i * 0.1 + 0.043 && n < i * 0.1 + 0.057) {
                const idx = (y * w + x) * 4;
                data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255;
                break;
              }
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (pattern === "triangleMesh") {
        ctx.fillStyle = "rgb(248, 248, 248)";
        ctx.fillRect(0, 0, w, w);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
        ctx.lineWidth = 0.5;
        const s = 8;
        const a = (x: number, y: number) => {
          const k = w * noise.noise(t, 0, 0) - x;
          const e = w * noise.noise(t, 9, 0) - y;
          const d = -Math.exp(-mag(k, e) / (40 + 145 * noise.noise(x/50, y/50, 0)));
          return [x + k * d, y + e * d];
        };
        for (let y = 0; y < w; y += s) {
          for (let x = 0; x < w; x += s) {
            const p1 = a(x, y), p2 = a(x, y + s), p3 = a(x + s, y);
            ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.lineTo(p3[0], p3[1]);
            ctx.closePath(); ctx.stroke();
          }
        }
      } else {
        ctx.fillStyle = pattern === "spiralPattern" ? "rgb(6, 6, 6)" : "rgb(9, 9, 9)";
        ctx.fillRect(0, 0, w, w);
        
        const alphas: Record<string, number> = {
          flowingCreature: 0.38, spiralPattern: 0.38, radialCreature: 0.26,
          cloudCreature: 0.1, spikyCreature: 0.34, jellyfishFlow: 0.45, spiralCreature: 0.38
        };
        ctx.fillStyle = `rgba(255, 255, 255, ${alphas[pattern] || 0.38})`;
        const scale = w / 400;

        if (pattern === "flowingCreature") {
          for (let i = 10000; i > 0; i--) {
            const x = i, y = i / 235;
            const k = (4 + Math.sin(y * 2 - t) * 3) * Math.cos(x / 29);
            const e = y / 8 - 13;
            const d = mag(k, e);
            const q = 3 * Math.sin(k * 2) + 0.3 / (k || 0.001) + Math.sin(y / 25) * k * (9 + 4 * Math.sin(e * 9 - d * 3 + t * 2));
            const c = d - t;
            // Fixed: center the creature better
            ctx.fillRect((q + 30 * Math.cos(c) + 200) * scale, (q * Math.sin(c) + d * 25 + 120) * scale, 1.5, 1.5);
          }
        } else if (pattern === "spiralPattern") {
          for (let y = 99; y < 300; y += 5) {
            for (let x = 99; x < 300; x++) {
              const k = x / 8 - 25, e = y / 8 - 25;
              const d = Math.pow(mag(k, e), 2) / 99;
              const q = x / 3 + k * 0.5 / (Math.cos(y * 5) || 0.001) * Math.sin(d * d - t);
              const c = d / 2 - t / 8;
              ctx.fillRect((q * Math.sin(c) + e * Math.sin(d + k - t) + 200) * scale, ((q + y / 8 + d * 9) * Math.cos(c) + 200) * scale, 1.5, 1.5);
            }
          }
        } else if (pattern === "radialCreature") {
          for (let i = 10000; i > 0; i--) {
            const x = i % 200, y = i / 55;
            const k = 9 * Math.cos(x / 8), e = y / 8 - 12.5;
            const d = Math.pow(mag(k, e), 2) / 99 + Math.sin(t) / 6 + 0.5;
            const q = 99 - e * Math.sin(Math.atan2(k, e) * 7) / (d || 0.001) + k * (3 + Math.cos(d * d - t) * 2);
            const c = d / 2 + e / 69 - t / 16;
            ctx.fillRect((q * Math.sin(c) + 200) * scale, ((q + 19 * d) * Math.cos(c) + 200) * scale, 1.5, 1.5);
          }
        } else if (pattern === "cloudCreature") {
          for (let i = 30000; i > 0; i--) {
            const k = Math.cos(i / 48), e = Math.cos(i / 49);
            const d = Math.pow(mag(k, e), 4) / 5 + 3;
            const q = k * (9 + e / 3 + 5 * Math.sin(d * d + e - t)) - Math.sin(Math.atan2(k, e) * 9);
            const c = d - t / 9 + (i % 5) * 2;
            ctx.fillRect((q + 40 * Math.sin(c) + 200) * scale, ((q + 90 + d * 9 - e / (d || 0.001) * 19) * Math.sin(c / 2 + 6) + d * 9 + 160) * scale, 1, 1);
          }
        } else if (pattern === "spikyCreature") {
          for (let i = 20000; i > 0; i--) {
            const y = i / 470;
            const k = (1.5 + Math.atan(Math.cos(y % 12) * 8)) * Math.cos(i / 3), e = y / 8 - 13;
            const d = mag(k, e);
            const q = 10 * Math.cos(d - t) + y / 8 * k * (2 + Math.sin(d * 3 + y - t * 2)) + 99;
            const c = d / 4 - t / 8 + (i % 6);
            ctx.fillRect((q * Math.cos(c) + 200) * scale, (q * Math.sin(c + (i % 3) * 7 + 2.3) + 200) * scale, 1.5, 1.5);
          }
        } else if (pattern === "jellyfishFlow") {
          for (let i = 10000; i > 0; i--) {
            const y = i / 790;
            const k = (y < 8 ? 9 + Math.sin(y ^ 9) * 6 : 4 + Math.cos(y)) * Math.cos(i + t / 4);
            const e = y / 3 - 13;
            const d = mag(k, e) + Math.cos(e + t * 2 + (i % 2) * 4);
            const q = y * k / 5 * (2 + Math.sin(d * 2 + y - t * 4)) + 80;
            const c = d / 4 - t / 2 + (i % 2) * 3;
            ctx.fillRect((q * Math.cos(c) + 200) * scale, (q * Math.sin(c) + d * 9 + 60) * scale, 1.5, 1.5);
          }
        } else if (pattern === "spiralCreature") {
          for (let i = 30000; i > 0; i--) {
            const y = i / 999;
            const k = 5 * Math.cos(i / 48), e = 5 * Math.cos(y / 9);
            const d = Math.pow(mag(k, e), 2) / 59 + 4;
            const q = k * (3 + 2 * Math.sin(d * d - t + (i % 4))) - 3 * Math.sin(Math.atan2(k, e) * 9) - (((i & 1) + 1) * 40);
            const c = d - t / 9 + (i % 5) * 5 + (i % 2) * 2;
            ctx.fillRect((q * Math.sin(c) + 200) * scale, ((q + 80) * Math.cos(c) + 200) * scale, 1.5, 1.5);
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    timeRef.current = 0;
    noiseRef.current = new PerlinNoise();
    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [pattern, style]);

  return <canvas ref={canvasRef} width={400} height={400} className="w-full aspect-square" />;
}
