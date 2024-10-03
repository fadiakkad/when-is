import React, { lazy, Suspense } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { TopAdsDesktop, BodyAdsMobile, BodyAdsDesktop } from "./Ads";
import SharedHelmet from "./Helmet";
import { isMobile } from "react-device-detect";
import { blogTextStyle } from "./constants";
import { LoadingSpinner } from "./LoadingSpinner";

const CountdownTimer = lazy(() => import("./CountdownTimer"));
const LastUpdate = lazy(() => import("./LastUpdate"));
const LatestArticles = lazy(() => import("./LatestArticles"));
const UpcomingHolidays = lazy(() => import("./UpcomingHolidays"));
const GregorianToHijri = lazy(() => import("../common/GregorianToHijri"));
const DayName = lazy(() => import("../common/DayName"));
const SharedArticlePage = ({
  Title,
  ImageURL,
  LastUpdated,
  TextBelowTitle,
  CountDown,
  EventName,
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
  link,
  linkTitle,
}) => (
  <Container dir="rtl">
    <SharedHelmet
      TITLE={Title}
      DESCRIPTION={Helmet_Description}
      KEYWORDS={Helmet_Keywords}
      OG_URL={OG_URL}
      IMAGE={images[ImageURL]}
      COUNTRY_CODE={countryCode}
    />
    <TopAdsDesktop />
    <br />
    <Row>
      <Col xs={12} lg={8}>
        {/* Article Title */}
        <div style={blogTextStyle}>
          <h1 style={blogTextStyle}>{Title}</h1>
        </div>
        <br />
        <p style={{ ...blogTextStyle, color: "black" }}>
          {TextBelowTitle}
          <br />
        </p>
        {/* Last Updated */}
        <Suspense fallback={<LoadingSpinner />}>
          <LastUpdate
            label="تاريخ اخر تحديث: "
            isoDate={LastUpdated}
            locale={locale}
          />
        </Suspense>
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

    <BodyAdsMobile />
    <hr />

    {/* Countdown Timer */}
    <Suspense fallback={<LoadingSpinner />}>
      <CountdownTimer
        targetDate={TargetDate}
        CountDown={CountDown}
        EventName={EventName}
        shareUrl={OG_URL}
      />
    </Suspense>
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
          <h3 style={{ color: "#18678d", fontSize: "22px", ...blogTextStyle }}>
            محتويات المقال:
          </h3>
          <ul>
            <li>
              <a href="#when-is" style={blogTextStyle}>
                متى يبدأ {EventName} ؟
              </a>
            </li>
            <li>
              <a href="#what-is" style={blogTextStyle}>
                ما هو {EventName}؟
              </a>
            </li>
            <li>
              <a href="#importance" style={blogTextStyle}>
                لماذا يعتبر {EventName} مهمًا؟
              </a>
            </li>
            <li>
              <a href="#preparation" style={blogTextStyle}>
                التحضير لـ {EventName}
              </a>
            </li>

            <li>
              <a href="#conclusion" style={blogTextStyle}>
                الخاتمة
              </a>
            </li>
            <li>
              <a href="#resource" style={blogTextStyle}>
                المصادر
              </a>
            </li>
          </ul>
        </div>
        {/* Article Content */}
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <br />
          <hr />
          <br />
          <h2
            id="when-is"
            style={{ color: "#18678d", fontSize: "22px", ...blogTextStyle }}
          >
            متى يبدأ {EventName}؟
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              fontSize: "18px",
              lineHeight: "1.8",
              ...blogTextStyle,
              color: "black",
            }}
          >
            <span style={{ marginLeft: "5px" }}>
              من المتوقع أن يبدأ موعد {EventName} في
            </span>
            <span style={{ marginLeft: "5px" }}>
              {new Date(TargetDate)
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "/")}
            </span>
            <span style={{ marginLeft: "5px" }}>ميلادي ويوافق</span>
            <span style={{ marginLeft: "5px" }}>
              <Suspense fallback={<LoadingSpinner />}>
                <GregorianToHijri date={TargetDate} />
              </Suspense>
            </span>
            <span style={{ marginLeft: "5px" }}>في التقويم الهجري</span>
            <span style={{ marginLeft: "5px" }}>والذي يُصادف يوم</span>
            <span style={{ marginLeft: "5px" }}>
              <Suspense fallback={<LoadingSpinner />}>
                <DayName dateString={TargetDate} />.
              </Suspense>
            </span>
          </div>

          <br />

          <hr />
          <br />
          <h2
            id="what-is"
            style={{ color: "#18678d", fontSize: "22px", ...blogTextStyle }}
          >
            ما هو {EventName}؟
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
            style={{ color: "#18678d", fontSize: "22px", ...blogTextStyle }}
          >
            لماذا يعتبر {EventName} مهمًا؟
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
            style={{ color: "#18678d", fontSize: "22px", ...blogTextStyle }}
          >
            التحضير لـ {EventName}
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
            style={{ color: "#18678d", fontSize: "22px", ...blogTextStyle }}
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
          <br />
          <hr />
          <br />
          <h2
            id="resource"
            style={{ color: "#18678d", fontSize: "22px", ...blogTextStyle }}
          >
            المصادر
          </h2>
          <a
            style={{
              fontSize: "18px",
              lineHeight: "1.8",
              ...blogTextStyle,
              color: "black",
            }}
            href={link}
            rel="nofollow"
          >
            {linkTitle}
          </a>
        </div>
        <br />
        <hr />
      </Col>
      <Col xs={12} lg={3}>
        <br />
        <Suspense fallback={<LoadingSpinner />}>
          <LatestArticles
            data={LatestArticlesData}
            sortBy="TargetDate"
            countryCode={countryCode}
          />
        </Suspense>
        <br />

        <br />
        {countryCode === undefined ? (
          ""
        ) : (
          <Suspense fallback={<LoadingSpinner />}>
            <UpcomingHolidays data={LatestArticlesData} sortBy="LastUpdated" />
          </Suspense>
        )}
        <br />
      </Col>
    </Row>
  </Container>
);

export default SharedArticlePage;
