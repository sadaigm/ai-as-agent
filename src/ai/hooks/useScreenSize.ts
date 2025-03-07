import { useState, useEffect } from 'react';

type ScreenSize = 'mobile' | 'tablet' | 'laptop' | 'desktop';

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop');
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 576) {
        setScreenSize('mobile');
        setLayout('vertical');
      } else if (width >= 576 && width < 768) {
        setScreenSize('tablet');
        setLayout('vertical');
      } else if (width >= 768 && width < 1024) {
        setScreenSize('laptop');
        setLayout('horizontal');
      } else {
        setScreenSize('desktop');
        setLayout('horizontal');
      }
    };

    // Set layout on initial render
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { screenSize, layout };
};

export default useScreenSize;