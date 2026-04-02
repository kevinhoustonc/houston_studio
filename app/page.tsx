"use client";

import { useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import Servicios from "@/components/sections/Servicios";
import Portafolio from "@/components/sections/Portafolio";
import SobreMi from "@/components/sections/SobreMi";
import Testimonios from "@/components/sections/Testimonios";
import Contacto from "@/components/sections/Contacto";
import Footer from "@/components/ui/Footer";

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <Navbar />
      <Hero />
      <div className="fade-in"><Servicios /></div>
      <div className="fade-in"><Portafolio /></div>
      <div className="fade-in"><SobreMi /></div>
      <div className="fade-in"><Testimonios /></div>
      <div className="fade-in"><Contacto /></div>
      <Footer />
    </main>
  );
}
