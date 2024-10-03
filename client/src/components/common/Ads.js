import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';

const HomePageUpperCenterAds_Id = "2723081935";
const UpperLeftCentre_Id = "6798058313";
// const LowerLeft_Id = "9544167464";

const AdComponent = ({ adSlot }) => {
  useEffect(() => {

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
    catch (e) {
    }

  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-7107245842042491"
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export const TopAdsDesktop = () => (
  !isMobile ? (
    <div style={{ height: '200px', backgroundColor: 'yellow' }}>
      {/* <AdComponent adSlot={HomePageUpperCenterAds_Id} /> */}
      desktop ads
    </div>
  ) : null
);
export const BodyAdsMobile = () => (
  isMobile ? (
    <div style={{ height: '280px', backgroundColor: 'yellow' }}>
      {/* <AdComponent adSlot={HomePageUpperCenterAds_Id} /> */}
      mobile body ads
    </div>
  ) : null
);


export const GeneralCountryListAdsDesktop = () => (
  !isMobile ? (
    <div style={{ height: '250px', backgroundColor: 'yellow' }}>
      {/* <AdComponent adSlot={HomePageUpperCenterAds_Id} /> */}
      general list body desktop ads
    </div>
  ) : null
);

export const GeneralCountryListAdsMobile = () => (
  isMobile ? (
    <div style={{ height: '280px', backgroundColor: 'yellow' }}>
      {/* <AdComponent adSlot={HomePageUpperCenterAds_Id} /> */}
      general list body mobile ads
    </div>
  ) : null
);


export const BodyAdsDesktop = () => (
  !isMobile ? (
    <div style={{ height: '292px', backgroundColor: 'yellow' }}>
      {/* <AdComponent adSlot={HomePageUpperCenterAds_Id} /> */}
      body desktop ads
    </div>
  ) : null
);

export const FirstAds = () => (
  !isMobile ? (
    <div style={{ height: '280px', backgroundColor: 'white' }}>
      <AdComponent adSlot={HomePageUpperCenterAds_Id} />
    </div>
  ) : null
);

export const SecondAds = () => (
  <div style={{ height: '280px', backgroundColor: 'white' }}>
    <AdComponent adSlot={UpperLeftCentre_Id} />
  </div>
);
