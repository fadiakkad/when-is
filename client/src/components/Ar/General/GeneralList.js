/* eslint-disable no-loop-func */
import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { read, utils } from "xlsx";
import { importAllImages } from "../../../helpers/importImages.js";
import landingPageSheet from "../../../Excel/Data/General.xlsx";
import { countries } from "../countries/CountriesNamesCodes.js";
import {
  GeneralCountryListAdsDesktop,
  GeneralCountryListAdsMobile,
} from "../../common/Ads.js";
import { SearchBar } from "../../common/SearchBar.js";
import { blogTextStyle,websiteURL,generalURL } from "../../common/constants.js";
import SharedHelmet from "../../common/Helmet.js";
import LazyLoadFlag from "../../../helpers/LazyLoadFlag.js";
import logoImage from "../../../images/logo.jpg";
let allCountriesData = "";

function General() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cardData, setCardData] = useState([]);
  const [countryFlags, setCountryFlags] = useState([]);
  const images = importAllImages(
    require.context("../../../images", false, /\.(png|jpe?g|webp)$/)
  );

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await fetch(landingPageSheet);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = read(arrayBuffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(sheet);
        const parsedData = jsonData.map((row, index) => ({
          cardNumber: index + 1,
          cardTitle: row.Title,
          cardImg: images[row.ImageURL],
          url: row.URL,
          titleInternal: row.TitleInternal,
        }));

        setCardData(parsedData);
      } catch (error) {
        console.error("Error loading card data:", error);
      }
    };

    fetchCardData();
  }, []);

  useEffect(() => {
    const fetchCountryFlags = async () => {
      allCountriesData = [];

      for (const country of countries) {
        try {
          const response = await fetch(country.data);
          const arrayBuffer = await response.arrayBuffer();
          const workbook = read(arrayBuffer, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = utils.sheet_to_json(sheet);

          jsonData.forEach((row) => {
            const parsedCountryData = {
              name: country.name,
              countryCode: country.countryCode,
              url: country.countryCode,
            };

            const existingCountry = allCountriesData.find(
              (data) => data.countryCode === parsedCountryData.countryCode
            );

            if (!existingCountry) {
              allCountriesData.push(parsedCountryData);
            }
          });
        } catch (error) {
          console.error(`Error loading data for ${country.name}:`, error);
        }
      }
      setCountryFlags(allCountriesData);
    };

    fetchCountryFlags();
  }, []);

  const combinedData = [...cardData, ...allCountriesData];

  const TITLE = "مواعيد - أحداث ومناسبات العالم العربي"
  const DESCRIPTION = "تعرف على اهم مواعيد الاحداث العامة في الوطن العربي, مثل كم باقي على رمضان, العيد, الحج, العام الهجري, العام الميلادي, واحداث اخرى"
  const KEYWORDS = "موعد, مواعيد, أحداث, مناسبات, تكنولوجيا, صحة, علوم"
  const OG_URL = `${websiteURL}/${generalURL}/`

  const imagesToPreload = cardData.slice(0, 2).map(card => card.cardImg);


  const eventsStructuredData = cardData.map(card => ({
    "@type": "Event",
    "name": card.Title,
    "startDate": card.eventDate, 
   
    "image": `${websiteURL}${card.cardImg}`,
    "url": `${websiteURL}/${card.url}/`,
    "description": `اكتشف ${card.cardTitle} في  بالإضافة إلى العد التنازلي.`
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": eventsStructuredData,
  };

  return (
    <>
      <SharedHelmet
        TITLE={TITLE}
        DESCRIPTION={DESCRIPTION}
        KEYWORDS={KEYWORDS}
        OG_URL={OG_URL}
        IMAGE={logoImage}
        IMAGES_PRELOAD={imagesToPreload} 
        structuredData={structuredData}
      />
          <h1
  style={{
    backgroundColor: '#65bee7',
    color: '#ffffff',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',  // Reduced base font size
    fontWeight: 'bold',
    textAlign: 'center',
    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)',
    padding: '0 10px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    backgroundImage: 'linear-gradient(to right, #65bee7, #4ca3d3)',
    width: '100%',
    maxWidth: '800px',  // Limits width on larger screens
    margin: '0 auto',
    
  }}
  className="text-white"
>
  أهم الأحداث والمناسبات والأعياد والفعاليات في العالم العربي
</h1>
      {/* Search bar */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        data={combinedData}
      />

      <br />

      <Row dir="rtl">
        <Col xs={12} lg={9}>
          <Row>
            {cardData.map((card, index) => (
              <React.Fragment key={index}>
                <Col xs={12} md={4} lg={4} className="mb-4">
                  <Card
                    style={{
                      borderRadius: "10px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      borderColor: "#18678d",
                    }}
                  >
                    <a
                      href={`/${card.url}/`}
                      style={{ textDecoration: "none", ...blogTextStyle }}
                    >
                      <Card.Img
                        variant="top"
                        src={card.cardImg}
                        alt={`صورة ل ${card.cardTitle}`}
                        loading={index < 2 ? "eager" : "lazy"} 
                        width="100%"
                        height="200px" 
                        style={{
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                          objectFit: "cover",
                          height: "200px",
                          width: "100%",
                        }}
                      />
                      <Card.Body>
                        <Card.Title
                          style={{ textAlign: "center", color: "#18678d", height: '30px' }}
                        >
                          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                            {card.cardTitle}
                          </h2>
                        </Card.Title>
                      </Card.Body>
                    </a>
                  </Card>
                </Col>

                {/* Add AdsComponent after every 3rd card */}
                {(index + 1) % 3 === 0 && (
                  <Col xs={12} className="mb-4">
                    <GeneralCountryListAdsMobile />
                  </Col>
                )}
              </React.Fragment>
            ))}
          </Row>
        </Col>

        <Col xs={12} lg={3}>

          <GeneralCountryListAdsDesktop />
          <hr />
          <div className="mt-3">
            <p
              style={{
                ...blogTextStyle,
                marginBottom: "20px",
                fontSize: "24px",
                fontWeight: "bold",
                color: "black",
              }}
            >
              أحداث مخصصة لكل دولة
            </p>
            <div style={containerStyle}>
              {countryFlags.map((country, index) => (
                <div key={index} style={countryStyle}>
                  <a href={`/countries/${country.url}/جميع_المناسبات/`} style={linkStyle}>
                  <LazyLoadFlag countryCode={country.countryCode.toUpperCase()} style={flagStyle} />
              
                    <p
                      style={{
                        ...blogTextStyle,
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "17px",
                      }}
                    >
                      {country.name}
                    </p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  justifyContent: "space-between",
};

const countryStyle = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  width: "45%",
  textAlign: "center",
};

const flagStyle = {
  width: "60px",
  height: "auto",
};

const linkStyle = {
  textDecoration: "none",
  color: "black",
  fontSize: "18px",
  fontWeight: "bold",
};

export default General;
