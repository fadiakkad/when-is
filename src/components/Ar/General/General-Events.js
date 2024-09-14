import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import articlesSheet from "../../../Excel/Data/General.xlsx";
import { importAllImages } from "../../../helpers/importImages";
import SharedHelmet from "../../common/Helmet";
import { websiteURL, countriesURL } from "../../common/constants";
import LastUpdate from "../../common/LastUpdate";
import { TopAdsDesktop, BodyAdsMobile, BodyAdsDesktop } from "../../common/Ads";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CountdownTimer from "../../common/CountdownTimer";

const images = importAllImages(
  require.context("../../../images", false, /\.(png|jpe?g|webp)$/)
);

const ArticlePage = () => {
  const { articleSlug } = useParams();
  const [article, setArticle] = useState(null);

  const loadExcelData = async () => {
    const response = await fetch(articlesSheet);
    const blob = await response.blob();
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const articleData = sheet.find((row) => row.URL === articleSlug);
      setArticle(articleData);

  
    };

    fileReader.readAsArrayBuffer(blob);
  };

  useEffect(() => {
    loadExcelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleSlug]);


  if (!article) {
    return <p>المقال غير موجود</p>;
  }

  const {
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
  } = article;

  console.log(TargetDate,"xx");
  const OG_URL = `${websiteURL}/ar/${countriesURL}/general/${articleSlug}`;
  const locale = "ar"; // Example locale

  return (
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
          <div style={{ color: "#1e81b0" }}>
            <h1>{Title}</h1>
            <p>Title</p>

          </div>
          <p >
            {TextBelowTitle}
            <br />
            TextBelowTitle
          </p>

          {/* Last Updated */}

          <LastUpdate label="تاريخ اخر تحديث" isoDate={LastUpdated} locale={locale} />


        </Col>
        <Col xs={12} lg={4}>
          آخر الاحداث العامة التي تم نشرها
          <br />
          اضافة كاردات لاخر 6 مقالات  حسب التاريخ مع صورتها مع زر المزيد
          <br/> 
          انشائها في كومبوننت جديد
        </Col>
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
                    width: "614px",
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
      </Row>
      <br />
      <BodyAdsMobile />

      <hr />
      {/* Countdown Timer */}
      <CountdownTimer targetDate={TargetDate} CountDown={CountDown} EventName={EventName} shareUrl={OG_URL}/>

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
            <h3
              style={{ color: "#1e81b0", fontSize: "22px", fontWeight: "bold" }}
            >
              محتويات المقال:
            </h3>
            <ul>
              <li>
                <a href="#intro" style={{ color: "#1e81b0" }}>
                  المقدمة
                </a>
              </li>
              <li>
                <a href="#what-is" style={{ color: "#1e81b0" }}>
                  ما هو {Title}؟
                </a>
              </li>
              <li>
                <a href="#importance" style={{ color: "#1e81b0" }}>
                  لماذا يعتبر {Title} مهمًا؟
                </a>
              </li>
              <li>
                <a href="#preparation" style={{ color: "#1e81b0" }}>
                  التحضير لـ {Title}
                </a>
              </li>
              <li>
                <a href="#conclusion" style={{ color: "#1e81b0" }}>
                  الخاتمة
                </a>
              </li>
            </ul>
          </div>

          {/* Article Content */}
          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <h2
              id="intro"
              style={{ color: "#1e81b0", fontSize: "22px", fontWeight: "bold" }}
            >
              المقدمة
            </h2>
            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>{Intro}</p>
            <p className="text-center">Intro</p>
            <br />
            <hr />
            <br />

            <h2
              id="what-is"
              style={{ color: "#1e81b0", fontSize: "22px", fontWeight: "bold" }}
            >
              ما هو {Title}؟
            </h2>
            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>{WhatIs}</p>
            <p className="text-center">WhatIs</p>

            <br />
            <hr />
            <br />

            <h2
              id="importance"
              style={{ color: "#1e81b0", fontSize: "22px", fontWeight: "bold" }}
            >
              لماذا يعتبر {Title} مهمًا؟
            </h2>
            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>{Importance}</p>
            <p className="text-center">Importance</p>

            <br />
            <hr />
            <br />

            <h2
              id="preparation"
              style={{ color: "#1e81b0", fontSize: "22px", fontWeight: "bold" }}
            >
              التحضير لـ {Title}
            </h2>
            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>{Preparation}</p>
            <p className="text-center">Preparation</p>

            <br />
            <hr />
            <br />

            <h2
              id="conclusion"
              style={{ color: "#1e81b0", fontSize: "22px", fontWeight: "bold" }}
            >
              الخاتمة
            </h2>
            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>{Conclusion}</p>
            <p className="text-center">Conclusion</p>
          </div>
        </Col>
        <Col xs={12} lg={3}>
          <br />
          مواعيد قريبة للأحداث العامة (الاقرب فالاقرب)
          <br />
          اضافة هنا اقرب 6 مواعيد للأحداث العامة ب كاردات وصور صغيرة مع زر المزيد
          <br />
          انشاء كومبوننت جديد
        </Col>

      </Row>

    </Container>
  );
};

export default ArticlePage;
