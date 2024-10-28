import React from "react";
import { blogTextStyle } from "./constants";

const convertExcelSerialToDate = (serial) => {
  const excelStartDate = new Date(1899, 11, 30);
  const days = Math.floor(serial); 

  const date = new Date(excelStartDate.getTime() + days * 24 * 60 * 60 * 1000);

  return date.toISOString().split("T")[0];
};

const formatDateByCountry = (locale, date) => {
  try {
    return new Date(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

const LastUpdate = ({ label, isoDate, locale }) => {
  const isoDateConverted = convertExcelSerialToDate(isoDate);

  if (!isoDateConverted) {
    return <span>{label} - Invalid date</span>;
  }

  const currentTime = formatDateByCountry(locale, isoDateConverted);

  return (
    <span style={{ ...blogTextStyle, color: "black" }}>
      <b>
        {label}
        <time dateTime={isoDateConverted}>&nbsp;{currentTime}</time>
      </b>
    </span>
  );
};

export default LastUpdate;
