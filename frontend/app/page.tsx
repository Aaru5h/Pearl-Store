import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import FeaturedProducts from "./components/FeaturedProducts";
import Story from "./components/Story";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <FeaturedProducts />
        <Story />
      </main>
      <Footer />
    </>
  );
}
