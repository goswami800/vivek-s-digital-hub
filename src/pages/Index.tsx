import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
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
import LoadingScreen from "@/components/LoadingScreen";
import BrandServicesSection from "@/components/BrandServicesSection";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const handleLoadingComplete = useCallback(() => setLoading(false), []);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>
      {!loading && (
        <>
          <ScrollProgress />
          <WelcomeModal />
          <Navbar />
          <HeroSection />
          <SectionWrapper><AboutSection /></SectionWrapper>
          <SectionWrapper><StatsSection /></SectionWrapper>
          <SectionWrapper><AchievementsSection /></SectionWrapper>
          <SectionWrapper><ServicesSection /></SectionWrapper>
          <SectionWrapper><BrandServicesSection /></SectionWrapper>
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
        </>
      )}
    </div>
  );
};

export default Index;
