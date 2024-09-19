import React, { useEffect, useState } from "react";
import { countryNames } from "../Ar/countries/CountriesNamesCodes";
import { blogTextStyle, holidaysURL } from "./constants";
import { isMobile } from "react-device-detect";

const HolidayMessage = () => {
  const [userCountry, setUserCountry] = useState(null);

  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    const keyframes = `
      @keyframes glow {
        0% {
          box-shadow: 0 0 10px rgba(40, 78, 107, 0.5), 0 0 20px rgba(40, 78, 107, 0.3);
        }
        100% {
          box-shadow: 0 0 20px rgba(40, 78, 107, 0.9), 0 0 30px rgba(40, 78, 107, 0.6);
        }
      }
    `;
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  }, []);

  useEffect(() => {
    const endpoint =
      "http://ip-api.com/json/?fields=status,message,countryCode,query";

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        if (response.status !== "success") {
          console.log("Query failed: " + response.message);
          return;
        }

        const countryCode = response.countryCode.toLowerCase();

        if (countryNames[countryCode]) {
          setUserCountry(countryCode);
        }
      }
    };
    xhr.open("GET", endpoint, true);
    console.log("xhr: ", xhr);
    xhr.send();
  }, []);

  // TEST API
  // useEffect(() => {
  //   const mockResponse = {
  //     status: "success",
  //     countryCode: "SY",
  //   };
  //   const countryCode = mockResponse.countryCode.toLowerCase();
  //   if (countryNames[countryCode]) {
  //     setUserCountry(countryCode);
  //   }
  // }, []);

  if (!userCountry) {
    return null;
  }

  return (
    <a
      href={`/ar/${userCountry}/${holidaysURL}/`}
      style={{
        ...blogTextStyle,
        textDecoration: "none",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        style={{
          display: "inline-block",
          backgroundColor: "#0f5a80",
          borderRadius: "25px",
          padding: "10px 20px",
          fontSize: "1.25rem",
          textDecoration: "none",
          transition: "background-color 0.3s ease",
          ...blogTextStyle,
          color: "white",
          boxShadow: "0 0 20px rgba(40, 78, 107, 0.5)",
          animation: "glow 1.5s infinite alternate",
          width: isMobile ? "60%" : "auto",
        }}
        onMouseEnter={(event) => {
          event.target.style.backgroundColor = "#1e81b0";
        }}
        onMouseLeave={(event) => {
          event.target.style.backgroundColor = "#0f5a80";
        }}
      >
        تعرف على العطل الرسمية القادمة في {countryNames[userCountry]}
      </button>
    </a>
  );
};

export default HolidayMessage;
