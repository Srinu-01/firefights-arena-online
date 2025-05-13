
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, User, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-gaming-orange" : "text-white";
  };

  return (
    <nav className="relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-gaming-orange animate-glow" />
            <span className="text-2xl font-bold tracking-wider text-white">FREE FIRE ARENA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`${isActive('/')} hover:text-gaming-orange transition-colors font-gaming uppercase font-bold`}>
              Home
            </Link>
            <Link to="/tournaments" className={`${isActive('/tournaments')} hover:text-gaming-orange transition-colors font-gaming uppercase font-bold`}>
              Tournaments
            </Link>
            <Link to="/champions" className={`${isActive('/champions')} hover:text-gaming-orange transition-colors font-gaming uppercase font-bold`}>
              Champions
            </Link>
            <Link to="/register" className={`${isActive('/register')} hover:text-gaming-orange transition-colors font-gaming uppercase font-bold`}>
              Register
            </Link>
            <Link to="/login">
              <Button className="gaming-button">
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gaming-orange focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden gaming-gradient animate-fade-in absolute w-full px-4 py-2 shadow-lg">
          <div className="flex flex-col space-y-3 py-3">
            <Link to="/" className={`${isActive('/')} hover:text-gaming-orange transition-colors font-gaming uppercase font-bold flex items-center space-x-2`} onClick={() => setIsOpen(false)}>
              <Trophy size={20} /> <span>Home</span>
            </Link>
            <Link to="/tournaments" className={`${isActive('/tournaments')} hover:text-gaming-orange transition-colors font-gaming uppercase font-bold flex items-center space-x-2`} onClick={() => setIsOpen(false)}>
              <Calendar size={20} /> <span>Tournaments</span>
            </Link>
            <Link to="/champions" className={`${isActive('/champions')} hover:text-gaming-orange transition-colors font-gaming uppercase font-bold flex items-center space-x-2`} onClick={() => setIsOpen(false)}>
              <Trophy size={20} /> <span>Champions</span>
            </Link>
            <Link to="/register" className={`${isActive('/register')} hover:text-gaming-orange transition-colors font-gaming uppercase font-bold flex items-center space-x-2`} onClick={() => setIsOpen(false)}>
              <User size={20} /> <span>Register</span>
            </Link>
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button className="gaming-button flex items-center justify-center space-x-2">
                <DollarSign size={18} /> <span>Login</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
