
import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';

const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Close sidebar when navigating on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Website', path: '/', icon: <Home size={20} /> },
    { name: 'Tournaments', path: '/admin/tournaments', icon: <Calendar size={20} /> },
    { name: 'Champions', path: '/admin/champions', icon: <Trophy size={20} /> },
    { name: 'Teams', path: '/admin/teams', icon: <Users size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gaming-dark text-white">
      <Helmet>
        <title>Admin Dashboard | Free Fire Arena</title>
      </Helmet>

      {/* Mobile Header */}
      <header className="md:hidden bg-gaming-darker py-4 px-6 flex justify-between items-center border-b border-gaming-orange/20 sticky top-0 z-50">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 rounded-md hover:bg-gaming-orange/20"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div className="flex h-[calc(100vh-64px)] md:h-screen">
        {/* Sidebar */}
        <aside className={`
          fixed md:static top-0 left-0 z-40 h-full w-64 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          bg-gaming-darker md:block border-r border-gaming-orange/20
          md:h-screen overflow-y-auto
        `}>
          <div className="flex flex-col h-full p-4">
            <div className="md:flex items-center gap-2 py-6 px-4 hidden">
              <span className="text-2xl font-bold text-gaming-orange">FF Arena</span>
            </div>
            
            <div className="mt-6 space-y-1 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 py-3 px-4 rounded-md transition-colors
                    ${isActive(item.path) 
                      ? 'bg-gaming-orange text-white' 
                      : 'text-gray-300 hover:bg-gaming-orange/20'
                    }
                  `}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
            
            <div className="border-t border-gaming-orange/20 pt-4 mt-auto">
              <Button 
                variant="outline" 
                className="w-full border-gaming-orange/30 hover:bg-gaming-orange/20 flex gap-2"
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto h-full w-full">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
