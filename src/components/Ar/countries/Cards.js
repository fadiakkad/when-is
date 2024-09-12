import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { importAllImages } from "../../../helpers/importImages";
import { countries } from "./CountriesList";

function Cards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cardData, setCardData] = useState([]);
  const { countryCode } = useParams();
  const [countryFlags, setCountryFlags] = useState([]);
  const [visibleCards, setVisibleCards] = useState(9);
  // eslint-disable-next-line no-unused-vars
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const images = importAllImages(
    require.context("../../../images", false, /\.(png|jpe?g|webp)$/)
  );

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        if (countryCode) {
          const excelFile = await import(
            `../../../Excel/Data/Countries/${countryCode}.xlsx`
          );
          const response = await fetch(excelFile.default);
          const arrayBuffer = await response.arrayBuffer();
          const data = new Uint8Array(arrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          const parsedData = jsonData.map((row, index) => ({
            cardNumber: index + 1,
            cardTitle: row.Title,
            cardImg: images[row.ImageURL],
            url: row.URL,
          }));
          setCardData(parsedData);
          setShowMore(parsedData.length > 9);
        } else {
          console.error("Country code is not defined.");
        }
      } catch (error) {
        console.error("Error loading card data:", error);
      }
    };

    fetchCardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode]);

  useEffect(() => {
    const fetchCountryFlags = async () => {
      const allCountriesData = [];
      for (const country of countries) {
        try {
          const response = await fetch(country.data);
          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
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

  const filteredCards = cardData.filter((card) =>
    card.cardTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigate = (url) => {
    navigate(`/ar/countries/${countryCode}/${url}/`);
  };

  const handleShowMore = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + 6);
  };

  const adColumnClass = isMobile ? "col-12 mb-3" : "col-3";
  const cardColumnClass = isMobile ? "col-12 mb-3" : "col-3";

  return (
    <>
      {/* Search bar */}
      <div className="container my-4">
        <div className="row justify-content-center">
          <Form.Group controlId="searchBar">
            <Form.Control
              type="text"
              placeholder="..ابحث هنا"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: "25px",
                padding: "10px",
                fontSize: "1.25rem",
                border: "1px solid #1e81b0",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                color: "#1e81b0",
                textAlign: "right",
                width: isMobile ? "100%" : "50%",
                transform: isMobile ? "" : "translateX(50%)",
              }}
            />
          </Form.Group>
        </div>
      </div>

      <br />

      {/* First row with 3 Cards and Ad Section */}
      <Row className="rtl" xs={1} sm={2} md={4} lg={4}>
        {filteredCards.slice(0, 3).map((card, index) => (
          <Col
            key={index}
            className={cardColumnClass}
            style={{ paddingBottom: "10px" }}
          >
            <Card
              className="h-100"
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                borderColor: "#1e81b0",
              }}
              onClick={() => handleNavigate(card.url)}
            >
              <Card.Img
                variant="top"
                src={card.cardImg}
                alt={card.cardTitle}
                style={{
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  objectFit: "cover",
                  height: "200px",
                }}
              />
              <Card.Body>
                <Card.Title style={{ textAlign: "center", color: "#1e81b0" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {card.cardTitle}
                  </h2>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {/* Ad Section */}
        <Col className={adColumnClass}>
          <div
            style={{
              backgroundColor: "yellow",
              height: "100%",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <h3>Ad Section</h3>
          </div>
        </Col>
      </Row>

      {/* Second row with 2nd set of 3 Cards and Country links */}
      <Row className="rtl" xs={1} sm={2} md={4} lg={4}>
        {filteredCards.slice(3, 6).map((card, index) => (
          <Col
            key={index}
            className={cardColumnClass}
            style={{ paddingBottom: "10px" }}
          >
            <Card
              className="h-100"
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                borderColor: "#1e81b0",
              }}
              onClick={() => handleNavigate(card.url)}
            >
              <Card.Img
                variant="top"
                src={card.cardImg}
                alt={card.cardTitle}
                style={{
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  objectFit: "cover",
                  height: "200px",
                }}
              />
              <Card.Body>
                <Card.Title style={{ textAlign: "center", color: "#1e81b0" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {card.cardTitle}
                  </h2>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {/* Country links */}
        <Col className={adColumnClass}>
          {!isMobile && (
            <div className="mt-3">
              <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                أحداث مخصصة لكل دولة
              </p>
              {countryFlags.map((country, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <a
                    href={`/ar/countries/${country.url}/`}
                    style={{ color: "#1e81b0", textDecoration: "none" }}
                  >
                    {country.name}
                  </a>
                </div>
              ))}
            </div>
          )}
        </Col>
      </Row>

      {/* Third row with remaining Cards up to visibleCards */}
      <Row className="rtl" xs={1} sm={2} md={4} lg={4}>
        {filteredCards.slice(6, visibleCards).map((card, index) => (
          <Col
            key={index}
            className={cardColumnClass}
            style={{ paddingBottom: "10px" }}
          >
            <Card
              className="h-100"
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                borderColor: "#1e81b0",
              }}
              onClick={() => handleNavigate(card.url)}
            >
              <Card.Img
                variant="top"
                src={card.cardImg}
                alt={card.cardTitle}
                style={{
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  objectFit: "cover",
                  height: "200px",
                }}
              />
              <Card.Body>
                <Card.Title style={{ textAlign: "center", color: "#1e81b0" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {card.cardTitle}
                  </h2>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Show More Button */}
      {filteredCards.length > visibleCards && (
        <div className="text-center my-3">
          <button
            onClick={handleShowMore}
            className="btn btn-primary"
            style={{
              borderRadius: "25px",
              backgroundColor: "#1e81b0",
              padding: "10px 20px",
              fontSize: "18px",
              color: "white",
            }}
          >
            عرض المزيد
          </button>
        </div>
      )}
    </>
  );
}

export default Cards;
