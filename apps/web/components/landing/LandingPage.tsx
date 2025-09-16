import HeroSection from '@/components/landing/HeroSection';
import ClientsProjectsSection from '@/components/ClientsProjectsSection';
import ServicesSection from '@/components/services-section';
import ContentSection from '@/components/content-3';
import FAQsTwo from '@/components/faqs-2';
import FooterSection from '@/components/footer';
import PricingSection from '@/components/landing/PricingSection';

export default function LandingPage() {
  return (
    <>
      <HeroSection nextSectionRef={{}} />
      <ClientsProjectsSection />
      <ServicesSection />
      <ContentSection />
      <PricingSection />
      <FAQsTwo />
      <FooterSection />
    </>
  );
}
