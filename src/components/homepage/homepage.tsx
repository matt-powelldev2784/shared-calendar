import { Link, useNavigate } from '@tanstack/react-router';
import SharcLogo from '@/assets/logo/sharc_logo_blue.svg';
import SharcScreenShot from '@/assets/images/sharc_screenshot_sm4.webp';
import { Button } from '../ui/button';
import { Calendar, RefreshCcw, Users } from 'lucide-react';

const Homepage = () => {
  return (
    <main className="flex w-screen flex-col items-center justify-center">
      <NavigationBar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
};

export default Homepage;

const NavigationBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="relative flex h-16 w-full items-center justify-between px-4 md:h-20 md:px-16">
      <Link to="/">
        <img src={SharcLogo} alt="Sharc Calendar Logo" className="h-8" />
      </Link>

      <Button onClick={() => navigate({ to: '/login' })} className="w-32">
        Login
      </Button>
    </nav>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <article className="relative w-full">
      <div className="from-primary/10 via-primary/10 relative flex flex-col items-center justify-start rounded-none bg-gradient-to-b to-transparent sm:mx-4 sm:rounded-xl md:mx-8">
        <p className="text-secondary mt-6 px-4 text-center text-3xl font-bold md:text-6xl md:leading-20">
          Collaborative calendar
        </p>
        <p className="text-secondary px-4 text-center text-3xl font-bold sm:text-3xl md:text-6xl">
          management for <span className="text-primary">teams</span>
        </p>

        <p className="text-secondary mt-4 mb-4 w-full -translate-y-1.5 px-4 text-center leading-6 sm:-translate-y-1 sm:px-12 sm:leading-7 md:mt-6 md:mb-8 md:px-16 md:text-base lg:w-[720px] lg:px-0">
          Transform how your team coordinates schedules with our intuitive shared calendar platform. Say goodbye to
          scheduling conflicts and keep everyone synchronized. Share events in real-time, manage team meetings
          effortlessly, and ensure nothing falls through the cracks.
        </p>

        <div className="mb-6 flex w-full flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:gap-4">
          <Button onClick={() => navigate({ to: '/login' })} size="lg" className="w-full sm:w-auto">
            Get Started
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: '/login' })} size="lg" className="w-full sm:w-auto">
            Demo Application
          </Button>
        </div>

        <img src={SharcScreenShot} alt="Sharc screenshot" className="mt-4 w-full rounded-xl px-2 sm:w-7/8" />
      </div>
    </article>
  );
};

const featuresData = [
  {
    id: 1,
    icon: RefreshCcw,
    title: 'Real-time Sync',
    description: 'Changes appear instantly across all devices. No more outdated schedules or missed updates.',
  },
  {
    id: 2,
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share calendars with team members and coordinate schedules effortlessly across departments.',
  },
  {
    id: 3,
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Avoid conflicts with intelligent scheduling that finds the perfect time slots for everyone.',
  },
];

const Features = () => {
  return (
    <>
      <section className="mt-4 mb-4 w-full px-4 text-center md:px-12 lg:px-24">
        <h2 className="text-secondary text-3xl font-bold md:text-4xl lg:text-6xl">Why Choose Our Platform?</h2>
        <p className="mx-auto max-w-[400px] px-2 text-gray-600 md:max-w-[500px] lg:max-w-[800px] lg:text-lg">
          Discover the powerful features that make calendar management effortless for teams of all sizes.
        </p>
      </section>

      <div className="mb-20 grid w-full grid-cols-1 gap-6 px-4 md:px-12 lg:grid-cols-3 lg:px-24">
        {featuresData.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div key={feature.id} className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <IconComponent className="text-primary" />
              </div>
              <h3 className="text-secondary mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

const Footer = () => {
  return (
    <footer className="flex w-full flex-col items-center justify-between border-t border-gray-200 bg-gray-50 px-8 py-8 text-center sm:px-16 md:flex-row">
      <div></div>

      <div className="text-secondary flex flex-col items-center justify-end md:items-end">
        <img src={SharcLogo} alt="Sharc Calendar Logo" className="mx-auto mb-4 h-6 md:mx-0 md:mb-2 md:h-7" />
        <p>123 Calendar Street</p>
        <p>London</p>
        <p>SW1 1AA</p>
        <a href="mailto:contact@sharc.com" className="hover:text-primary underline">
          contact@sharc.com
        </a>
      </div>
    </footer>
  );
};
