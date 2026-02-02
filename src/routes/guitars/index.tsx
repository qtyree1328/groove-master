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
    period: "1971–1973",
    startYear: 1971,
    endYear: 1973,
    years: "~2 years",
    maker: "Fender",
    cost: "Gift from Graham Nash",
    description: "1955 Fender Stratocaster with the famous alligator sticker. Gift from Graham Nash for session work on CSNY's 'Déjà Vu' album.",
    details: [
      "1955 swamp-ash body, maple neck",
      "Originally purchased from Phoenix pawnshop for $250",
      "Alembic modifications throughout 1971-1973",
      "Features the iconic alligator sticker"
    ],
    status: "Sold at auction Dec 2019 — $420,000",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/alligator/guitars_gallery_alligator_1.jpg",
    ],
    imageAlt: "Jerry Garcia's Alligator Stratocaster",
    notableShows: [
      "4/8/72 - Wembley Empire Pool, London",
      "8/27/72 - Veneta, OR (Sunshine Daydream)",
    ],
    albums: ["Europe '72"],
    youtubeId: "RvEgkLsaMRQ",
  },
  {
    id: "wolf",
    name: "Wolf",
    period: "1973–1993",
    startYear: 1973,
    endYear: 1993,
    years: "20 years",
    maker: "Doug Irwin",
    cost: "$1,500",
    description: "First major Irwin custom. Named for the cartoon wolf inlay. Jerry's longest-used guitar.",
    details: [
      "Purpleheart and curly maple body",
      "Ebony fingerboard, 24 frets",
      "Wolf inlay replaced sticker in 1977",
      "Weighed about 10 lbs"
    ],
    status: "Auctioned 2017 — $3.2M for Southern Poverty Law Center",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/wolf/guitars_gallery_wolf_1.jpg",
    ],
    imageAlt: "Jerry Garcia's Wolf guitar",
    notableShows: [
      "9/5/73 - Nassau Coliseum (debut)",
      "9/3/77 - Englishtown, NJ",
      "9/15/78 - Giza, Egypt"
    ],
    albums: ["Wake of the Flood", "Blues for Allah", "Terrapin Station"],
    youtubeId: "jGBYVDGbJ7M",
  },
  {
    id: "travis-bean",
    name: "Travis Bean TB500",
    period: "1975–1978",
    startYear: 1975,
    endYear: 1978,
    years: "~3 years",
    maker: "Travis Bean",
    cost: "~$1,000",
    description: "Aluminum-necked guitar with distinctive bright, sustaining tone. Used alongside Wolf.",
    details: [
      "Carved aluminum neck-through design",
      "Koa wood body wings",
      "Stock pickups, no modifications",
      "Known for incredible sustain"
    ],
    status: "Location unknown",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Jerry_Garcia_1977.jpg/440px-Jerry_Garcia_1977.jpg",
    ],
    imageAlt: "Jerry Garcia with Travis Bean",
    notableShows: [
      "6/3/76 - Paramount Theatre, Portland",
      "5/8/77 - Cornell University (legendary show)"
    ],
    albums: ["Steal Your Face"],
    youtubeId: "GdiCSsGwPmo",
  },
  {
    id: "tiger",
    name: "Tiger",
    period: "1979–1989",
    startYear: 1979,
    endYear: 1989,
    years: "10 years",
    maker: "Doug Irwin",
    cost: "$6,000",
    description: "Irwin's masterpiece. The most iconic Grateful Dead guitar with tiger inlay and effects loop.",
    details: [
      "Cocobolo and maple body",
      "Tiger inlay on headstock",
      "Built-in effects loop with unity gain buffer",
      "Weighed 13.5 lbs"
    ],
    status: "Auctioned 2002 — $957,500",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/tiger/guitars_gallery_tiger_1.jpg",
    ],
    imageAlt: "Jerry Garcia's Tiger guitar",
    notableShows: [
      "8/4/79 - Oakland Auditorium (debut)",
      "7/7/89 - JFK Stadium, Philadelphia"
    ],
    albums: ["Go to Heaven", "In the Dark", "Built to Last"],
    youtubeId: "Fk3BRPQLUEU",
  },
  {
    id: "rosebud",
    name: "Rosebud",
    period: "1989–1993",
    startYear: 1989,
    endYear: 1993,
    years: "~4 years",
    maker: "Doug Irwin",
    cost: "$11,000",
    description: "Irwin's most complex build. Featured MIDI capability and dancing skeleton inlay.",
    details: [
      "Quilted and curly maple construction",
      "Integral MIDI pickup system",
      "Dancing skeleton inlay",
      "Took 4.5 years to build"
    ],
    status: "Auctioned 2002 — $789,500",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/rosebud/guitars_gallery_rosebud_1.jpg",
    ],
    imageAlt: "Jerry Garcia's Rosebud guitar",
    notableShows: [
      "10/9/89 - Hampton Coliseum (debut)",
      "3/24/93 - Chapel Hill, NC"
    ],
    albums: ["Without a Net"],
    youtubeId: "JrPpU9cHdYA",
  },
  {
    id: "lightning-bolt",
    name: "Lightning Bolt",
    period: "1993–1995",
    startYear: 1993,
    endYear: 1995,
    years: "~2 years",
    maker: "Stephen Cripe",
    cost: "Gift",
    description: "Built by yacht craftsman Stephen Cripe. Jerry's final main guitar, lightest of his customs.",
    details: [
      "Brazilian rosewood fingerboard",
      "East Indian rosewood body",
      "Only 8.5 lbs",
      "Cripe studied Tiger for 2 years"
    ],
    status: "Rock and Roll Hall of Fame",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/lightning-bolt/guitars_gallery_lightningbolt_1.jpg",
    ],
    imageAlt: "Jerry Garcia's Lightning Bolt guitar",
    notableShows: [
      "8/7/93 - JGB Warfield (debut)",
      "7/9/95 - Soldier Field (final show)"
    ],
    youtubeId: "UOsq_KJnPKE",
  },
];

// Phil Lesh Basses
const philBasses: Instrument[] = [
  {
    id: "guild-starfire",
    name: "Guild Starfire",
    period: "1965–1968",
    startYear: 1965,
    endYear: 1968,
    years: "~3 years",
    maker: "Guild",
    cost: "Unknown",
    description: "Phil's first bass with the Dead. Semi-hollow body with warm, woody tone perfect for early psychedelic era.",
    details: [
      "Semi-hollow body design",
      "Single pickup configuration",
      "Used on early Grateful Dead albums",
      "Warm, rounded tone"
    ],
    status: "Location unknown",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Phil_Lesh_1969.jpg/440px-Phil_Lesh_1969.jpg",
    ],
    imageAlt: "Phil Lesh with Guild Starfire",
    albums: ["The Grateful Dead", "Anthem of the Sun"],
    youtubeId: "3T5nrpVaNgM",
  },
  {
    id: "gibson-eb-1",
    name: "Gibson EB-1",
    period: "1968–1969",
    startYear: 1968,
    endYear: 1969,
    years: "~1 year",
    maker: "Gibson",
    cost: "Unknown",
    description: "Violin-shaped bass that gave Phil a unique look during the Aoxomoxoa era.",
    details: [
      "Violin-shaped mahogany body",
      "Single humbucker pickup",
      "Telescoping end pin",
      "Short scale length"
    ],
    status: "Location unknown",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Gibson_EB-1.jpg/220px-Gibson_EB-1.jpg",
    ],
    imageAlt: "Gibson EB-1 bass",
    albums: ["Aoxomoxoa"],
    youtubeId: "k7MoHNlF_xI",
  },
  {
    id: "alembic-1",
    name: "Big Brown (Alembic)",
    period: "1971–1974",
    startYear: 1971,
    endYear: 1974,
    years: "~3 years",
    maker: "Alembic",
    cost: "Custom build",
    description: "First Alembic bass, featuring groundbreaking active electronics. Started Phil's long partnership with Alembic.",
    details: [
      "Walnut body with maple neck",
      "Active electronics with parametric EQ",
      "Low impedance pickups",
      "Custom preamp built in"
    ],
    status: "Private collection",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Phil_Lesh_1972.jpg/440px-Phil_Lesh_1972.jpg",
    ],
    imageAlt: "Phil Lesh with Alembic bass",
    notableShows: [
      "8/27/72 - Veneta, OR (Sunshine Daydream)"
    ],
    albums: ["Europe '72", "Wake of the Flood"],
    youtubeId: "RvEgkLsaMRQ",
  },
  {
    id: "alembic-mission-control",
    name: "Mission Control",
    period: "1974–1979",
    startYear: 1974,
    endYear: 1979,
    years: "~5 years",
    maker: "Alembic",
    cost: "~$6,000",
    description: "Complex instrument with quadraphonic output and extensive onboard electronics.",
    details: [
      "Quad output capability",
      "Multiple pickup configurations",
      "Extensive EQ controls",
      "Used during Wall of Sound era"
    ],
    status: "Private collection",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Phil_Lesh_1977.jpg/440px-Phil_Lesh_1977.jpg",
    ],
    imageAlt: "Phil Lesh with Mission Control bass",
    notableShows: [
      "10/18/74 - Winterland (Wall of Sound)"
    ],
    albums: ["Mars Hotel", "Blues for Allah"],
    youtubeId: "dbyH4ChjgWY",
  },
  {
    id: "modulus-graphite",
    name: "Modulus Graphite",
    period: "1978–1996",
    startYear: 1978,
    endYear: 1996,
    years: "18 years",
    maker: "Modulus",
    cost: "Various custom builds",
    description: "Carbon fiber neck basses that became Phil's main instruments. Multiple versions built over the years.",
    details: [
      "Carbon fiber/graphite neck",
      "Various body woods",
      "6-string versions available",
      "Exceptional stability and sustain"
    ],
    status: "Various - some in Phil's collection",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Phil_Lesh_1987.jpg/440px-Phil_Lesh_1987.jpg",
    ],
    imageAlt: "Phil Lesh with Modulus bass",
    notableShows: [
      "7/7/89 - JFK Stadium",
      "7/9/95 - Soldier Field (final show)"
    ],
    albums: ["In the Dark", "Built to Last"],
    youtubeId: "fku0BxQOFig",
  },
  {
    id: "ritter-6-string",
    name: "Ritter 6-String",
    period: "2000–present",
    startYear: 2000,
    endYear: 2024,
    years: "24+ years",
    maker: "Ritter Instruments",
    cost: "~$10,000+",
    description: "German-made custom 6-string bass. Phil's main instrument for Phil Lesh & Friends and Dead & Co.",
    details: [
      "6-string configuration",
      "German craftsmanship",
      "Custom electronics",
      "Multiple versions built"
    ],
    status: "Currently in use",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Phil_Lesh_2010.jpg/440px-Phil_Lesh_2010.jpg",
    ],
    imageAlt: "Phil Lesh with Ritter bass",
    notableShows: [
      "Various Phil Lesh & Friends shows",
      "Dead & Company tours"
    ],
    youtubeId: "1YGepMKLeyI",
  },
];

type Artist = "jerry" | "phil";

function GuitarHistory() {
  const [artist, setArtist] = useState<Artist>("jerry");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeGuitar, setActiveGuitar] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const guitarRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const instruments = artist === "jerry" ? jerryGuitars : philBasses;

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
  }, [artist]);

  // Reset scroll when switching artists
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    guitarRefs.current = {};
    setActiveGuitar(null);
  }, [artist]);

  const minYear = Math.min(...instruments.map(g => g.startYear));
  const maxYear = Math.max(...instruments.map(g => g.endYear));
  const yearRange = maxYear - minYear;

  const getYearFromProgress = (progress: number) => {
    return Math.round(minYear + progress * yearRange);
  };

  const currentYear = getYearFromProgress(scrollProgress);
  const activeInstrument = instruments.find(g => g.id === activeGuitar);

  // Find overlapping instruments for timeline
  const getInstrumentsAtYear = (year: number) => {
    return instruments.filter(g => year >= g.startYear && year <= g.endYear);
  };

  const overlappingNow = getInstrumentsAtYear(currentYear);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-white">
      {/* Fixed Progress Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-16 bg-slate-900/95 backdrop-blur border-r border-slate-800 z-50 flex flex-col items-center py-4">
        <Link to="/" className="text-slate-500 hover:text-white text-xs mb-4">←</Link>
        
        {/* Year Display */}
        <div className="text-center mb-3">
          <div className="text-xl font-black text-crab-400">{currentYear}</div>
        </div>
        
        {/* Vertical Progress Bar */}
        <div className="flex-1 w-1.5 bg-slate-800 rounded-full relative mx-auto">
          <div 
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-crab-500 to-crab-700 rounded-full transition-all duration-150"
            style={{ height: `${scrollProgress * 100}%` }}
          />
          
          {/* Instrument markers on timeline - handle overlaps */}
          {instruments.map((guitar) => {
            const midYear = (guitar.startYear + guitar.endYear) / 2;
            const position = ((midYear - minYear) / yearRange) * 100;
            const overlaps = instruments.filter(g => 
              g.id !== guitar.id && 
              !(g.endYear < guitar.startYear || g.startYear > guitar.endYear)
            );
            const offset = overlaps.length > 0 ? (instruments.indexOf(guitar) % 2 === 0 ? -6 : 6) : 0;
            
            return (
              <div
                key={guitar.id}
                className={`absolute w-3 h-3 rounded-full border-2 transition-all cursor-pointer ${
                  activeGuitar === guitar.id 
                    ? 'bg-crab-500 border-crab-300 scale-125 z-10' 
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                }`}
                style={{ 
                  top: `${position}%`, 
                  left: `50%`,
                  transform: `translate(calc(-50% + ${offset}px), -50%)`
                }}
                onClick={() => {
                  guitarRefs.current[guitar.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                title={`${guitar.name} (${guitar.period})`}
              />
            );
          })}
        </div>
        
        {/* Year range */}
        <div className="mt-3 text-center">
          <div className="text-[10px] text-slate-500">{minYear}</div>
          <div className="text-[10px] text-slate-500">{maxYear}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-16">
        {/* Compact Header with Artist Toggle */}
        <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-3 px-4 sticky top-0 z-40 border-b border-slate-700">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {/* Artist Toggle */}
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setArtist("jerry")}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  artist === "jerry" 
                    ? "bg-crab-600 text-white" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🎸 Jerry Garcia
              </button>
              <button
                onClick={() => setArtist("phil")}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  artist === "phil" 
                    ? "bg-indigo-600 text-white" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🎸 Phil Lesh
              </button>
            </div>

            {/* Current Instrument */}
            <div className="text-right">
              {activeInstrument ? (
                <div>
                  <span className="font-bold text-white">{activeInstrument.name}</span>
                  <span className="text-slate-400 ml-2 text-sm">{activeInstrument.period}</span>
                </div>
              ) : (
                <span className="text-slate-500 text-sm">Scroll to explore</span>
              )}
            </div>
          </div>
          
          {/* Overlapping instruments indicator */}
          {overlappingNow.length > 1 && (
            <div className="max-w-4xl mx-auto mt-2">
              <div className="text-xs text-slate-400">
                Active in {currentYear}: {overlappingNow.map(g => g.name).join(", ")}
              </div>
            </div>
          )}
        </header>

        {/* Instrument Cards */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {instruments.map((guitar) => (
            <div
              key={guitar.id}
              ref={(el) => { guitarRefs.current[guitar.id] = el; }}
              className="mb-16 scroll-mt-24"
            >
              {/* Year marker */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl font-black text-slate-800">{guitar.startYear}</div>
                <div className="flex-1 h-px bg-slate-800"></div>
                <div className="text-sm text-slate-600">{guitar.years}</div>
              </div>

              {/* Guitar Card */}
              <div className={`bg-slate-900 rounded-xl overflow-hidden border transition-all duration-300 ${
                activeGuitar === guitar.id ? 'border-crab-500 shadow-lg shadow-crab-500/20' : 'border-slate-800'
              }`}>
                {/* Image Section */}
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex justify-center">
                  <img
                    src={guitar.images[0]}
                    alt={guitar.imageAlt}
                    className="max-h-64 object-contain drop-shadow-2xl"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                    }}
                  />
                  <div className={`absolute top-3 right-3 ${artist === 'jerry' ? 'bg-crab-600' : 'bg-indigo-600'} text-white px-2 py-0.5 rounded-full text-xs font-bold`}>
                    {guitar.maker}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Title & Period */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-2xl font-black text-white">{guitar.name}</h2>
                      <p className={`${artist === 'jerry' ? 'text-crab-400' : 'text-indigo-400'} font-semibold text-sm`}>{guitar.period}</p>
                    </div>
                    {guitar.cost && (
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Cost</p>
                        <p className="text-sm font-bold text-emerald-400">{guitar.cost}</p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 leading-relaxed mb-4">{guitar.description}</p>

                  {/* Details */}
                  <div className="mb-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Specs</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      {guitar.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className={`${artist === 'jerry' ? 'text-crab-500' : 'text-indigo-500'} mt-0.5`}>•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Notable Shows */}
                  {guitar.notableShows && guitar.notableShows.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Notable Shows</h3>
                      <div className="bg-slate-950 rounded-lg p-3">
                        {guitar.notableShows.map((show, i) => (
                          <div key={i} className="flex items-center gap-2 py-1.5 border-b border-slate-800 last:border-0 text-sm">
                            <span className={`${artist === 'jerry' ? 'text-crab-400' : 'text-indigo-400'} font-mono text-xs`}>{show.split(' - ')[0]}</span>
                            <span className="text-slate-300">{show.split(' - ').slice(1).join(' - ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Albums */}
                  {guitar.albums && guitar.albums.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Albums</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {guitar.albums.map((album, i) => (
                          <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs">
                            {album}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* YouTube Video */}
                  {guitar.youtubeId && (
                    <div className="mb-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Watch & Listen</h3>
                      <div className="aspect-video rounded-lg overflow-hidden bg-black">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${guitar.youtubeId}?rel=0`}
                          title={`${guitar.name} performance`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className="border-t border-slate-800 pt-3 mt-4">
                    <p className="text-slate-500 text-xs">
                      <span className="text-slate-400 font-semibold">Status:</span> {guitar.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-center">
          <p className="text-slate-500 text-xs">
            Data sourced from jerrygarcia.com and Grateful Dead archives
          </p>
        </footer>
      </div>
    </div>
  );
}
