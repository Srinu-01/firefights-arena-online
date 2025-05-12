
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, Trophy } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center z-10">
      <div className="text-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <Trophy className="h-16 w-16 mx-auto text-gaming-orange animate-glow" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4"
        >
          FREE FIRE <span className="text-gaming-orange">ARENA</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Compete in daily tournaments, showcase your skills, and win big prizes
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <Link to="/tournaments">
            <Button className="gaming-button text-lg px-8 py-6">
              View Tournaments
            </Button>
          </Link>
          <Link to="/register">
            <Button className="gaming-button-secondary text-lg px-8 py-6">
              Register Squad
            </Button>
          </Link>
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 w-full flex justify-center">
        <ChevronDown className="h-8 w-8 text-gaming-orange animate-bounce" />
      </div>
    </div>
  );
};

export default HeroSection;
