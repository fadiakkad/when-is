import React from "react";
import moment from "moment-hijri";
import { blogTextStyle } from "./constants";

const GregorianToHijri = ({ date }) => {
  let hijriDate = "";
  const isValidDate = moment(date, "YYYY-MM-DD", true).isValid();
  if (isValidDate && moment(date).year() > 1937) {
    hijriDate = moment(date, "YYYY-MM-DD").format("iYYYY/iM/iD");
  }

  return (
    <div>
      <p style={{ ...blogTextStyle, color: "black" }}>{hijriDate}</p>
    </div>
  );
};

export default GregorianToHijri;
