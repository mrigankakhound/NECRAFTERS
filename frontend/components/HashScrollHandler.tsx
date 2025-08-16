"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const HashScrollHandler = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash;
    
    if (hash) {
      const sectionId = hash.substring(1); // Remove the # symbol
      console.log('HashScrollHandler: Found hash, scrolling to section:', sectionId);
      
      // Wait for the page to fully load
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          console.log('HashScrollHandler: Element found, scrolling...');
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.log('HashScrollHandler: Element not found, trying alternative selectors...');
          // Try alternative selectors
          const alternativeElement = document.querySelector(`[data-section="${sectionId}"]`) || 
                                  document.querySelector(`[id*="${sectionId}"]`);
          if (alternativeElement) {
            console.log('HashScrollHandler: Alternative element found, scrolling...');
            alternativeElement.scrollIntoView({ behavior: 'smooth' });
          } else {
            console.log('HashScrollHandler: No element found for section:', sectionId);
          }
        }
      }, 500); // Wait 500ms for content to load
    }
  }, [searchParams]);

  return null; // This component doesn't render anything
};

export default HashScrollHandler;
