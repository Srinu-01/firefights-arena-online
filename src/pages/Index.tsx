
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import UpcomingTournaments from '@/components/UpcomingTournaments';

const Index = () => {
  return (
    <Layout>
      <Helmet>
        <title>Free Fire Arena - Mobile Esports Tournaments</title>
        <meta name="description" content="Join professional Free Fire tournaments, compete with the best players, and win cash prizes." />
      </Helmet>
      
      <HeroSection />
      <UpcomingTournaments />
      
      {/* Features Section */}
      <div className="py-16 px-4 md:px-8 bg-gaming-darker/70">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-2">HOW IT WORKS</h2>
          <div className="w-20 h-1 bg-gaming-orange mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="gaming-card p-6 text-center">
              <div className="w-16 h-16 bg-gaming-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gaming-orange">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Register Your Squad</h3>
              <p className="text-gray-400">
                Create an account, form your squad with 4 players, and register for upcoming tournaments.
              </p>
            </div>
            
            <div className="gaming-card p-6 text-center">
              <div className="w-16 h-16 bg-gaming-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gaming-orange">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pay Entry Fee</h3>
              <p className="text-gray-400">
                Secure your slot by paying the tournament entry fee. Room details will be revealed after payment.
              </p>
            </div>
            
            <div className="gaming-card p-6 text-center">
              <div className="w-16 h-16 bg-gaming-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gaming-orange">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Compete & Win</h3>
              <p className="text-gray-400">
                Join the custom room, fight for victory, and win cash prizes based on your ranking and kills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
