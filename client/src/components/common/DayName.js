import React from "react";

const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const DayName = ({ dateString }) => {
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()]; 
  };

  return <span>{getDayName(dateString)}</span>;
};

export default DayName;
