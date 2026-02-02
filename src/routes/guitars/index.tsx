import { createFileRoute } from "@tanstack/react-router";
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
  sketchfabId?: string;
  cost?: string;
  maker: string;
}

// Jerry Garcia Guitars with galleries
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
    sketchfabId: "737a9d0c88a54efba8898b9164831ed5",
    description: "1955 Fender Stratocaster with the famous alligator sticker. Gift from Graham Nash for session work.",
    details: [
      "1955 swamp-ash body, maple neck",
      "Originally purchased from Phoenix pawnshop for $250",
      "Nicknamed 'Frankenstein' - constantly evolving mods",
      "Alembic modifications throughout 1971-1973"
    ],
    status: "Sold at auction Dec 2019 — $420,000",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/alligator/guitars_gallery_alligator_1.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/alligator/guitars_gallery_alligator_2.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/alligator/guitars_gallery_alligator_3.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/alligator/guitars_gallery_alligator_4.jpg",
    ],
    imageAlt: "Jerry Garcia's Alligator Stratocaster",
    notableShows: ["Europe '72", "Last played 8/1/73"],
    albums: ["Europe '72"],
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
    description: "First major Irwin custom. Named for the cartoon wolf sticker Jerry placed on it.",
    details: [
      "Purpleheart and curly maple body",
      "Ebony fingerboard, 24 frets, 25\" scale",
      "Wolf inlay replaced sticker in 1977"
    ],
    status: "Auctioned 2017 — $3.2M for Southern Poverty Law Center",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/wolf/guitars_gallery_wolf_1.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/wolf/guitars_gallery_wolf_2.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/wolf/guitars_gallery_wolf_3.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/wolf/guitars_gallery_wolf_4.jpg",
    ],
    imageAlt: "Jerry Garcia's Wolf guitar by Doug Irwin",
    notableShows: ["First played 9/5/73", "Egypt 1978"],
    albums: ["Wake of the Flood", "Mars Hotel"],
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
    description: "Revolutionary aluminum-neck guitar. TB500 #12 was used at Cornell '77.",
    details: [
      "Machined aluminum neck (revolutionary design)",
      "Solid Hawaiian Koa body",
      "'The Enemy is Listening' sticker",
      "First guitar with OBEL effects loop"
    ],
    status: "TB500 #12 owned by collector Jason Scheuner",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/travis-bean/photo01.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/travis-bean/photo02.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/travis-bean/photo03.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/travis-bean/photo04.jpg",
    ],
    imageAlt: "Jerry Garcia's Travis Bean TB500",
    notableShows: ["Cornell 5/8/77", "Englishtown 9/3/77"],
    albums: ["Terrapin Station", "Cats Under the Stars"],
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
    sketchfabId: "f2e9dc6041734cc5ab13aa43ec6cbcf7",
    description: "Jerry's most-played guitar. \"Don't hold back,\" he told Irwin. This 13.5 lb masterpiece took 6 years to build.",
    details: [
      "Cocobolo, vermilion, maple 'hippie sandwich'",
      "Solid brass binding and hardware",
      "Weight: 13.5 lbs",
      "12 discrete tonal voices"
    ],
    status: "Owned by Jim Irsay — $850,000",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/tiger/guitars_gallery_tiger_1.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/tiger/guitars_gallery_tiger_2.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/tiger/guitars_gallery_tiger_3.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/tiger/guitars_gallery_tiger_4.jpg",
    ],
    imageAlt: "Jerry Garcia's Tiger guitar by Doug Irwin",
    notableShows: ["First played 8/4/79", "Final show 7/9/95"],
    albums: ["Go to Heaven", "In the Dark", "Built to Last"],
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
    description: "Irwin's masterpiece. Twin of Tiger but 2 lbs lighter with built-in MIDI.",
    details: [
      "Hollowed flame-maple core (11.5 lbs)",
      "Built-in MIDI controls from start",
      "Named for 'The Saint' dancing skeleton inlay"
    ],
    status: "Rock and Roll Hall of Fame",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/rosebud/guitars_gallery_rosebud_1.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/rosebud/guitars_gallery_rosebud_2.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/rosebud/guitars_gallery_rosebud_3.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/rosebud/guitars_gallery_rosebud_4.jpg",
    ],
    imageAlt: "Jerry Garcia's Rosebud guitar by Doug Irwin",
    notableShows: ["First played 12/31/89", "Final show 7/9/95"],
    albums: ["Without a Net", "Infrared Roses"],
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
    description: "\"The guitar I've always been waiting for.\" Built by a yacht craftsman who studied videos to replicate Tiger.",
    details: [
      "Recycled Brazilian rosewood fingerboard",
      "East Indian rosewood body from antique opium bed",
      "Electronics redone by Gary Brawer for MIDI"
    ],
    status: "Rock and Roll Hall of Fame",
    images: [
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/lightning-bolt/guitars_gallery_lightningbolt_1.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/lightning-bolt/guitars_gallery_lightningbolt_2.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/lightning-bolt/guitars_gallery_lightningbolt_3.jpg",
      "https://jerrygarcia.com/wp-content/themes/jerry-garcia/images/guitar/lightning-bolt/guitars_gallery_lightningbolt_4.jpg",
    ],
    imageAlt: "Jerry Garcia's Lightning Bolt guitar by Stephen Cripe",
    notableShows: ["First played 8/7/93 JGB", "Last played 6/4/95"],
  },
];

// Phil Lesh Basses
const philBasses: Instrument[] = [
  {
    id: "gibson-eb0f",
    name: "Gibson EB-0F",
    period: "1965 – 1966",
    startYear: 1965,
    endYear: 1966,
    years: "1.5 years",
    maker: "Gibson",
    description: "Phil's first bass ever. He'd never played bass before joining the Warlocks.",
    details: [
      "Only 265 EB-0F models ever made",
      "Factory built-in fuzz tone unit",
      "Phil's introduction to bass guitar"
    ],
    status: "Whereabouts unknown",
    images: [
      "https://gdsets.com/philbasses/EB0Fa.jpg",
      "https://gdsets.com/philbasses/EB0Fb.jpg",
    ],
    imageAlt: "Phil Lesh's Gibson EB-0F bass",
    notableShows: ["Acid Tests", "Early Warlocks gigs"],
  },
  {
    id: "gibson-eb3",
    name: "Gibson EB-3 Paisley",
    period: "1969 – 1971",
    startYear: 1969,
    endYear: 1971,
    years: "2 years",
    maker: "Gibson",
    description: "Psychedelic paisley red finish. Played at Woodstock.",
    details: [
      "Custom paisley red finish",
      "SG-style body",
      "Two pickup configuration"
    ],
    status: "Whereabouts unknown",
    images: [
      "https://gdsets.com/philbasses/EB3.jpg",
    ],
    imageAlt: "Phil Lesh's paisley Gibson EB-3",
    notableShows: ["Woodstock 1969", "Fillmore West"],
    albums: ["Live/Dead", "Workingman's Dead", "American Beauty"],
  },
  {
    id: "big-brown",
    name: "Big Brown",
    period: "1971 – 1974",
    startYear: 1971,
    endYear: 1974,
    years: "3 years",
    maker: "Alembic",
    description: "The Guild Starfire reborn. Alembic added 14 control knobs and created a legend.",
    details: [
      "Guild Starfire body, completely rebuilt",
      "12-14 control knobs depending on version",
      "Steal Your Face sticker added 1974"
    ],
    status: "Phil's collection",
    images: [
      "https://gdsets.com/philbasses/bigbrown_layout.jpg",
      "https://gdsets.com/philbasses/bb1.jpg",
      "https://gdsets.com/philbasses/bb2.jpg",
    ],
    imageAlt: "Phil Lesh's Alembic Big Brown bass",
    notableShows: ["Europe '72", "Watkins Glen 1973"],
    albums: ["Europe '72", "Wake of the Flood"],
  },
  {
    id: "mission-control",
    name: "Mission Control",
    period: "1974 – 1979",
    startYear: 1974,
    endYear: 1979,
    years: "5 years",
    maker: "Alembic",
    description: "THE legendary bass. Electronics alone cost $30,000 (≈$200K today).",
    details: [
      "Serial #74-00008 — only 8th Alembic ever",
      "Hawaiian koa top and back",
      "11 exotic inlays including hashish",
      "Quad pickup for 4 separate speaker towers"
    ],
    status: "Private collection (restored 2020)",
    images: [
      "https://gdsets.com/philbasses/mc_large.jpg",
      "https://gdsets.com/philbasses/mc1.jpg",
      "https://gdsets.com/philbasses/mc2.jpg",
    ],
    imageAlt: "Phil Lesh's Alembic Mission Control bass",
    notableShows: ["Wall of Sound 1974", "Cornell 5/8/77", "Egypt 1978"],
    albums: ["Mars Hotel", "Blues for Allah", "Terrapin Station"],
  },
  {
    id: "modulus-4",
    name: "Modulus #4",
    period: "1985 – 1987",
    startYear: 1985,
    endYear: 1987,
    years: "2 years",
    maker: "Modulus/Irwin",
    description: "All carbon fiber collaboration with Doug Irwin. Used on In The Dark.",
    details: [
      "All carbon fiber construction",
      "Hollow body and neck",
      "Irwin carved mahogany mold"
    ],
    status: "Private collection",
    images: [
      "https://gdsets.com/philbasses/modulus4a.jpg",
      "https://gdsets.com/philbasses/modulus4b.jpg",
    ],
    imageAlt: "Phil Lesh's Modulus #4 carbon fiber bass",
    albums: ["In The Dark"],
  },
  {
    id: "modulus-7",
    name: "Modulus #7",
    period: "1991 – 1995",
    startYear: 1991,
    endYear: 1995,
    years: "4 years",
    maker: "Modulus",
    description: "Phil's workhorse through the final years. Last bass played with Jerry.",
    details: [
      "Primary touring bass 1991-1993",
      "Returned for final 1995 tour",
      "Last bass played with Jerry"
    ],
    status: "Phil's collection",
    images: [
      "https://gdsets.com/philbasses/modulus8a.jpg",
    ],
    imageAlt: "Phil Lesh's Modulus #7 bass",
    notableShows: ["Final Grateful Dead shows July 1995"],
  },
];

function GuitarHistory() {
  const [activeTab, setActiveTab] = useState<"jerry" | "phil">("jerry");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [show3D, setShow3D] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const instruments = activeTab === "jerry" ? jerryGuitars : philBasses;
  const current = instruments[currentIndex];
  
  // Timeline calculations
  const minYear = Math.min(...instruments.map(i => i.startYear));
  const maxYear = Math.max(...instruments.map(i => i.endYear));
  const yearRange = maxYear - minYear;

  // Auto-advance animation
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % instruments.length);
          setGalleryIndex(0);
          setShow3D(false);
          setIsTransitioning(false);
        }, 300);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, instruments.length]);

  // Reset on tab change
  useEffect(() => {
    setCurrentIndex(0);
    setGalleryIndex(0);
    setShow3D(false);
  }, [activeTab]);

  const goTo = (index: number) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setGalleryIndex(0);
      setShow3D(false);
      setIsTransitioning(false);
    }, 300);
  };

  const getTimelinePosition = (instrument: Instrument) => {
    const midYear = (instrument.startYear + instrument.endYear) / 2;
    return ((midYear - minYear) / yearRange) * 100;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 via-red-600 to-orange-600 text-white py-6 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <a href="/" className="text-white/80 hover:text-white text-sm">← Back</a>
          
          <div className="text-center mt-4">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              <span className="inline-block transform -rotate-2">GRATEFUL DEAD</span>
            </h1>
            <p className="text-white/90 text-lg tracking-widest uppercase mt-1">Instrument Timeline</p>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setActiveTab("jerry")}
              className={`px-6 py-2 font-bold uppercase tracking-wide rounded-full transition-all ${
                activeTab === "jerry"
                  ? "bg-white text-red-700 shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Jerry Garcia
            </button>
            <button
              onClick={() => setActiveTab("phil")}
              className={`px-6 py-2 font-bold uppercase tracking-wide rounded-full transition-all ${
                activeTab === "phil"
                  ? "bg-white text-red-700 shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Phil Lesh
            </button>
          </div>
        </div>
      </header>

      {/* Timeline Bar */}
      <div className="bg-gray-100 border-b border-gray-200 py-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          {/* Year markers */}
          <div className="relative h-16">
            {/* Timeline track */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-300 rounded-full" />
            
            {/* Year labels */}
            <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-gray-500 font-mono px-2">
              {Array.from({ length: Math.ceil(yearRange / 5) + 1 }, (_, i) => {
                const year = minYear + i * 5;
                if (year > maxYear + 2) return null;
                return (
                  <span key={year} style={{ position: 'absolute', left: `${((year - minYear) / yearRange) * 100}%`, transform: 'translateX(-50%)' }}>
                    {year}
                  </span>
                );
              })}
            </div>
            
            {/* Instrument markers */}
            {instruments.map((instrument, idx) => {
              const pos = getTimelinePosition(instrument);
              const isActive = idx === currentIndex;
              const spanWidth = ((instrument.endYear - instrument.startYear) / yearRange) * 100;
              const spanStart = ((instrument.startYear - minYear) / yearRange) * 100;
              
              return (
                <div key={instrument.id}>
                  {/* Active span highlight */}
                  {isActive && (
                    <div 
                      className="absolute top-7 h-3 bg-red-500/30 rounded-full transition-all duration-500"
                      style={{ 
                        left: `${spanStart}%`, 
                        width: `${spanWidth}%`,
                      }}
                    />
                  )}
                  
                  {/* Marker dot */}
                  <button
                    onClick={() => goTo(idx)}
                    className={`absolute top-6 w-5 h-5 rounded-full border-2 transition-all duration-300 transform -translate-x-1/2 hover:scale-125 ${
                      isActive
                        ? "bg-red-600 border-red-600 scale-125 shadow-lg ring-4 ring-red-200"
                        : "bg-white border-gray-400 hover:border-red-500"
                    }`}
                    style={{ left: `${pos}%` }}
                    title={instrument.name}
                  />
                </div>
              );
            })}
          </div>
          
          {/* Current instrument name on timeline */}
          <div 
            className="text-center mt-2 transition-all duration-300"
            style={{ 
              transform: `translateX(${(getTimelinePosition(current) - 50) * 0.3}%)`,
            }}
          >
            <span className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
              {current.name} • {current.period}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Playback controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => goTo((currentIndex - 1 + instruments.length) % instruments.length)}
            className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xl transition-all shadow-md hover:shadow-lg"
          >
            ←
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-12 h-12 rounded-full font-bold text-xl transition-all shadow-md hover:shadow-lg ${
              isPlaying 
                ? "bg-red-600 text-white hover:bg-red-700" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            onClick={() => goTo((currentIndex + 1) % instruments.length)}
            className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xl transition-all shadow-md hover:shadow-lg"
          >
            →
          </button>
        </div>

        {/* Featured instrument card */}
        <div 
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image section */}
            <div className="lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center min-h-[400px] relative">
              {/* Big year watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <span className="text-[200px] font-black text-gray-200/50 select-none">
                  {current.startYear.toString().slice(-2)}
                </span>
              </div>
              
              <img
                src={current.images[galleryIndex]}
                alt={current.imageAlt}
                className="max-h-[350px] w-auto object-contain drop-shadow-2xl relative z-10 transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f3f4f6' width='300' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle'%3EImage unavailable%3C/text%3E%3C/svg%3E";
                }}
              />
              
              {/* Image gallery dots */}
              {current.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                  {current.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGalleryIndex(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        idx === galleryIndex 
                          ? "bg-red-600 scale-125" 
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* 3D badge */}
              {current.sketchfabId && (
                <button
                  onClick={() => setShow3D(!show3D)}
                  className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg hover:bg-green-600 transition-all z-20"
                >
                  🎮 3D
                </button>
              )}
            </div>

            {/* Info section */}
            <div className="lg:w-1/2 p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-red-600 text-sm font-bold uppercase tracking-wider">{current.maker}</p>
                  <h2 className="text-4xl font-black text-gray-900 mt-1">{current.name}</h2>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-gray-300">{current.period.split(' ')[0]}</p>
                  <p className="text-sm text-gray-500">{current.years}</p>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">{current.description}</p>

              {current.cost && (
                <p className="text-sm mb-4">
                  <span className="text-gray-500">Original cost:</span>{" "}
                  <span className="text-green-600 font-semibold">{current.cost}</span>
                </p>
              )}

              <div className="mb-6">
                <h3 className="text-red-600 text-sm font-bold uppercase tracking-wider mb-3">Specifications</h3>
                <ul className="space-y-2">
                  {current.details.map((d, i) => (
                    <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">●</span>{d}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {current.albums?.map((a, i) => (
                  <span key={i} className="bg-red-100 text-red-700 px-3 py-1 text-xs font-semibold rounded-full">{a}</span>
                ))}
                {current.notableShows?.map((s, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold rounded-full">{s}</span>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm">
                  <span className="text-gray-500">Current status:</span>{" "}
                  <span className="text-gray-900 font-semibold">{current.status}</span>
                </p>
              </div>
            </div>
          </div>

          {/* 3D Viewer */}
          {show3D && current.sketchfabId && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-inner">
                <iframe
                  title={`${current.name} 3D`}
                  className="w-full h-full"
                  src={`https://sketchfab.com/models/${current.sketchfabId}/embed?autostart=1&ui_theme=dark`}
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                />
              </div>
            </div>
          )}
        </div>

        {/* Instrument thumbnails */}
        <div className="mt-8 flex gap-3 overflow-x-auto pb-4 justify-center flex-wrap">
          {instruments.map((instrument, idx) => (
            <button
              key={instrument.id}
              onClick={() => goTo(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                idx === currentIndex 
                  ? "ring-4 ring-red-500 scale-110 shadow-lg" 
                  : "opacity-60 hover:opacity-100 hover:scale-105"
              }`}
            >
              <img 
                src={instrument.images[0]} 
                alt={instrument.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 text-center mt-12">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-gray-500 text-sm mb-2">
            Sources: jerrygarcia.com • gdsets.com • irwin-guitars.com • Jim Irsay Collection
          </p>
          <p className="text-gray-400 text-xs">Jerry Garcia (1942–1995) • Phil Lesh (1940–2024)</p>
          <p className="text-3xl mt-4">⚡💀🌹</p>
        </div>
      </footer>
    </div>
  );
}
