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
import { blogTextStyle, websiteURL } from "../../common/constants.js";
import { LoadingSpinner } from "../../common/LoadingSpinner.js";
import landingPageSheet from "../../../Excel/Data/General.xlsx";
import { fetchGeneralData } from "../../../helpers/readExcel.js";
import SharedHelmet from "../../common/Helmet.js";
import { countryNames } from "./CountriesNamesCodes.js";
import logoImage from "../../../images/logo.jpg";
const LatestArticles = lazy(() => import("../../common/LatestArticles"));
const UpcomingHolidays = lazy(() => import("../../common/UpcomingHolidays.js"));

let countryJsonData = "";

function Cards() {
  console.log("countryCode");

  const [searchTerm, setSearchTerm] = useState("");
  const [cardData, setCardData] = useState([]);
  const { countryCode } = useParams();
  const [generalData, setGeneralData] = useState([]);
  const images = importAllImages(
    require.context("../../../images", false, /\.(png|jpe?g|webp)$/)
  );
  console.log("countryCode", countryCode);
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
            targetDate: row.TargetDate,
            eventName: row.EventName,
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
  }, [countryCode]);
  // add الاحداث العامة لكل دولة + countryName
  const TITLE = `الأحداث العامة في ${countryNames[countryCode]} - اكتشف أحدث العطلات والمناسبات والفعاليات في ${countryNames[countryCode]}`;
  const DESCRIPTION = `تعرف على الأحداث العامة، والعطلات الرسمية، والمناسبات الوطنية في ${countryNames[countryCode]}. نقدم لك تقويمًا شاملًا للفعاليات القادمة والأيام الخاصة التي يجب أن تعرفها، سواء كانت عطلات رسمية، أعياد وطنية، أو مناسبات ثقافية مهمة.`;
  const KEYWORDS = `الأحداث العامة في ${countryNames[countryCode]}, العطلات الرسمية في ${countryNames[countryCode]}, مناسبات ${countryNames[countryCode]}, تقويم الفعاليات ${countryNames[countryCode]}, الأعياد الوطنية, العطلات الدينية, تقويم ${countryNames[countryCode]}, مناسبات ثقافية`;
  const OG_URL = `${websiteURL}/countries/${countryCode}/جميع_المناسبات/`;

  const imagesToPreload = cardData.slice(0, 2).map(card => card.cardImg);

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": TITLE,
    "description": DESCRIPTION,
    "image": logoImage,
    "author": {
      "@type": "Organization",
      "name": "مواعيد"
    },
    "datePublished": "2024-10-28T00:00:00Z",
    "dateModified": "2024-11-01T00:00:00Z",
    "mainEntityOfPage": OG_URL
  };

  const eventsStructuredData = cardData.map(card => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": card.eventName,
    "startDate": card.targetDate,
    "location": {
      "@type": "Place",
      "name": countryNames[countryCode],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": countryNames[countryCode],
      }
    },
    "image": `${websiteURL}${card.cardImg}`,
    "url": `${websiteURL}/countries/${countryCode}/${card.url}/`,
    "description": `اكتشف ${card.cardTitle} في ${countryNames[countryCode]} بالإضافة إلى العد التنازلي.`,
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "performer": {
      "@type": "Organization",
      "name": "مواعيد",
      "url": `${websiteURL}/countries/${countryCode}/${card.url}/`
    },
    "organizer": {
      "@type": "Organization",
      "name": "مواعيد", 
      "url": `${websiteURL}/countries/${countryCode}/${card.url}/`
    },
  

  }));


  return (
    <>
      <SharedHelmet
        TITLE={TITLE}
        DESCRIPTION={DESCRIPTION}
        KEYWORDS={KEYWORDS}
        OG_URL={OG_URL}
        COUNTRY_CODE={countryCode}
        taxonomyTerms={KEYWORDS}
        IMAGES_PRELOAD={imagesToPreload}
        IMAGE={logoImage}
        eventsStructuredData={eventsStructuredData}
        articleStructuredData={articleStructuredData}
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
        أهم الأحداث والمناسبات والأعياد والفعاليات في {countryNames[countryCode]}
      </h1>
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
                      href={`/countries/${countryCode}/${card.url}/`}
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
                          style={{ textAlign: "center", color: "#18678d", height: '35px' }}
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
