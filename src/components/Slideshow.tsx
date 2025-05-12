
import { useEffect, useState } from 'react';

// Desktop and mobile slideshow images
const desktopSlides = [
  "https://wallpapercave.com/wp/wp9330270.jpg",
  "https://wallpapercave.com/wp/wp11213059.jpg",
  "https://wallpapercave.com/wp/wp7127745.jpg",
  "https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/202210/ce405ad07404fecfb3196b77822aec8b.jpg",
  "https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/202210/768671f1dc8d3c0a8f2448cf5ed6739c.jpg"
];

const mobileSlides = [
  "https://i.pinimg.com/736x/ce/74/0d/ce740dbc02415f5da8f738cc4f32d883.jpg",
  "https://i.pinimg.com/736x/fe/b1/bf/feb1bf000ddc2e4cc080322112d672be.jpg",
  "https://i.pinimg.com/736x/e6/68/d1/e668d1627eaad9963fa89dffe7cba971.jpg",
  "https://i.pinimg.com/1200x/9f/ba/50/9fba506166169e767c1143e68b7612b0.jpg",
  "https://i.pinimg.com/736x/ba/a0/bd/baa0bda6b7f22ad13d77d7e47087dec6.jpg"
];

const Slideshow = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Change slide every 5 seconds
  useEffect(() => {
    const slides = isMobile ? mobileSlides : desktopSlides;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isMobile]);

  // Get current slides based on device
  const slides = isMobile ? mobileSlides : desktopSlides;

  // Preload the next image
  useEffect(() => {
    const nextIndex = (activeIndex + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex];
  }, [activeIndex, slides]);

  return (
    <div className="slideshow-container">
      {slides.map((slide, index) => (
        <img
          key={slide}
          src={slide}
          alt={`Free Fire background ${index + 1}`}
          className={`slideshow-image ${index === activeIndex ? 'active' : ''}`}
          loading={index === 0 ? "eager" : "lazy"}
        />
      ))}
      <div className="overlay-gradient"></div>
    </div>
  );
};

export default Slideshow;
