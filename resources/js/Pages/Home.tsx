import type { Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";
import type { ApiService, ApiProject, ApiBlogPost } from "@/lib/types";
import AppLayout from "@/Layouts/AppLayout";
import SeoMeta from "@/components/seo/SeoMeta";
import Hero from "@/components/home/Hero";
import AboutBlock from "@/components/home/AboutBlock";
import FlagshipBlock from "@/components/home/FlagshipBlock";
import ServicesBlock from "@/components/home/ServicesBlock";
import WorkBlock from "@/components/home/WorkBlock";
import ProcessTrack from "@/components/home/ProcessTrack";
import WhyBlock from "@/components/home/WhyBlock";
import JournalBlock from "@/components/home/JournalBlock";
import TrustBand from "@/components/home/TrustBand";
import ClosingCta from "@/components/home/ClosingCta";

interface HomeProps {
  locale: Locale;
  services: ApiService[];
  projects: ApiProject[];
  posts: ApiBlogPost[];
}

export default function Home({ locale, services, projects, posts }: HomeProps) {
  const dict = getDictionary(locale);
  const flagship = services.find((service) => service.is_featured);

  return (
    <>
      <SeoMeta
        title={dict.hero.title}
        description={dict.hero.description}
        locale={locale}
      />
      <AppLayout locale={locale} dict={dict} services={services}>
        <Hero locale={locale} dict={dict} services={services} />
        <AboutBlock locale={locale} dict={dict} />
        {flagship && (
          <FlagshipBlock locale={locale} dict={dict} service={flagship} />
        )}
        <ServicesBlock locale={locale} dict={dict} services={services} />
        <WorkBlock locale={locale} dict={dict} projects={projects} />
        <ProcessTrack locale={locale} dict={dict} />
        <WhyBlock dict={dict} />
        <JournalBlock locale={locale} dict={dict} posts={posts} />
        <TrustBand dict={dict} />
        <ClosingCta locale={locale} dict={dict} />
      </AppLayout>
    </>
  );
}
