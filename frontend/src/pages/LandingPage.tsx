import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { TrustSection } from '@/components/landing/TrustSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { AIFeaturesSection } from '@/components/landing/AIFeaturesSection';
import { StakeholderSection } from '@/components/landing/StakeholderSection';
import { ProductPreviewSection } from '@/components/landing/ProductPreviewSection';
import { WorkflowSection } from '@/components/landing/WorkflowSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-indigo-500/30">
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <ProblemSection />
        <HowItWorksSection />
        <AIFeaturesSection />
        <StakeholderSection />
        <ProductPreviewSection />
        <WorkflowSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
