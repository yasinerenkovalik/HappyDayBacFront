// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "./hero";
import TopBookCategories from "./top-book-categories";
import BackToSchoolBooks from "./back-to-school-books";
import CarouselFeatures from "./carousel-features";
import Stats from "./stats";
import Testimonials from "./testimonials";
import BlogSection from "./blog-section";
import GetYourBookFromUs from "./get-your-book-from-us";
import CtaSection from "./cta-section";
import Faq from "./faq";

export default function Campaign() {
  return (
    <>
      <Navbar />
      <Hero />
      <CarouselFeatures />
      <TopBookCategories />
      <BackToSchoolBooks />
      <Stats />
      <Testimonials />
      <BlogSection />
      <GetYourBookFromUs />
      <CtaSection />
      <Faq />
      <Footer />
    </>
  );
}
