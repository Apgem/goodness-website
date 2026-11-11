import SceneMount from "@/components/three/SceneMount";
import Navbar from "@/sections/Navbar";
import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Stats from "@/sections/Stats";
import Services from "@/sections/Services";
import Portfolio from "@/sections/Portfolio";
import Process from "@/sections/Process";
import Testimonials from "@/sections/Testimonials";
import Qualifier from "@/sections/Qualifier";
import Faq from "@/sections/Faq";
import BrandOutro from "@/sections/BrandOutro";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";
import Marquee from "@/components/ui/Marquee";

// Deliberately a Server Component: `metadata`/`viewport` are Server-only, and
// the section copy needs to be in the SSR'd HTML so LCP is text, not canvas.
export default function Home() {
  return (
    <>
      <SceneMount />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Hero />
        {/* Keeps the personal name on the first screen now the logo is APGEM. */}
        <Marquee />
        <About />
        <Stats />
        <Services />
        <Portfolio />
        <Process />
        {/* Renders null until testimonials or an Upwork URL land in content.ts */}
        <Testimonials />
        <Qualifier />
        <Faq />
        <BrandOutro />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
