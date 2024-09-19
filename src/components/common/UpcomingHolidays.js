import React, { useState, useEffect } from "react";
import { parseISO, differenceInDays } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import { importAllImages } from "../../helpers/importImages";
import {
  numOfSlicesHolidays,
  countriesURL,
  holidaysURL,
  locale,
  generalURL,
  blogTextStyle,
} from "./constants";

export const formatDate = (excelDate) => {
  if (typeof excelDate === "number") {
    const date = new Date(1900, 0, excelDate - 1);
    return date.toISOString();
  } else if (typeof excelDate === "string") {
    return excelDate;
  }
  return "";
};

const UpcomingHolidays = ({ data, sortBy }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const segments = pathname.split("/");
  const countryCode = segments[3];

  const [sortedHolidays, setSortedHolidays] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const images = importAllImages(
    require.context("../../images", false, /\.(png|jpe?g|webp)$/)
  );

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const filteredHolidays = data.filter(
        (holiday) => holiday.isHoliday === true
      );

      const sortedData = [...filteredHolidays].sort((a, b) => {
        const today = new Date();
        const dateA = parseISO(formatDate(a[sortBy]));
        const dateB = parseISO(formatDate(b[sortBy]));
        return (
          Math.abs(differenceInDays(today, dateA)) -
          Math.abs(differenceInDays(today, dateB))
        );
      });

      setSortedHolidays(sortedData);
    }
  }, [data, sortBy]);

  const handleMoreClick = () => {
    navigate(`/${locale}/${countryCode}/${holidaysURL}/`, {
      state: { holidayData: sortedHolidays },
    });
  };

  const displayedHolidays = showAll
    ? sortedHolidays
    : sortedHolidays.slice(0, numOfSlicesHolidays);

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
    color: "#1e81b0",
    textDecoration: "none",
    marginBottom: "2px",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#1e81b0",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div style={{ border: "1px solid", borderColor: "#1e81b0" }}>
      <h2
        style={{
          textAlign: "center",
          backgroundColor: "#1e81b0",
          paddingBottom: "10px",
          ...blogTextStyle,
          color: "white",
          paddingTop: "10px",
        }}
      >
        العطل القادمة
      </h2>
      <ul style={articleStyle}>
        {displayedHolidays.length > 0 ? (
          displayedHolidays.map((article, index) => (
            <li key={index} style={articleItemStyle}>
              <a
                href={
                  article.countryCode
                    ? `/${locale}/${countriesURL}/${article.countryCode.toLowerCase()}/${
                        article.URL
                      }`
                    : `/${locale}/${generalURL}/${article.URL}`
                }
                style={{ ...titleStyle, ...blogTextStyle }}
              >
                <img
                  src={images[article.ImageURL]}
                  alt={article.Title}
                  style={imageStyle}
                />
              </a>
              <a
                href={
                  article.countryCode
                    ? `/${locale}/${countriesURL}/${article.countryCode.toLowerCase()}/${
                        article.URL
                      }`
                    : `/${locale}/${generalURL}/${article.URL}`
                }
                style={{ ...titleStyle, ...blogTextStyle }}
              >
                {article.Title}
              </a>
            </li>
          ))
        ) : (
          <p style={{ ...blogTextStyle, color: "black" }}>لا يوجد مقالات</p>
        )}
      </ul>
      {!showAll && (
        <div style={buttonContainerStyle}>
          <button
            onClick={handleMoreClick}
            style={{ ...buttonStyle, ...blogTextStyle, color: "white" }}
          >
            المزيد
          </button>
        </div>
      )}
      <br />
    </div>
  );
};

export default UpcomingHolidays;
