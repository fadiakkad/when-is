import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CountdownTimer from "./CountdownTimer";
import LastUpdate from "./LastUpdate";
import { TopAdsDesktop, BodyAdsMobile, BodyAdsDesktop } from "./Ads";
import SharedHelmet from "./Helmet";
import LatestArticles from "./LatestArticles";
import { isMobile } from "react-device-detect";
import UpcomingHolidays from "./UpcomingHolidays";
import { blogTextStyle } from "./constants";

const SharedArticlePage = ({
  Title,
  ImageURL,
  LastUpdated,
  TextBelowTitle,
  CountDown,
  EventName,
  Intro,
  WhatIs,
  Importance,
  Preparation,
  Conclusion,
  TargetDate,
  Helmet_Description,
  Helmet_Keywords,
  OG_URL,
  images,
  countryCode,
  locale = "ar",
  LatestArticlesData,
}) => (
  <Container className="rtl">
    <SharedHelmet
      TITLE={Title}
      DESCRIPTION={Helmet_Description}
      KEYWORDS={Helmet_Keywords}
      OG_URL={OG_URL}
      IMAGE={images[ImageURL]}
    />
    <TopAdsDesktop />
    <br />
    <Row>
      <Col xs={12} lg={8}>
        {/* Article Title */}
        <div style={blogTextStyle}>
          <h1 style={blogTextStyle}>{Title}</h1>
          <p>Title</p>
        </div>
        <p style={{ ...blogTextStyle, color: "black" }}>
          {TextBelowTitle}
          <br />
          TextBelowTitle
        </p>

        {/* Last Updated */}
        <LastUpdate
          label="تاريخ اخر تحديث"
          isoDate={LastUpdated}
          locale={locale}
        />
      </Col>
      <Col xs={12} lg={4}>
        <LatestArticles data={LatestArticlesData} sortBy="LastUpdated" />
      </Col>
    </Row>
    <Row>
      <Col xs={12} lg={8}>
        {/* Article Image */}
        {ImageURL && (
          <div>
            <br />
            <img
              src={images[ImageURL]}
              alt={Title}
              style={{
                width: isMobile ? "340px" : "614px",
                maxHeight: "292px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <p>ImageURL</p>
          </div>
        )}
      </Col>
      <Col xs={12} lg={4}>
        <br />
        <BodyAdsDesktop />
      </Col>
    </Row>
    <br />
    <BodyAdsMobile />
    <hr />
    {/* Countdown Timer */}
    <CountdownTimer
      targetDate={TargetDate}
      CountDown={CountDown}
      EventName={EventName}
      shareUrl={OG_URL}
    />
    <Row>
      <Col xs={12} lg={9}>
        {/* Table of Contents */}
        <div
          style={{
            backgroundColor: "#f1f1f1",
            padding: "15px",
            marginTop: "30px",
            borderRadius: "10px",
            textAlign: "right",
          }}
        >
          <h3 style={{ color: "#1e81b0", fontSize: "22px", ...blogTextStyle }}>
            محتويات المقال:
          </h3>
          <ul>
            <li>
              <a href="#intro" style={blogTextStyle}>
                المقدمة
              </a>
            </li>
            <li>
              <a href="#what-is" style={blogTextStyle}>
                ما هو {Title}؟
              </a>
            </li>
            <li>
              <a href="#importance" style={blogTextStyle}>
                لماذا يعتبر {Title} مهمًا؟
              </a>
            </li>
            <li>
              <a href="#preparation" style={blogTextStyle}>
                التحضير لـ {Title}
              </a>
            </li>
            <li>
              <a href="#conclusion" style={blogTextStyle}>
                الخاتمة
              </a>
            </li>
          </ul>
        </div>
        {/* Article Content */}
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <h2
            id="intro"
            style={{ color: "#1e81b0", fontSize: "22px", ...blogTextStyle }}
          >
            المقدمة
          </h2>
          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.8",
              ...blogTextStyle,
              color: "black",
            }}
          >
            {Intro}
          </p>
          <br />
          <hr />
          <br />
          <h2
            id="what-is"
            style={{ color: "#1e81b0", fontSize: "22px", ...blogTextStyle }}
          >
            ما هو {Title}؟
          </h2>
          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.8",
              ...blogTextStyle,
              color: "black",
            }}
          >
            {WhatIs}
          </p>
          <br />
          <hr />
          <br />
          <h2
            id="importance"
            style={{ color: "#1e81b0", fontSize: "22px", ...blogTextStyle }}
          >
            لماذا يعتبر {Title} مهمًا؟
          </h2>
          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.8",
              ...blogTextStyle,
              color: "black",
            }}
          >
            {Importance}
          </p>
          <br />
          <hr />
          <br />
          <h2
            id="preparation"
            style={{ color: "#1e81b0", fontSize: "22px", ...blogTextStyle }}
          >
            التحضير لـ {Title}
          </h2>
          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.8",
              ...blogTextStyle,
              color: "black",
            }}
          >
            {Preparation}
          </p>
          <br />
          <hr />
          <br />
          <h2
            id="conclusion"
            style={{ color: "#1e81b0", fontSize: "22px", ...blogTextStyle }}
          >
            الخاتمة
          </h2>
          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.8",
              ...blogTextStyle,
              color: "black",
            }}
          >
            {Conclusion}
          </p>
        </div>
      </Col>
      <Col xs={12} lg={3}>
        <br />
        <LatestArticles
          data={LatestArticlesData}
          sortBy="TargetDate"
          countryCode={countryCode}
        />
        <br />
        <br />
        <br />
        {countryCode === undefined ? (
          ""
        ) : (
          <UpcomingHolidays data={LatestArticlesData} sortBy="LastUpdated" />
        )}
      </Col>
    </Row>
  </Container>
);

export default SharedArticlePage;
