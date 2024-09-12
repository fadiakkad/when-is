import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import articlesSheet from "../../Excel/Data/General.xlsx";
import { importAllImages } from "../../helpers/importImages";
import SharedHelmet from "../Helmet";
const calculateTimeLeft = (targetDate) => {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};
const images = importAllImages(
  require.context("../../images", false, /\.(png|jpe?g|webp)$/)
);

const ArticlePage = () => {
  const { articleSlug } = useParams();
  const [article, setArticle] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

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

      if (articleData) {
        setTimeLeft(calculateTimeLeft(articleData.TargetDate));
      }
    };

    fileReader.readAsArrayBuffer(blob);
  };

  useEffect(() => {
    loadExcelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleSlug]);

  useEffect(() => {
    if (article) {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft(article.TargetDate));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [article]);

  if (!article) {
    return <p>المقال غير موجود</p>;
  }

  const {
    Title,
    ImageURL,
    Intro,
    WhatIs,
    Importance,
    Preparation,
    Conclusion,
    Helmet_Description,
    Helmet_Keywords,
  } = article;

  const OG_URL = `https://when-is.com/ar/general/${articleSlug}`; //TODO

  return (
    <Container className="rtl">
      <SharedHelmet
        TITLE={Title}
        DESCRIPTION={Helmet_Description}
        KEYWORDS={Helmet_Keywords}
        OG_URL={OG_URL}
        IMAGE={images[ImageURL]}
      />
      <Card
        className="my-4"
        style={{
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderColor: "#1e81b0",
        }}
      >
        <Card.Body>
          {/* Article Title */}
          <Card.Title style={{ textAlign: "center", color: "#1e81b0" }}>
            <h1>{Title}</h1>
            <p>Title</p>
          </Card.Title>

          {/* Article Image */}
          {ImageURL && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src={images[ImageURL]}
                alt={Title}
                style={{
                  width: "100%",
                  maxHeight: "600px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <p>ImageURL</p>
            </div>
          )}

          {/* Countdown Timer */}
          <div
            style={{
              textAlign: "center",
              backgroundColor: "#f8f9fa",
              padding: "15px",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            <h2 style={{ color: "#1e81b0" }}>{Title}</h2>
            <p>Title</p>
            <div style={{ fontSize: "50px", fontWeight: "bold" }}>
              {timeLeft.days} أيام {timeLeft.hours} ساعات {timeLeft.minutes}{" "}
              دقائق {timeLeft.seconds} ثواني
            </div>
          </div>

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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ArticlePage;
