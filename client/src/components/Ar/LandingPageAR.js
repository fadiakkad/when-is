import React, { useState, useEffect, lazy, Suspense } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { isMobile } from "react-device-detect";
import { read, utils } from "xlsx";
import landingPageSheet from "../../Excel/Data/General.xlsx";
import { importAllImages } from "../../helpers/importImages.js";
import { countries } from "./countries/CountriesNamesCodes.js";
import { LoadingSpinner } from "../common/LoadingSpinner.js";
import { SearchBar } from "../common/SearchBar.js";
import { blogTextStyle, generalURL, limitedCardsLandingPage } from "../common/constants.js";
import HolidayMessage from "../common/HolidayMessage.js";
import SharedHelmet from "../common/Helmet.js";
import { websiteURL } from "../common/constants.js";
import logoImage from "../../images/logo.jpg";
const CountryFlagsSection = lazy(() =>
  import("../../helpers/CountryFlagsSection.js")
);
let allCountriesData = "";
function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cardData, setCardData] = useState([]);
  const [countryFlags, setCountryFlags] = useState([]);
  const images = importAllImages(
    require.context("../../images", false, /\.(png|jpe?g|webp)$/)
  );

  useEffect(() => {
    const fetchExcelData = async () => {
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
        }));
        setCardData(parsedData);
      } catch (error) {
        console.error("Error loading Excel file:", error);
      }
    };

    fetchExcelData();
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

  const filteredCards = cardData
    .filter((card) => card.cardTitle)
    .sort((a, b) => a.date - b.date);

  const limitedCards = filteredCards.slice(0, limitedCardsLandingPage);
  const hasResults = limitedCards.length > 0;

  const DESCRIPTION = "موقع 'مواعيد' يخبرك كم باقي على الأحداث في العالم العربي ولكل دولة عربية، مع عد تنازلي للعطل والأعياد القادمة. محتوى متجدد ومتنوع."
  const KEYWORDS = "موعد,مواعيد, أحداث, مناسبات, تكنولوجيا, صحة, علوم, عد تنازلي, العطل, الأعياد, مناسبات عربية"

  const imagesToPreload = limitedCards.slice(0, 2).map(card => card.cardImg);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${websiteURL}/`,
    "name": "مواعيد",
    "url": `${websiteURL}/`,
    "description": DESCRIPTION,
    "inLanguage": "ar",
    "image": logoImage,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${websiteURL}/`
    }
  };


  return (
    <div dir="rtl">
      <SharedHelmet
        TITLE="مواعيد"
        DESCRIPTION={DESCRIPTION}
        KEYWORDS={KEYWORDS}
        OG_URL={websiteURL}
        IMAGES_PRELOAD={imagesToPreload}
        structuredData={structuredData}
        IMAGE={logoImage}
      />
    <h1
  style={{
    backgroundColor: '#65bee7',
    color: '#ffffff',
    height: '90px',
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
    maxWidth: '850px',  // Limits width on larger screens
    margin: '0 auto',
   
  }}
  className="text-white"
>
  مواعيد : أكبر موقع لعرض الأحداث والمناسبات والفعاليات والأعياد في العالم العربي
</h1>


      {/* Search bar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <br />
      <div style={{ position: "relative" }}>
        <HolidayMessage />
      </div>

      <br />

      {/* Card grid */}
      {hasResults ? (
        <>
          <Row xs={1} sm={2} md={4} lg={4} className="g-4" dir="rtl">
            {limitedCards.length > 0 ? (
              limitedCards.map((card, index) => (
                <Col key={index} style={{ paddingBottom: "10px" }}>
                  <a
                    href={`/${card.url}/`}
                    style={{ textDecoration: "none", ...blogTextStyle }}
                  >
                    <Card
                      style={{
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        borderColor: "#18678d",
                      }}
                    >
                      {/* Card image */}
                      <Card.Img
                        variant="top"
                        src={card.cardImg}
                        alt={`صورة ل ${card.cardTitle}`} // Make this more descriptive as needed
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
                        {/* Card title */}
                        <Card.Title
                          style={{ textAlign: "center", color: "#18678d", height: '30px' }}
                        >
                          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                            {card.cardTitle}
                          </h2>
                        </Card.Title>
                      </Card.Body>
                    </Card>
                  </a>
                </Col>
              ))
            ) : (
              <p
                className="text-center"
                style={{
                  display: "flex",
                  textAlign: "center",
                  justifyContent: "center",
                  transform: isMobile ? "" : "translateX(150%)",
                  ...blogTextStyle,
                  color: "black",
                }}
              >
                لا توجد نتائج مطابقة
              </p>
            )}
          </Row>
          <br />
          {/* View more button */}
          <div className="text-center my-4">
            <a
              href={`/${generalURL}/`}
              className="button-hover"
              style={{
                display: "inline-block",
                backgroundColor: "#18678d",
                borderRadius: "25px",
                padding: "10px 20px",
                fontSize: "1.25rem",
                textDecoration: "none",
                transition: "background-color 0.3s ease",
                ...blogTextStyle,
                color: "white",
              }}
              onMouseEnter={(event) => {
                event.target.style.backgroundColor = "#0f5a80";
                event.target.style.color = "#d2e6ef";
              }}
              onMouseLeave={(event) => {
                event.target.style.backgroundColor = "#18678d";
                event.target.style.color = "white";
              }}
            >
              المزيد من الأحداث
            </a>
          </div>

          <hr />
          <Suspense fallback={<LoadingSpinner />}>
            <CountryFlagsSection countryFlags={countryFlags} />
          </Suspense>
          <br />
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default LandingPage;
