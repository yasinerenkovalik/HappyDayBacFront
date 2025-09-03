// components
import { 
  Navbar, 
  Footer, 
  Hero, 
  ErrorBoundary,
  FeaturedOrganizations,
  Categories,
  Stats,
  Testimonials,
  CTA,
  FAQ
} from "@/components";

export default function Campaign() {
  return (
    <ErrorBoundary>
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedOrganizations />
      <Stats />
      <Testimonials />
      <CTA />
      <FAQ />
      <Footer />
    </ErrorBoundary>
  );
}
