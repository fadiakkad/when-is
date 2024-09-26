/* eslint-disable no-loop-func */
import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { read, utils } from "xlsx";
import { importAllImages } from "../../../helpers/importImages";
import landingPageSheet from "../../../Excel/Data/General.xlsx";
import { countries } from "../countries/CountriesNamesCodes";
import {
  GeneralCountryListAdsDesktop,
  GeneralCountryListAdsMobile,
} from "../../common/Ads";
import { SearchBar } from "../../common/SearchBar";
import { blogTextStyle } from "../../common/constants";

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
        }));

        setCardData(parsedData);
      } catch (error) {
        console.error("Error loading card data:", error);
      }
    };

    fetchCardData();
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

  // const filteredCards = cardData
  //   .filter((card) =>
  //     card.cardTitle.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   .sort((a, b) => a.date - b.date);
  return (
    <>
      {/* Search bar */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        data={combinedData}
      />

      <br />

      <Row className="rtl">
        <Col xs={12} lg={9}>
          <Row>
            {cardData.map((card, index) => (
              <React.Fragment key={index}>
                <Col xs={12} md={4} lg={4} className="mb-4">
                  <Card
                    style={{
                      borderRadius: "10px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      borderColor: "#1e81b0",
                    }}
                  >
                    <a
                      href={`/ar/general/${card.url}/`}
                      style={{ textDecoration: "none", ...blogTextStyle }}
                    >
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
                        <Card.Title
                          style={{ textAlign: "center", color: "#1e81b0" }}
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
          <br />
          <GeneralCountryListAdsDesktop />
          <hr />
          <div className="mt-3">
            <p style={{ fontSize: "24px", fontWeight: "bold", ...blogTextStyle, color: "black" }}>
              أحداث مخصصة لكل دولة
            </p>{" "}
            {countryFlags.map((country, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <a
                  href={`/ar/countries/${country.url}/`}
                  style={{ ...blogTextStyle, textDecoration: "none" }}
                >
                  {country.name}
                </a>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </>
  );
}

export default General;
