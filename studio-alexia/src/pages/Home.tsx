import { Hero } from '../shared/ui/Hero';
import Services from '../components/Services/Services';
import { Schedule } from '../shared/ui/Schedule';
import { Contact } from '../shared/ui/Contact';
import { Location } from '../shared/ui/Location';

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
