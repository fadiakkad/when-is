import React from "react";
import { blogTextStyle } from "./constants";

// Function to convert Excel serial date number to yyyy-mm-dd
const convertExcelSerialToDate = (serial) => {
  // Excel serial date starts from January 1, 1900
  const excelStartDate = new Date(1899, 11, 30); // December 30, 1899
  const days = Math.floor(serial); // Ignore fractional days

  // Calculate the date by adding days to the start date
  const date = new Date(excelStartDate.getTime() + days * 24 * 60 * 60 * 1000);

  // Convert to yyyy-mm-dd format
  return date.toISOString().split("T")[0];
};

// Function to format date based on the locale
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

// LastUpdate Component
const LastUpdate = ({ label, isoDate, locale }) => {
  // Convert Excel serial date number to yyyy-mm-dd
  const isoDateConverted = convertExcelSerialToDate(isoDate);

  if (!isoDateConverted) {
    return <span>{label} - Invalid date</span>;
  }

  // Format the date based on the provided locale
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
