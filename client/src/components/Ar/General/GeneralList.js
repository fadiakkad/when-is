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
import { blogTextStyle } from "../../common/constants.js";
import Flag from "react-flagkit";

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
        console.log("jsonData: ", jsonData);
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
                      href={`/ar/general/${card.url}/`}
                      style={{ textDecoration: "none", ...blogTextStyle }}
                    >
                      <Card.Img
                        variant="top"
                        src={card.cardImg}
                        alt={card.titleInternal}
                        loading="lazy"
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
                          style={{ textAlign: "center", color: "#18678d" }}
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
                  <a href={`/ar/countries/${country.url}/`} style={linkStyle}>
                    <Flag
                      country={country.countryCode.toUpperCase()}
                      style={flagStyle}
                    />
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
