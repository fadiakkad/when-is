/* eslint-disable no-loop-func */
import React, { useState, useEffect, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { read, utils } from "xlsx";
import { importAllImages } from "../../../helpers/importImages.js";
import {
  GeneralCountryListAdsDesktop,
  GeneralCountryListAdsMobile,
} from "../../common/Ads.js";
import { SearchBar } from "../../common/SearchBar.js";
import { blogTextStyle, countriesURL, locale } from "../../common/constants.js";
import { LoadingSpinner } from "../../common/LoadingSpinner.js";
import  landingPageSheet from "../../../Excel/Data/General.xlsx";
import { fetchGeneralData } from "../../../helpers/readExcel.js";

const LatestArticles = lazy(() => import("../../common/LatestArticles"));
const UpcomingHolidays = lazy(() => import("../../common/UpcomingHolidays.js"));

let countryJsonData = "";

function Cards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cardData, setCardData] = useState([]);
  const { countryCode } = useParams();
  const [generalData, setGeneralData] = useState([]);
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
          const workbook = read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          countryJsonData = utils.sheet_to_json(sheet);
          const parsedData = countryJsonData.map((row, index) => ({
            cardNumber: index + 1,
            cardTitle: row.Title,
            cardImg: images[row.ImageURL],
            url: row.URL,
            isHoliday: row.isHoliday,
            countryCode: row.countryCode,
          }));
          setCardData(parsedData);
        } else {
          console.error("Country code is not defined.");
        }
      } catch (error) {
        console.error("Error loading card data:", error);
      }
    };
    const fetchGeneral = async () => {
      const { parsedData } = await fetchGeneralData(landingPageSheet);
      setGeneralData(parsedData);
    };
    fetchGeneral();
    fetchCardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode]);

  return (
    <>
      {/* Search bar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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
                      href={`/${locale}/${countriesURL}/${countryCode}/${card.url}/`}
                      style={{
                        textDecoration: "none",
                        ...blogTextStyle,
                        minWidth: "24px",
                        minHeight: "24px",
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={card.cardImg}
                        alt={card.url}
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
          <Suspense fallback={<LoadingSpinner />}>
            <LatestArticles
              data={[...generalData, ...countryJsonData]}
              sortBy="TargetDate"
            />
          </Suspense>
          <hr />
          <Suspense fallback={<LoadingSpinner />}>
            <UpcomingHolidays data={cardData} sortBy={"LastUpdated"} />
          </Suspense>
        </Col>
      </Row>
    </>
  );
}

export default Cards;
