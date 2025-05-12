
import { ReactNode } from 'react';
import NavigationBar from './NavigationBar';
import Slideshow from './Slideshow';
import FooterSection from './FooterSection';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Slideshow />
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main className="flex-grow">
          {children}
        </main>
        <FooterSection />
      </div>
    </>
  );
};

export default Layout;
