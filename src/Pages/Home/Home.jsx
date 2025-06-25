import './Home.css'
// import HeroSection from '../Components/HeroSection/HeroSection.jsx';
import HeroSection from '../../Components/HeroSection/HeroSection'
import NewArrivals from '../../Components/NewArrivals/NewArrivals'
import WeeklyDeals from '../../Components/WeeklyDeals/WeeklyDeals'
import SportsWearPromo from '../../Components/SportsWearPromo/SportsWearPromo'
import SpecialtySection from '../../Components/SpecialtySection/SpecialtySection'
import InfoSection from '../../Components/InfoSection/InfoSection'
import Testimonials from '../../Components/Testimonials/Testimonials'
import Newsletter from '../../Components/NewsletterSignup/Newsletter'


export default function Home() {
  return (
    <>
    <div className='margin-cust'>
    <div>
    <HeroSection/>
    </div>

    <div className='newArrivals mt-5 h-100'>
    <NewArrivals/>
    </div>

    <div>
      <WeeklyDeals/>  
    </div>
 
    <div>
      <SportsWearPromo/>
    </div>

    <div>
      <SpecialtySection/>
    </div>

    <div>
      <InfoSection/>
    </div>

    <div>
      <Testimonials/>
    </div>

    <div>
      <Newsletter />
    </div>
    </div>
    </>
  )
}
