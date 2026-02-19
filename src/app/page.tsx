import Hero from '@/components/Hero';
import Nav from '@/components/Nav';
import Overview from '@/components/Overview';
import Speakers from '@/components/Speakers';
import Tracks from '@/components/Tracks';
import Submissions from '@/components/Submissions';
import Timeline from '@/components/Timeline';
import Venue from '@/components/Venue';
import Registration from '@/components/Registration';
import Publications from '@/components/Publications';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  return (
    <>
      <Hero />
      <Nav />
      <div className="wave-divider" />
      <Overview />
      <Speakers />
      <Tracks />
      <Submissions />
      <Timeline />
      <Venue />
      <Registration />
      <Publications />
      <CTA />
      <Footer />
      <ScrollReveal />
    </>
  );
}
