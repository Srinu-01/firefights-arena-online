
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl md:text-8xl font-extrabold text-gaming-orange mb-8">404</h1>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">Page Not Found</h2>
        <p className="text-gray-400 max-w-lg mx-auto mb-10">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button className="gaming-button text-lg px-8 py-6">
            Return to Home
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
