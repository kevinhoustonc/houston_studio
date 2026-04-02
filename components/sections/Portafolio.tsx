"use client";

import AudioPlayer from "@/components/ui/AudioPlayer";

const demos = [
  {
    title: "Spot Radio - Campaña Verano",
    category: "Radio",
    duration: "0:30",
    src: "/demos/demo-radio.mp3",
  },
  {
    title: "Locución Corporativa - Presentación",
    category: "TV",
    duration: "0:45",
    src: "/demos/demo-tv.mp3",
  },
  {
    title: "IVR - Sistema Telefónico",
    category: "IVR",
    duration: "0:20",
    src: "/demos/demo-ivr.mp3",
  },
  {
    title: "Jingle - Marca Comercial",
    category: "Jingle",
    duration: "0:35",
    src: "/demos/demo-jingle.mp3",
  },
];

export default function Portafolio() {
  return (
    <section id="portafolio" className="py-24 px-4 bg-studio-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Escuchá nuestro trabajo</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
            Portafolio de Audio
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demos.map((demo) => (
            <AudioPlayer
              key={demo.title}
              src={demo.src}
              title={demo.title}
              category={demo.category}
              duration={demo.duration}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
