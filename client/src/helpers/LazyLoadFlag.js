import React, { useEffect, useState, useRef } from 'react';
import ReactCountryFlag from 'react-country-flag';

const LazyLoadFlag = ({ countryCode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const flagRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = flagRef.current; 

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef); 
      }
    };
  }, []); 

  return (
    <div ref={flagRef} style={{ width: '48px', height: '48px' }}>
      {isVisible && (
        <ReactCountryFlag
          countryCode={countryCode}
          svg
          style={{ width: '48px', height: '48px' }}
          alt={`${countryCode} flag`}
        />
      )}
    </div>
  );
};

export default LazyLoadFlag;
