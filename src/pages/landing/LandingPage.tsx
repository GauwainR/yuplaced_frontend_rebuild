import { BackgroundCanvas } from '../../shared/ui/BackgroundCanvas';
import { Nav } from '../../shared/ui/Nav';
import { LandingFooter } from '../../widgets/landing-footer';
import { LandingHero } from '../../widgets/landing-hero';
import '../../styles/landing.css';

export function LandingPage() {
  return (
    <>
      <BackgroundCanvas />
      <Nav />
      <LandingHero />
      <LandingFooter />
    </>
  );
}
