import React, { useState, useEffect } from "react";
import { parseISO, differenceInDays } from "date-fns";
import { importAllImages } from "../../helpers/importImages";
import {
  blogTextStyle,
  generalURL,
  numOfSlicesArticles,
} from "./constants";

const LatestArticles = ({ data, sortBy }) => {
  const [sortedArticles, setSortedArticles] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const images = importAllImages(
    require.context("../../images", false, /\.(png|jpe?g|webp)$/)
  );
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const sortedData = [...data].sort((a, b) => {
        const today = new Date();
        const dateA = parseISO(formatDate(a[sortBy]));
        const dateB = parseISO(formatDate(b[sortBy]));
        return (
          Math.abs(differenceInDays(today, dateA)) -
          Math.abs(differenceInDays(today, dateB))
        );
      });
      setSortedArticles(sortedData);
    }
  }, [data, sortBy]);

  const formatDate = (excelDate) => {
    if (typeof excelDate === "number") {
      const date = new Date(1900, 0, excelDate - 1);
      return date.toISOString();
    } else if (typeof excelDate === "string") {
      return excelDate;
    }
    return "";
  };

  const displayedArticles = showAll
    ? sortedArticles
    : sortedArticles.slice(0, numOfSlicesArticles);

  const articleStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
    listStyle: "none",
    padding: 0,
    justifyItems: "center",
  };

  const articleItemStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  };

  const imageStyle = {
    width: "85px",
    height: "55px",
    objectFit: "cover",
    marginBottom: "10px",
    borderRadius: "5%",
    cursor: "pointer",
  };

  const titleStyle = {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#18678d",
    textDecoration: "none",
    padding: "10px",
    display: "block", 
    borderRadius: "5px", 
    margin: "5px 0", 
    textAlign: "center",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#18678d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };
  return (
    <div style={{ border: "1px solid", borderColor: "#18678d" }}>
      <h2
        style={{
          ...blogTextStyle,
          textAlign: "center",
          backgroundColor: "#18678d",
          color: "white",
          paddingBottom: "2px",
          paddingTop: "2px",
        }}
      >
        {sortBy === "LastUpdated" ? "أحدث المقالات" : "مواعيد قريبة"}
      </h2>
      <ul style={articleStyle}>
        {displayedArticles.length > 0 ? (
          displayedArticles.map((article, index) => (
            <li key={index} style={articleItemStyle}>
              <a
                href={
                  article.countryCode
                    ? `/countries/${article.countryCode.toLowerCase()}/${
                        article.URL
                      }/`
                    : `/${article.URL || article.url}/`
                }
              >
                <img
                  src={images[article.ImageURL] || article.cardImg}
                  alt= {article.Title || article.cardTitle}
                  style={imageStyle}
                  loading="lazy"
                  width="85px"
                  height="55px"
                />
              </a>
              <a
                href={
                  article.countryCode
                    ? `/countries/${article.countryCode.toLowerCase()}/${
                        article.URL
                      }/`
                    : `/${article.URL || article.url}/`
                }
                style={{ ...titleStyle, ...blogTextStyle }}
              >
                {article.Title || article.cardTitle}
              </a>
            </li>
          ))
        ) : (
          <p style={blogTextStyle}>لا يوجد مقالات</p>
        )}
      </ul>
      {!showAll && (
        <div style={buttonContainerStyle}>
          <a
            href={
              sortedArticles.some((article) => article.countryCode)
                ? `/countries/${sortedArticles
                    .find((article) => article.countryCode)
                    .countryCode.toLowerCase()}/جميع_المناسبات/`
                : `/${generalURL}/`
            }
          >
            <button
              style={{
                ...buttonStyle,
                ...blogTextStyle,
                color: "white",
              }}
              onMouseEnter={(event) => {
                event.target.style.color = "#d2e6ef";
              }}
              onMouseLeave={(event) => {
                event.target.style.color = "white";
              }}
            >
              المزيد
            </button>
          </a>
        </div>
      )}
     
    </div>
  );
};

export default LatestArticles;
