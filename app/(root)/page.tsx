import { handleUserOnboarding } from "@/modules/auth/actions";
import { HeroSection } from "@/modules/home/components/hero-section";
import { FeaturesSection } from "@/modules/home/components/features-section";
import { CategoriesSection } from "@/modules/home/components/categories-section";
import { CtaSection } from "@/modules/home/components/cta-section";

export default async function Home() {
  await handleUserOnboarding();

  return (
    <div className="min-h-screen transition-colors mt-24">
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <CtaSection />
    </div>
  );
}
