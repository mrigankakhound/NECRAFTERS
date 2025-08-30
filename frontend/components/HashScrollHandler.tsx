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
      
      
      // Wait for the page to fully load
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          // Calculate offset for fixed navbar (navbar height + some padding)
          const navbarHeight = 140; // Approximate height of navbar including horizontal nav
          const elementTop = element.offsetTop;
          const offsetPosition = elementTop - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } else {
          
          // Try alternative selectors
          const alternativeElement = document.querySelector(`[data-section="${sectionId}"]`) || 
                                  document.querySelector(`[id*="${sectionId}"]`);
          if (alternativeElement && alternativeElement instanceof HTMLElement) {
            // Calculate offset for fixed navbar
            const navbarHeight = 140;
            const elementTop = alternativeElement.offsetTop;
            const offsetPosition = elementTop - navbarHeight;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          } else {

          }
        }
      }, 500); // Wait 500ms for content to load
    }
  }, [searchParams]);

  return null; // This component doesn't render anything
};

export default HashScrollHandler;
