import Hero from '../shared/ui/Hero/Hero';
import Services from '../components/Services/Services';
import Schedule from '../shared/ui/Schedule/Schedule';
import Contact from '../shared/ui/Contact/Contact';
import Location from '../shared/ui/Location/Location';

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <Schedule />
      <Contact />
      <Location />
    </>
  );
};

export default Home;
