import React from "react";

// Arabic days of the week
const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

// Component to get and display the day of the week
const DayName = ({ dateString }) => {
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()]; // getDay() returns 0 for Sunday, 1 for Monday, etc.
  };

  return <span>{getDayName(dateString)}</span>;
};

export default DayName;
