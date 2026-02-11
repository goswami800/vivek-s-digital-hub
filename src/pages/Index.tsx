import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
import DietPlansSection from "@/components/DietPlansSection";
import TransformationsSection from "@/components/TransformationsSection";
import GallerySection from "@/components/GallerySection";
import CalculatorSection from "@/components/CalculatorSection";
import BlogSection from "@/components/BlogSection";
import BookingSection from "@/components/BookingSection";
import FAQSection from "@/components/FAQSection";
import InstagramSection from "@/components/InstagramSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import WelcomeModal from "@/components/WelcomeModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import AchievementsSection from "@/components/AchievementsSection";
import VideosSection from "@/components/VideosSection";
import SectionWrapper from "@/components/SectionWrapper";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <WelcomeModal />
      <Navbar />
      <HeroSection />
      <SectionWrapper><AboutSection /></SectionWrapper>
      <SectionWrapper><StatsSection /></SectionWrapper>
      <SectionWrapper><AchievementsSection /></SectionWrapper>
      <SectionWrapper><ServicesSection /></SectionWrapper>
      <SectionWrapper><VideosSection /></SectionWrapper>
      <SectionWrapper><DietPlansSection /></SectionWrapper>
      <SectionWrapper><TransformationsSection /></SectionWrapper>
      <SectionWrapper><GallerySection /></SectionWrapper>
      <SectionWrapper><CalculatorSection /></SectionWrapper>
      <SectionWrapper><BlogSection /></SectionWrapper>
      <SectionWrapper><BookingSection /></SectionWrapper>
      <SectionWrapper><FAQSection /></SectionWrapper>
      <SectionWrapper><InstagramSection /></SectionWrapper>
      <SectionWrapper><TestimonialsSection /></SectionWrapper>
      <SectionWrapper><ContactSection /></SectionWrapper>
      <WhatsAppButton />
    </div>
  );
};

export default Index;
