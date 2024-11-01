import React, { useEffect, useState } from "react";
import { countryNames } from "../Ar/countries/CountriesNamesCodes";
import { blogTextStyle, holidaysURL } from "./constants";
import { isMobile } from "react-device-detect";

const HolidayMessage = () => {
  const [userCountry, setUserCountry] = useState(null);


  useEffect(() => {
    const endpoint = "https://freeipapi.com/api/json/";

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        if (response.error) {
          return;
        }

        const countryCode = response.countryCode.toLowerCase();

        if (countryNames[countryCode]) {
          setUserCountry(countryCode);
        }
      }
    };
    xhr.open("GET", endpoint, true);
    xhr.send();
  }, []);


  if (!userCountry) {
    return null;
  }

  return (
    <a
      href={`/countries/${userCountry}/${holidaysURL}/`}
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
          width: isMobile ? "90%" : "auto",
        }}
        onMouseEnter={(event) => {
          event.target.style.backgroundColor = "#18678d";
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
