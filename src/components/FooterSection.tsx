
import { Trophy, Mail, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const FooterSection = () => {
  return (
    <footer className="bg-gaming-darker py-12 px-4 border-t border-gaming-gray">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center mb-4">
              <Trophy className="h-8 w-8 text-gaming-orange mr-2" />
              <h3 className="text-xl font-bold text-white">FREE FIRE ARENA</h3>
            </div>
            <p className="text-gray-400 mb-6">
              The premier platform for Free Fire tournaments. Compete, dominate, and win big!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gaming-orange transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gaming-orange transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="mailto:info@freefirearena.com" className="text-gray-400 hover:text-gaming-orange transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/tournaments" className="text-gray-400 hover:text-gaming-orange transition-colors">
                  All Tournaments
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-gray-400 hover:text-gaming-orange transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-gaming-orange transition-colors">
                  Register Squad
                </Link>
              </li>
              <li>
                <Link to="/rules" className="text-gray-400 hover:text-gaming-orange transition-colors">
                  Tournament Rules
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
            <p className="text-gray-400 mb-2">
              Have questions about our tournaments?
            </p>
            <a href="mailto:support@freefirearena.com" className="text-gaming-orange hover:underline">
              support@freefirearena.com
            </a>
          </div>
        </div>
        
        <div className="border-t border-gaming-gray mt-10 pt-6 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Free Fire Arena. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Free Fire Arena is not endorsed by or affiliated with Garena Free Fire.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
