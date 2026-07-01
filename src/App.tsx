import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import CustomCursor from "./components/layout/CustomCursor";
import Hero from "./components/sections/Hero";
import Works from "./components/sections/Works";
import Services from "./components/sections/Services";
import About from "./components/sections/About";
import Contact from "./components/sections/Contact";

export default function App() {
  return (
    <div className="relative min-h-screen">
      <div className="grain-overlay" />
      <CustomCursor />
      <Navigation />
      <main>
        <Hero />
        <Works />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
