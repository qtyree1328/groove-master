import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/phil-lesh/")({
  component: PhilLeshBasses,
});

interface Bass {
  id: string;
  name: string;
  period: string;
  years: string;
  description: string;
  details: string[];
  status: string;
  imageUrl?: string;
  imageCredit?: string;
  notableShows?: string[];
  albums?: string[];
}

const basses: Bass[] = [
  {
    id: "gibson-eb0f",
    name: "Gibson EB-0F",
    period: "1965 – Aug 1966",
    years: "~1.5 years",
    description: "Phil's first bass with the Warlocks/early Grateful Dead. A rare variant with factory built-in fuzz tone unit.",
    details: [
      "Red finish",
      "Factory built-in fuzz tone unit",
      "Only 265 EB-0F models were ever produced",
      "Short scale (30.5\")",
      "Single mudbucker pickup",
      "Phil had never played bass before joining the band"
    ],
    status: "Whereabouts unknown",
    imageUrl: "https://gdsets.com/philbasses/EB0Fa.jpg",
    imageCredit: "Paul Ryan",
    notableShows: ["Early Warlocks gigs", "Acid Tests"],
  },
  {
    id: "fender-jazz-1",
    name: "Fender Jazz Bass",
    period: "Sep 1966 – Jun 1967",
    years: "~10 months",
    description: "Phil's transition to the classic Fender tone. Used during the band's early San Francisco scene period.",
    details: [
      "Standard Fender Jazz Bass",
      "Two single-coil pickups",
      "34\" scale length",
      "Versatile tone shaping"
    ],
    status: "Whereabouts unknown",
    imageCredit: "Susan Elting Hillyard",
    notableShows: ["1967 Human Be-In", "Early Fillmore shows"],
  },
  {
    id: "guild-starfire-red",
    name: "Guild Starfire (Red)",
    period: "Jul 1967 – Jun 1969",
    years: "~2 years",
    description: "The bass that would later become the legendary 'Big Brown'. Semi-hollow body with warm, rich tone.",
    details: [
      "Red finish (original)",
      "Semi-hollow body construction",
      "Bisonic single-coil pickup",
      "Short scale",
      "Later stripped and modified by Alembic"
    ],
    status: "In Phil's collection (as Big Brown)",
    imageCredit: "Leni Sinclair",
    notableShows: ["Anthem of the Sun sessions", "Aoxomoxoa sessions"],
    albums: ["Anthem of the Sun (1968)", "Aoxomoxoa (1969)"],
  },
  {
    id: "gibson-eb3-paisley",
    name: "Gibson EB-3 (Paisley Red)",
    period: "Jun 1969 – Jun 1971",
    years: "~2 years",
    description: "A psychedelic paisley-finished EB-3, used during some of the Dead's most legendary performances.",
    details: [
      "Paisley red custom finish",
      "Two pickups (mudbucker + mini-humbucker)",
      "4-way rotary selector switch",
      "30.5\" short scale",
      "SG-style body"
    ],
    status: "Whereabouts unknown",
    imageCredit: "Steve Deibel",
    notableShows: ["Woodstock (1969)", "Fillmore West runs"],
    albums: ["Live/Dead (1969)", "Workingman's Dead (1970)", "American Beauty (1970)"],
  },
  {
    id: "alembic-big-brown",
    name: 'Alembic "Big Brown"',
    period: "Jul 1971 – Jun 1974",
    years: "~3 years",
    description: "The legendary modified Guild Starfire. Alembic stripped the red finish, replaced electronics, and created one of rock's most iconic basses.",
    details: [
      "Originally the red Guild Starfire",
      "Stripped to natural wood finish",
      "Custom Alembic active electronics",
      "12-14 control knobs across versions",
      "Trapezoidal pickups (later replaced with standard Alembic)",
      "Multiple hardware revisions (V1-V3)",
      "Steal Your Face sticker added Feb 1974",
      "Apollo 8 sticker added later"
    ],
    status: "In Phil's collection",
    imageUrl: "https://gdsets.com/philbasses/bigbrown_layout.jpg",
    imageCredit: "Dr. Bob Marks / Larry Kasperek",
    notableShows: ["Europe '72 tour", "Watkins Glen (1973)", "Winterland runs"],
    albums: ["Europe '72", "Wake of the Flood (1973)"],
  },
  {
    id: "alembic-mission-control",
    name: 'Alembic "Mission Control"',
    period: "Jun 1974 – Jul 1979",
    years: "~5 years",
    description: "The Omega. Osiris. Perhaps the most famous bass in Dead history. Hand-built by Rick Turner, this pioneered the boutique bass concept.",
    details: [
      "Serial number 74 00008",
      "Only the 8th instrument built by Alembic",
      "Hawaiian koa top and back",
      "Mahogany core with maple and walnut veneers",
      "Osage orange, walnut, and maple 7-laminate neck-through",
      "Ebony fingerboard with 11 exotic inlays",
      "Red and green LED dot markers (only 3rd set ever installed)",
      "Low-impedance wide-aperture pickups + quad pickup",
      "10 push-button switches for quad speaker routing",
      "Electronics cost ~$30,000 (~$200,000 today)",
      "Brazilian rosewood headstock overlay",
      "Inlay materials: mother-of-pearl, abalone, brass, opal, lapis lazuli, hashish"
    ],
    status: "In a private collection (restored 2020)",
    imageUrl: "https://gdsets.com/philbasses/mc_large.jpg",
    imageCredit: "Various / Lisa S. Johnson",
    notableShows: [
      "Wall of Sound era (1974)",
      "Great American Music Hall (1975)",
      "Cornell 5/8/77",
      "Egypt at the Pyramids (1978)",
      "Winterland closing (12/31/78)"
    ],
    albums: ["Mars Hotel (1974)", "Blues for Allah (1975)", "Terrapin Station (1977)", "Shakedown Street (1978)"],
  },
  {
    id: "doug-irwin-custom",
    name: "Doug Irwin Custom",
    period: "Oct 1979 – Jul 1981",
    years: "~2 years",
    description: "Custom bass built by legendary luthier Doug Irwin, who also built Jerry Garcia's famous Tiger and Wolf guitars.",
    details: [
      "Custom neck-through construction",
      "Built by Doug Irwin",
      "Same craftsman who built Jerry's iconic guitars",
      "Unique body shape"
    ],
    status: "In Phil's collection",
    imageCredit: "David Gans",
    notableShows: ["Radio City Music Hall (1980)", "Warfield Theatre runs"],
    albums: ["Go to Heaven (1980)", "Reckoning (1981)", "Dead Set (1981)"],
  },
  {
    id: "fender-jazz-2",
    name: "Fender Jazz Bass (Stripped)",
    period: "Aug 1981 – Oct 1981",
    years: "~2 months",
    description: "Obtained from a neighbor in Fairfax. Natural wood with pickguard removed.",
    details: [
      "Stripped natural finish",
      "Pickguard removed",
      "Model year unknown",
      "Similar to his 1967 Jazz Bass"
    ],
    status: "Apparently stolen from GD warehouse",
    imageCredit: "Clayton Call",
  },
  {
    id: "gl-l2000e",
    name: "G&L L-2000-E",
    period: "Nov 1981 – Nov 1982",
    years: "~1 year",
    description: "Stock G&L with Phil's custom modifications to the switching and filtering.",
    details: [
      "Modified 2nd switch: series/parallel → low pass filter",
      "Added low pass filter switch between tone knobs",
      "Added trim pot above jack for treble boost control",
      "Leo Fender's post-Fender design"
    ],
    status: "In a private collection",
    imageCredit: "Dave Stotts",
  },
  {
    id: "modulus-1",
    name: "Modulus Graphite #1",
    period: "Dec 1982 – Jun 1983",
    years: "~6 months",
    description: "Phil's first graphite-neck Modulus. Six-string with neck-through design.",
    details: [
      "Six-string configuration",
      "Graphite neck-through body design",
      "Quilted maple top",
      "Narrower string spacing than 4-string basses"
    ],
    status: "In Phil's collection",
    imageCredit: "Ed Perlstein",
  },
  {
    id: "modulus-2",
    name: "Modulus #2",
    period: "Jul 1983 – Oct 1984",
    years: "~1.5 years",
    description: "Similar construction to #1, went through multiple pickup configurations.",
    details: [
      "Neck-through body construction",
      "Quilted maple top (center section)",
      "Wings sticker added Aug 1983",
      "Multiple versions with pickup modifications"
    ],
    status: "In Phil's collection",
    notableShows: ["Greek Theatre runs", "Radio City 1983"],
  },
  {
    id: "modulus-3",
    name: "Modulus #3",
    period: "Oct 1984 – Sep 1985",
    years: "~1 year",
    description: "Featured a striking red Narra wood top from the Philippines.",
    details: [
      "Neck-through body construction",
      "Red Narra top from Philippines",
      "Body 'sandwich' construction visible from side",
      "Roland GK-1 MIDI kit added temporarily in 1988"
    ],
    status: "In Phil's collection",
    imageCredit: "Robbi Cohn",
  },
  {
    id: "modulus-4",
    name: "Modulus #4 (Irwin Collaboration)",
    period: "Oct 1985 – Mar 1987",
    years: "~1.5 years",
    description: "All carbon fiber with hollow body. Doug Irwin carved the mahogany mold. Used on In The Dark!",
    details: [
      "All carbon fiber construction",
      "Hollow body and neck",
      "Doug Irwin carved mahogany plug for mold (destroyed in process)",
      "Irwin-esque body shape",
      "A similar build was planned for Jerry but cancelled",
      "First appeared at So Far video shoot (Apr 1985)"
    ],
    status: "In a private collection",
    imageCredit: "Ron Delany / Dave Stotts",
    albums: ["In The Dark (1987)"],
    notableShows: ["Touch of Grey video shoot", "New Year's Eve 1986"],
  },
  {
    id: "modulus-5",
    name: "Modulus #5",
    period: "Mar 1987 – Dec 1989",
    years: "~2.5 years",
    description: "Headless design with spruce core and graphite plates. Only 7 pounds!",
    details: [
      "Headless design",
      "Spruce core",
      "0.1\" graphite top/back plates",
      "Neck-through graphite neck",
      "All aluminum hardware (milled by Larry Robinson)",
      "Weight: only 7 pounds",
      "Received custom paint job Feb 1988"
    ],
    status: "In Phil's collection",
    imageCredit: "Robbi Cohn",
    notableShows: ["Dylan & The Dead tour (1987)"],
    albums: ["Dylan & The Dead (1989)"],
  },
  {
    id: "ken-smith-1",
    name: "Ken Smith BT-6 #1",
    period: "Dec 1989 – Jun 1990",
    years: "~6 months",
    description: "Custom BT-6 with tiger maple top. Built December 8, 1989.",
    details: [
      "Serial #89608",
      "Tiger maple top",
      "Walnut veneer, mahogany core, maple veneer",
      "Macassar ebony back",
      "Gold hardware",
      "Build completed December 8, 1989"
    ],
    status: "In a private collection",
    imageCredit: "Rich Saputo",
  },
  {
    id: "modulus-6",
    name: "Modulus #6 (Q6 Prototype)",
    period: "Jun 1990 – Jul 1990",
    years: "~1 month",
    description: "Prototype of the Modulus Quantum 6 that would later become a production model.",
    details: [
      "Q6 prototype",
      "Precursor to production Quantum series"
    ],
    status: "In Phil's collection",
    imageCredit: "Robbi Cohn / Tim Mosenfelder",
  },
  {
    id: "ken-smith-2-3",
    name: "Ken Smith BT-6 #2 & #3",
    period: "Sep 1990 – Sep 1991",
    years: "~1 year",
    description: "Two more Ken Smith basses. #3 had MIDI pickup and EMG replacements.",
    details: [
      "#2: Quilted maple top, gold hardware (serial #88790)",
      "#2: Original pickups replaced with EMGs",
      "#2: Neck damaged in fretboard replacement attempt",
      "#3: Regular maple top, black hardware",
      "#3: MIDI pickup fitted (triggers for middle 4 strings)",
      "#3: Fretboard successfully replaced (possibly Modulus)",
      "Both had original Smith pickups replaced with EMGs"
    ],
    status: "#2 in private collection, #3 in Phil's collection",
    imageCredit: "Robbi Cohn / Tim Mosenfelder",
    notableShows: ["Barney the Dinosaur incident (4/1/93 - #3)"],
  },
  {
    id: "modulus-7",
    name: "Modulus #7",
    period: "Sep 1991 – Dec 1993, May–Jul 1995",
    years: "~3 years total",
    description: "Phil's workhorse through the early 90s and the final Grateful Dead shows.",
    details: [
      "Returned to for final GD tour in 1995",
      "Used at Jerry Garcia's final shows"
    ],
    status: "In Phil's collection",
    imageCredit: "Tim Mosenfelder",
    notableShows: ["Final Grateful Dead shows (Jul 1995)"],
  },
  {
    id: "modulus-8",
    name: "Modulus #8",
    period: "Feb 1994 – Apr 1995",
    years: "~1 year",
    description: "Featured MIDI pickup. Phil's main bass during 1994.",
    details: [
      "MIDI pickup between bridge and bridge pickup",
      "Phil's primary bass for 1994"
    ],
    status: "In Phil's collection",
    imageCredit: "Tim Mosenfelder",
  },
  {
    id: "dave-maize-acoustic",
    name: "Dave Maize 5-String Acoustic",
    period: "Sep 24, 1994 (one show)",
    years: "One performance",
    description: "Used for acoustic benefit performance at Berkeley Community Theatre.",
    details: [
      "5-string acoustic bass",
      "Built by Dave Maize",
      "Benefit for Berkeley Public Education Foundation",
      "Performed with Jerry, Bob, and Vince"
    ],
    status: "In Phil's collection",
    imageCredit: "Jay Blakesberg",
    notableShows: ["Berkeley Community Theatre benefit (9/24/94)"],
  },
];

function PhilLeshBasses() {
  const [selectedBass, setSelectedBass] = useState<Bass | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredBasses = filter === "all" 
    ? basses 
    : basses.filter(b => {
        if (filter === "alembic") return b.name.toLowerCase().includes("alembic") || b.name.includes("Big Brown") || b.name.includes("Mission Control");
        if (filter === "modulus") return b.name.toLowerCase().includes("modulus");
        if (filter === "fender") return b.name.toLowerCase().includes("fender");
        if (filter === "gibson") return b.name.toLowerCase().includes("gibson");
        if (filter === "other") return !["alembic", "modulus", "fender", "gibson"].some(m => 
          b.name.toLowerCase().includes(m) || b.name.includes("Big Brown") || b.name.includes("Mission Control")
        );
        return true;
      });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900 text-white">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-900/20 opacity-30"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
          <a href="/" className="absolute top-4 left-4 text-purple-400 hover:text-purple-300 text-sm">← Hub</a>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Phil Lesh
          </h1>
          <h2 className="text-2xl md:text-3xl text-purple-300 mb-2">Bass Guitar History</h2>
          <p className="text-gray-400 text-lg">1965 – 1995 • Grateful Dead</p>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            "One of the most forward thinking bassists to come out of the sixties rock era"
          </p>
        </div>
      </header>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-300 leading-relaxed">
          Phil Lesh never played bass before joining the Warlocks in 1965. Trained in classical music and jazz trumpet, 
          he approached the instrument as a "lead bass" — a melodic, contrapuntal voice rather than a rhythm section anchor. 
          His custom instruments, especially the legendary Alembic basses, helped pioneer the boutique bass market.
        </p>
      </section>

      {/* Filter */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { value: "all", label: "All Basses" },
            { value: "alembic", label: "Alembic" },
            { value: "modulus", label: "Modulus" },
            { value: "gibson", label: "Gibson" },
            { value: "fender", label: "Fender" },
            { value: "other", label: "Other" },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                filter === f.value
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-4">{filteredBasses.length} instruments</p>
      </div>

      {/* Timeline */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-pink-600 to-red-600"></div>

          {filteredBasses.map((bass, index) => (
            <div
              key={bass.id}
              className={`relative mb-12 ${index % 2 === 0 ? "md:pr-1/2" : "md:pl-1/2 md:ml-auto"}`}
            >
              {/* Timeline dot */}
              <div className={`absolute left-4 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-purple-500 border-4 border-gray-900 z-10`}></div>

              {/* Card */}
              <div 
                className={`ml-12 md:ml-0 ${index % 2 === 0 ? "md:mr-8" : "md:ml-8"} bg-gray-800/80 backdrop-blur rounded-xl p-6 cursor-pointer hover:bg-gray-800 transition-all hover:scale-[1.02] border border-gray-700 hover:border-purple-500`}
                onClick={() => setSelectedBass(selectedBass?.id === bass.id ? null : bass)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-purple-400 text-sm font-mono">{bass.period}</span>
                  <span className="text-gray-500 text-xs">{bass.years}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{bass.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{bass.description}</p>

                {/* Expanded details */}
                {selectedBass?.id === bass.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700 animate-in fade-in duration-200">
                    {bass.imageUrl && (
                      <div className="mb-4">
                        <img 
                          src={bass.imageUrl} 
                          alt={bass.name}
                          className="rounded-lg max-h-64 mx-auto"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        {bass.imageCredit && (
                          <p className="text-center text-gray-500 text-xs mt-1">Photo: {bass.imageCredit}</p>
                        )}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-purple-400 text-sm font-semibold mb-2">Specifications</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          {bass.details.map((detail, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-purple-500 mr-2">•</span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {bass.albums && bass.albums.length > 0 && (
                        <div>
                          <h4 className="text-pink-400 text-sm font-semibold mb-2">Albums</h4>
                          <div className="flex flex-wrap gap-2">
                            {bass.albums.map((album, i) => (
                              <span key={i} className="bg-pink-900/30 text-pink-300 px-2 py-1 rounded text-xs">
                                {album}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {bass.notableShows && bass.notableShows.length > 0 && (
                        <div>
                          <h4 className="text-red-400 text-sm font-semibold mb-2">Notable Shows</h4>
                          <div className="flex flex-wrap gap-2">
                            {bass.notableShows.map((show, i) => (
                              <span key={i} className="bg-red-900/30 text-red-300 px-2 py-1 rounded text-xs">
                                {show}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          bass.status.includes("Phil's collection") 
                            ? "bg-green-900/30 text-green-300" 
                            : bass.status.includes("private collection")
                            ? "bg-yellow-900/30 text-yellow-300"
                            : "bg-gray-700 text-gray-400"
                        }`}>
                          {bass.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-500 text-xs">Click to {selectedBass?.id === bass.id ? "collapse" : "expand"}</span>
                  <span className={`transform transition-transform ${selectedBass?.id === bass.id ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p className="mb-2">Research sources: gdsets.com, ricksuchow.com, Guitar World, Equipboard</p>
        <p>Phil Lesh (1940-2024) • Forever grateful ⚡💀🌹</p>
      </footer>
    </div>
  );
}
