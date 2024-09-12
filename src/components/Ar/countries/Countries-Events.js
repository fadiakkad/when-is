import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { importAllImages } from "../../../helpers/importImages";
import SharedHelmet from "../../Helmet";

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
  require.context("../../../images", false, /\.(png|jpe?g|webp)$/)
);

const ArticlePage = () => {
  const { countryCode, url } = useParams();
  const [timeLeft, setTimeLeft] = useState({});
  const [cardData, setCardData] = useState(null);
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
          const matchedRow = jsonData.find((row) => row.URL === url);

          if (matchedRow) {
            console.log(matchedRow);
            const parsedData = {
              cardTitle: matchedRow.Title,
              cardImg: images[matchedRow.ImageURL],
              url: matchedRow.URL,
              intro: matchedRow.Intro,
              whatIs: matchedRow.WhatIs,
              importance: matchedRow.Importance,
              preparation: matchedRow.Preparation,
              conclusion: matchedRow.Conclusion,
              targetDate: matchedRow.TargetDate,
              DESCRIPTION: matchedRow.Helmet_Description,
              KEYWORDS: matchedRow.Helmet_Keywords,
            };

            setCardData(parsedData);
          } else {
            console.error("No matching article found.");
          }
        } else {
          console.error("Country code is not defined.");
        }
      } catch (error) {
        console.error("Error loading card data:", error);
      }
    };

    fetchCardData();
  }, [countryCode, url]);

  useEffect(() => {
    if (cardData) {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft(cardData.targetDate));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cardData]);

  if (!cardData) {
    return <p>المقال غير موجود</p>;
  }

  const OG_URL = `https://when-is.com/ar/countries/${countryCode}/${url}`; //TODO

  return (
    <Container className="rtl">
      <SharedHelmet
        TITLE={cardData.cardTitle}
        DESCRIPTION={cardData.DESCRIPTION}
        KEYWORDS={cardData.KEYWORDS}
        OG_URL={OG_URL}
        IMAGE={images[cardData.cardImg]}
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
            <h1>{cardData.cardTitle}</h1>
          </Card.Title>

          {/* Article Image */}
          {cardData.cardImg && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src={cardData.cardImg}
                alt={cardData.cardTitle}
                style={{
                  width: "100%",
                  maxHeight: "600px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
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
            <h2 style={{ color: "#1e81b0" }}>{cardData.cardTitle}</h2>
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
              style={{
                color: "#1e81b0",
                fontSize: "22px",
                fontWeight: "bold",
              }}
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
                  ما هو {cardData.cardTitle}؟
                </a>
              </li>
              <li>
                <a href="#importance" style={{ color: "#1e81b0" }}>
                  لماذا يعتبر {cardData.cardTitle} مهمًا؟
                </a>
              </li>
              <li>
                <a href="#preparation" style={{ color: "#1e81b0" }}>
                  التحضير لـ {cardData.cardTitle}
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
              style={{
                color: "#1e81b0",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              المقدمة
            </h2>
            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
              {cardData.intro}
            </p>

            <br />
            <hr />
            <br />

            <h2
              id="what-is"
              style={{
                color: "#1e81b0",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              ما هو {cardData.cardTitle}؟
            </h2>
            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
              {cardData.whatIs}
            </p>

            <br />
            <hr />
            <br />

            <h2
              id="importance"
              style={{
                color: "#1e81b0",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              لماذا يعتبر {cardData.cardTitle} مهمًا؟
            </h2>
            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
              {cardData.importance}
            </p>

            <br />
            <hr />
            <br />

            <h2
              id="preparation"
              style={{
                color: "#1e81b0",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              التحضير لـ {cardData.cardTitle}
            </h2>
            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
              {cardData.preparation}
            </p>

            <br />
            <hr />
            <br />

            <h2
              id="conclusion"
              style={{
                color: "#1e81b0",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              الخاتمة
            </h2>
            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
              {cardData.conclusion}
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ArticlePage;
