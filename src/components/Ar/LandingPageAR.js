import React, { useState, useEffect, lazy, Suspense } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { isMobile } from "react-device-detect";
import { read, utils } from "xlsx";
import landingPageSheet from "../../Excel/Data/General.xlsx";
import { importAllImages } from "../../helpers/importImages";
import { countries } from "./countries/CountriesNamesCodes";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { SearchBar } from "../common/SearchBar";
import { blogTextStyle, generalURL, locale } from "../common/constants";
import HolidayMessage from "../common/HolidayMessage";

const CountryFlagsSection = lazy(() =>
  import("../../helpers/CountryFlagsSection")
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

          // eslint-disable-next-line no-loop-func
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

  const limitedCards = filteredCards.slice(0, 6);
  const hasResults = limitedCards.length > 0;

  return (
    <>
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
          <Row xs={1} sm={2} md={4} lg={4} className="g-4 rtl">
            {limitedCards.length > 0 ? (
              limitedCards.map((card, index) => (
                <Col key={index} style={{ paddingBottom: "10px" }}>
                  <a
                    href={`/${locale}/${generalURL}/${card.url}/`}
                    style={{ textDecoration: "none", ...blogTextStyle }}
                  >
                    <Card
                      style={{
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        borderColor: "#1e81b0",
                      }}
                    >
                      {/* Card image */}
                      <Card.Img
                        variant="top"
                        src={card.cardImg}
                        alt={card.cardTitle}
                        loading="lazy"
                        style={{
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                          objectFit: "cover",
                          height: "200px",
                        }}
                      />
                      <Card.Body>
                        {/* Card title */}
                        <Card.Title
                          style={{ textAlign: "center", color: "#1e81b0" }}
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
              href={`/${locale}/${generalURL}/`}
              className="button-hover"
              style={{
                display: "inline-block",
                backgroundColor: "#1e81b0",
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
              }}
              onMouseLeave={(event) => {
                event.target.style.backgroundColor = "#1e81b0";
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
    </>
  );
}

export default LandingPage;
