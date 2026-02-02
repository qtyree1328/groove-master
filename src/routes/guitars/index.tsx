import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/guitars/")({
  component: GuitarHistory,
});

interface Instrument {
  id: string;
  name: string;
  period: string;
  startYear: number;
  endYear: number;
  years: string;
  description: string;
  details: string[];
  status: string;
  images: string[];
  imageAlt: string;
  notableShows?: string[];
  albums?: string[];
  youtubeId?: string;
  audioClip?: string;
  cost?: string;
  maker: string;
}

// Jerry Garcia Guitars
const jerryGuitars: Instrument[] = [
  {
    id: "alligator",
    name: "Alligator",
    period: "1971 – 1973",
    startYear: 1971,
    endYear: 1973,
    years: "~2 years",
    maker: "Fender",
    cost: "Gift from Graham Nash",
    description: "1955 Fender Stratocaster with the famous alligator sticker. Gift from Graham Nash for session work on Crosby, Stills, Nash & Young's 'Déjà Vu' album.",
    details: [
      "1955 swamp-ash body, maple neck",
      "Originally purchased from Phoenix pawnshop for $250",
      "Nicknamed 'Frankenstein' - constantly evolving mods",
      "Alembic modifications throughout 1971-1973",
      "Features the iconic alligator sticker that gave it its name"
    ],
    status: "Sold at auction Dec 2019 — $420,000",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/alligator/guitars_gallery_alligator_1.jpg",
    ],
    imageAlt: "Jerry Garcia's Alligator Stratocaster",
    notableShows: [
      "4/8/72 - Wembley Empire Pool, London (Europe '72 Tour)",
      "5/26/72 - Lyceum Theatre, London (Europe '72 finale)",
      "8/27/72 - Veneta, OR (famous 'Sunshine Daydream' show)",
      "2/9/73 - Roscoe Maples Pavilion, Stanford",
      "8/1/73 - Roosevelt Stadium, Jersey City (last appearance)"
    ],
    albums: ["Europe '72", "Sunshine Daydream"],
    youtubeId: "RvEgkLsaMRQ",
  },
  {
    id: "wolf",
    name: "Wolf",
    period: "1973 – 1993",
    startYear: 1973,
    endYear: 1993,
    years: "20 years",
    maker: "Doug Irwin",
    cost: "$1,500",
    description: "First major Irwin custom. Named for the cartoon wolf sticker Jerry placed on it. Became the first of Irwin's legendary builds.",
    details: [
      "Purpleheart and curly maple body",
      "Ebony fingerboard, 24 frets, 25\" scale",
      "Wolf inlay replaced sticker in 1977",
      "Weighed about 10 lbs",
      "Used for nearly 20 years - Jerry's longest relationship with a guitar"
    ],
    status: "Auctioned 2017 — $3.2M for Southern Poverty Law Center",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/wolf/guitars_gallery_wolf_1.jpg",
    ],
    imageAlt: "Jerry Garcia's Wolf guitar by Doug Irwin",
    notableShows: [
      "9/5/73 - Nassau Coliseum (debut)",
      "10/18/74 - Winterland (legendary Wall of Sound show)",
      "9/28/75 - Lindley Meadows, Golden Gate Park (free show)",
      "9/3/77 - Englishtown, NJ (one of the largest Dead shows ever)",
      "9/15/78 - Giza, Egypt (Great Pyramid shows)"
    ],
    albums: ["Wake of the Flood", "Mars Hotel", "Blues for Allah", "Terrapin Station"],
    youtubeId: "jGBYVDGbJ7M",
  },
  {
    id: "travis-bean",
    name: "Travis Bean TB500",
    period: "1975 – 1978",
    startYear: 1975,
    endYear: 1978,
    years: "~3 years",
    maker: "Travis Bean",
    cost: "$1,395",
    description: "Revolutionary aluminum-neck guitar. TB500 #12 was used at Cornell '77, widely considered one of the greatest Dead shows ever.",
    details: [
      "Machined aluminum neck (revolutionary design)",
      "Solid Hawaiian Koa body",
      "'The Enemy is Listening' sticker added by Jerry",
      "First guitar with OBEL (On-Board Effects Loop)",
      "Incredible sustain due to aluminum neck"
    ],
    status: "TB500 #12 owned by collector Jason Scheuner",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/travis-bean/photo01.jpg",
    ],
    imageAlt: "Jerry Garcia's Travis Bean TB500",
    notableShows: [
      "5/8/77 - Barton Hall, Cornell University (legendary 'Cornell 77')",
      "5/9/77 - Buffalo Memorial Auditorium",
      "5/22/77 - Pembroke Pines, FL (famous 'Scarlet>Fire')",
      "9/3/77 - Englishtown, NJ (shared with Wolf)",
      "12/31/77 - Winterland (New Year's Eve)"
    ],
    albums: ["Terrapin Station", "Cats Under the Stars", "Dick's Picks Vol. 3"],
    youtubeId: "pKLm7mRdYjM",
  },
  {
    id: "tiger",
    name: "Tiger",
    period: "1979 – 1995",
    startYear: 1979,
    endYear: 1995,
    years: "16 years",
    maker: "Doug Irwin",
    cost: "$5,800",
    description: "Jerry's most-played guitar. \"Don't hold back,\" he told Irwin. This 13.5 lb masterpiece took 6 years to build and defined the Dead's sound in the '80s and '90s.",
    details: [
      "Cocobolo, vermilion, maple 'hippie sandwich' laminate",
      "Solid brass binding and hardware",
      "Weight: 13.5 lbs (Jerry called it his 'workout')",
      "12 discrete tonal voices via complex switching",
      "Built-in effects loop, buffer, and preamp",
      "Tiger inlay on headstock"
    ],
    status: "Owned by Jim Irsay — $850,000",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/tiger/guitars_gallery_tiger_1.jpg",
    ],
    imageAlt: "Jerry Garcia's Tiger guitar by Doug Irwin",
    notableShows: [
      "8/4/79 - Oakland Auditorium Arena (debut)",
      "3/28/81 - Grugahalle, Essen, Germany (Europe '81)",
      "7/4/89 - Rich Stadium, Buffalo (most attended Dead show)",
      "9/10/91 - Madison Square Garden",
      "7/9/95 - Soldier Field, Chicago (final Dead show)"
    ],
    albums: ["Go to Heaven", "Dead Set", "In the Dark", "Built to Last", "Without a Net"],
    youtubeId: "LIi3j2MjmYA",
  },
  {
    id: "rosebud",
    name: "Rosebud",
    period: "1990 – 1995",
    startYear: 1990,
    endYear: 1995,
    years: "5 years",
    maker: "Doug Irwin",
    cost: "$11,000",
    description: "Irwin's masterpiece and Tiger's twin. 2 lbs lighter with built-in MIDI from the start. Named for 'The Saint' dancing skeleton inlay.",
    details: [
      "Hollowed flame-maple core (11.5 lbs - 2 lbs lighter than Tiger)",
      "Built-in MIDI pickup and controls",
      "Cocobolo top, curly maple back",
      "Named for 'The Saint' skeleton with roses inlay",
      "Considered by many to be Irwin's finest work"
    ],
    status: "Rock and Roll Hall of Fame",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/rosebud/guitars_gallery_rosebud_1.jpg",
    ],
    imageAlt: "Jerry Garcia's Rosebud guitar by Doug Irwin",
    notableShows: [
      "12/31/89 - Oakland Coliseum (debut, NYE)",
      "9/20/90 - Madison Square Garden",
      "6/14/91 - RFK Stadium, Washington DC",
      "3/27/93 - Rosemont Horizon, Chicago",
      "7/9/95 - Soldier Field, Chicago (final Dead show)"
    ],
    albums: ["Without a Net", "Infrared Roses"],
    youtubeId: "P28FMJeHNYE",
  },
  {
    id: "lightning-bolt",
    name: "Lightning Bolt",
    period: "1993 – 1995",
    startYear: 1993,
    endYear: 1995,
    years: "2 years",
    maker: "Stephen Cripe",
    cost: "Gift",
    description: "\"The guitar I've always been waiting for.\" Built by a yacht craftsman who studied videos to replicate Tiger's feel at a fraction of the weight.",
    details: [
      "Recycled Brazilian rosewood fingerboard",
      "East Indian rosewood body from antique opium bed",
      "Electronics redone by Gary Brawer for MIDI",
      "Only 8.5 lbs - lightest of Jerry's main guitars",
      "Cripe built it as a gift, studying Tiger for 2 years"
    ],
    status: "Rock and Roll Hall of Fame",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/lightning-bolt/guitars_gallery_lightningbolt_1.jpg",
    ],
    imageAlt: "Jerry Garcia's Lightning Bolt guitar by Stephen Cripe",
    notableShows: [
      "8/7/93 - JGB at The Warfield (debut)",
      "12/31/93 - Oakland Coliseum (NYE)",
      "10/1/94 - Boston Garden",
      "3/19/95 - The Spectrum, Philadelphia",
      "6/4/95 - Shoreline Amphitheatre (last show with this guitar)"
    ],
    youtubeId: "UOsq_KJnPKE",
  },
];

function GuitarHistory() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeGuitar, setActiveGuitar] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const guitarRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const progress = scrollTop / (scrollHeight - clientHeight);
      setScrollProgress(Math.min(1, Math.max(0, progress)));

      // Determine active guitar based on scroll position
      const guitarElements = Object.entries(guitarRefs.current);
      for (const [id, el] of guitarElements) {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            setActiveGuitar(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const minYear = Math.min(...jerryGuitars.map(g => g.startYear));
  const maxYear = Math.max(...jerryGuitars.map(g => g.endYear));
  const yearRange = maxYear - minYear;

  const getYearFromProgress = (progress: number) => {
    return Math.round(minYear + progress * yearRange);
  };

  const currentYear = getYearFromProgress(scrollProgress);
  const activeGuitarData = jerryGuitars.find(g => g.id === activeGuitar);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-white">
      {/* Fixed Progress Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-20 bg-slate-900/90 backdrop-blur border-r border-slate-800 z-50 flex flex-col items-center py-8">
        <Link to="/" className="text-slate-500 hover:text-white text-sm mb-6">← Hub</Link>
        
        {/* Year Display */}
        <div className="text-center mb-4">
          <div className="text-3xl font-black text-crab-400">{currentYear}</div>
          <div className="text-xs text-slate-500">scroll</div>
        </div>
        
        {/* Vertical Progress Bar */}
        <div className="flex-1 w-2 bg-slate-800 rounded-full relative mx-auto">
          <div 
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-crab-500 to-crab-700 rounded-full transition-all duration-150"
            style={{ height: `${scrollProgress * 100}%` }}
          />
          
          {/* Guitar markers on timeline */}
          {jerryGuitars.map((guitar) => {
            const midYear = (guitar.startYear + guitar.endYear) / 2;
            const position = ((midYear - minYear) / yearRange) * 100;
            return (
              <div
                key={guitar.id}
                className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all cursor-pointer ${
                  activeGuitar === guitar.id 
                    ? 'bg-crab-500 border-crab-300 scale-125' 
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                }`}
                style={{ top: `${position}%` }}
                onClick={() => {
                  guitarRefs.current[guitar.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                title={`${guitar.name} (${guitar.period})`}
              />
            );
          })}
        </div>
        
        {/* Year range */}
        <div className="mt-4 text-center">
          <div className="text-xs text-slate-500">{minYear}</div>
          <div className="text-xs text-slate-500">to</div>
          <div className="text-xs text-slate-500">{maxYear}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-20">
        {/* Header */}
        <header className="bg-gradient-to-r from-crab-800 via-crab-700 to-orange-700 text-white py-12 px-8 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">
              JERRY GARCIA'S GUITARS
            </h1>
            <p className="text-white/80 text-lg">A journey through the instruments that shaped the Dead's sound</p>
            {activeGuitarData && (
              <div className="mt-4 inline-block bg-black/30 px-6 py-2 rounded-full">
                <span className="font-bold">{activeGuitarData.name}</span>
                <span className="text-white/70 ml-2">{activeGuitarData.period}</span>
              </div>
            )}
          </div>
        </header>

        {/* Guitar Cards */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          {jerryGuitars.map((guitar, index) => (
            <div
              key={guitar.id}
              ref={(el) => { guitarRefs.current[guitar.id] = el; }}
              className="mb-24 scroll-mt-32"
            >
              {/* Year marker */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl font-black text-slate-800">{guitar.startYear}</div>
                <div className="flex-1 h-px bg-slate-800"></div>
              </div>

              {/* Guitar Card */}
              <div className={`bg-slate-900 rounded-2xl overflow-hidden border transition-all duration-300 ${
                activeGuitar === guitar.id ? 'border-crab-500 shadow-lg shadow-crab-500/20' : 'border-slate-800'
              }`}>
                {/* Image Section */}
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 flex justify-center">
                  <img
                    src={guitar.images[0]}
                    alt={guitar.imageAlt}
                    className="max-h-80 object-contain drop-shadow-2xl"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 bg-crab-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {guitar.maker}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  {/* Title & Period */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-4xl font-black text-white">{guitar.name}</h2>
                      <p className="text-crab-400 font-semibold">{guitar.period} · {guitar.years}</p>
                    </div>
                    {guitar.cost && (
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Original cost</p>
                        <p className="text-lg font-bold text-emerald-400">{guitar.cost}</p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">{guitar.description}</p>

                  {/* Details */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Specifications</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {guitar.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-400">
                          <span className="text-crab-500 mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Notable Shows */}
                  {guitar.notableShows && guitar.notableShows.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">🎸 Notable Shows</h3>
                      <div className="bg-slate-950 rounded-xl p-4">
                        {guitar.notableShows.map((show, i) => (
                          <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0">
                            <span className="text-crab-400 font-mono text-sm">{show.split(' - ')[0]}</span>
                            <span className="text-slate-300">{show.split(' - ').slice(1).join(' - ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Albums */}
                  {guitar.albums && guitar.albums.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">💿 Featured On</h3>
                      <div className="flex flex-wrap gap-2">
                        {guitar.albums.map((album, i) => (
                          <span key={i} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm">
                            {album}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* YouTube Video */}
                  {guitar.youtubeId && (
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">🎬 Watch & Listen</h3>
                      <div className="aspect-video rounded-xl overflow-hidden bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${guitar.youtubeId}`}
                          title={`${guitar.name} performance`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className="border-t border-slate-800 pt-4 mt-6">
                    <p className="text-slate-500 text-sm">
                      <span className="text-slate-400 font-semibold">Current status:</span> {guitar.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 py-12 px-8 text-center">
          <p className="text-slate-500 text-sm">
            Data sourced from jerrygarcia.com and Grateful Dead archives
          </p>
        </footer>
      </div>
    </div>
  );
}
