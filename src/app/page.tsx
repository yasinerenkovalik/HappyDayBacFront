// components
import { 
  Navbar, 
  Footer, 
  Hero, 
  ErrorBoundary,
  Categories,
  Stats,
  Testimonials,
  CTA,
  FAQ,
  WhyUs,
  SearchEngine
} from "@/components";

export default function Campaign() {
  return (
    <ErrorBoundary>
      <Navbar />
      <Hero />
      <SearchEngine />
      <WhyUs />
     {/*   <Categories /> */}
   {/*    <Stats />*/}
    {/*  <Testimonials /> */}
      <CTA />
      <FAQ />
      <Footer />
    </ErrorBoundary>
  );
}