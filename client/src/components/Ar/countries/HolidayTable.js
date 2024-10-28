import React, { useRef, useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { Table, Button, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { blogTextStyle } from "../../common/constants.js";
import { fetchCountryFlags } from "../../../helpers/readExcel.js";
import GregorianToHijri from "../../common/GregorianToHijri.js";
import { SearchBar } from "../../common/SearchBar.js";
import SharedHelmet from "../../common/Helmet.js";
import { countryNames } from "./CountriesNamesCodes.js";
import { websiteURL, holidaysURL } from "../../common/constants.js";
const HolidayTable = () => {
  const location = useLocation();
  // const { holidayData } = location.state || {};
  const [holidays, setHolidays] = useState([]);
  const pathname = location.pathname;
  const segments = pathname.split("/");
  const countryCode = segments[2];
  const tableRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCountryFlags()
      .then((data) => {
        const holidayEvents = data.combinedJsonData
          .filter(
            (item) =>
              item.isHoliday === true &&
              item.countryCode.toLowerCase() === countryCode
          )
          .sort((a, b) => a.TargetDate - b.TargetDate);
        setHolidays(holidayEvents);
      })
      .catch((error) => {
        console.error("Error fetching holiday data:", error);
      });
  }, [countryCode]);

  const calculateDaysLeft = (excelDate) => {
    const today = new Date();
    let holidayDate;

    if (typeof excelDate === "number") {
      holidayDate = new Date(1900, 0, excelDate - 1);
    } else if (typeof excelDate === "string" || excelDate instanceof Date) {
      holidayDate = new Date(excelDate);
    } else {
      return "";
    }

    const daysLeft = differenceInDays(holidayDate, today);
    return daysLeft >= 0
      ? `${daysLeft} أيام باقية من تاريخ اليوم`
      : "انتهت العطلة";
  };

  const buttonStyle = {
    float: "left",
  };
  const convertExcelDate = (excelDate) => {
    if (typeof excelDate === "number") {
      const date = new Date(1900, 0, excelDate - 1);
      return format(date, "yyyy-MM-dd");
    } else if (typeof excelDate === "string" || excelDate instanceof Date) {
      return format(new Date(excelDate), "yyyy-MM-dd");
    }
    return "";
  };

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const TITLE = `العطل القادمة في ${countryNames[countryCode]} | مواعيد العطل الرسمية والاحتفالات`;
  const DESCRIPTION = `اكتشف العطل القادمة في ${countryNames[countryCode]}، مع مواعيد جميع العطل الرسمية والاحتفالات الوطنية. ابحث عن العطلات واعرف الوقت المتبقي لكل مناسبة في ${countryNames[countryCode]}.`;
  const Helmet_Keywords = `العطل القادمة, ${countryNames[countryCode]}, ${countryCode}, العطل الرسمية, مواعيد العطل, الوقت المتبقي للعطل في ${countryNames[countryCode]}, العطل الرسمية في ${countryCode}`;
  const OG_URL = `${websiteURL}/countries/${countryCode}/${holidaysURL}`;

  const structuredData = holidays.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `العطل القادمة في ${countryNames[countryCode]}`,
    "description": `العطل والاحتفالات القادمة في ${countryNames[countryCode]}`,
    "itemListElement": holidays.map((holiday, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Event",
        "name": holiday.Title,
        "location": {
          "@type": "Place",
          "name": countryNames[countryCode],
        },
        "startDate": convertExcelDate(holiday.TargetDate),
        "eventStatus": holiday.TargetDate >= new Date() ? "https://schema.org/EventScheduled" : "https://schema.org/EventCancelled",
        "description": `عطلة قادمة: اعرف من خلال هذا الموقع ${holiday.Title} في ${countryNames[countryCode]}`
      }
    }))
  } : null;


  return (
    <>
      <SharedHelmet
        TITLE={TITLE}
        DESCRIPTION={DESCRIPTION}
        KEYWORDS={Helmet_Keywords}
        OG_URL={OG_URL}
        structuredData={structuredData}
        COUNTRY_CODE={countryCode}

      />
      <h1
        style={{
          backgroundColor: '#65bee7',
          color: '#ffffff',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',  // Reduced base font size
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)',
          padding: '0 10px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          backgroundImage: 'linear-gradient(to right, #65bee7, #4ca3d3)',
          width: '100%',
          maxWidth: '800px',  // Limits width on larger screens
          margin: '0 auto',
          // Media query for smaller screens
          '@media (max-width: 480px)': {
            fontSize: '1.2rem',
            height: '60px',
            padding: '0 5px',
          }
        }}
        className="text-white"
      >
        مواعيد العطل والأعياد القادمة في {countryNames[countryCode]}
      </h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Container dir="rtl">
        <Button
          onClick={handlePrint}
          style={{
            ...blogTextStyle,
            backgroundColor: "#18678d",
            color: "white",
            ...buttonStyle,
          }}
          onMouseEnter={(event) => {
            event.target.style.color = "#d2e6ef";
          }}
          onMouseLeave={(event) => {
            event.target.style.color = "white";
          }}
        >
          اطبع الجدول
        </Button>
        <h2 style={{ ...blogTextStyle, marginTop: "20px" }}>العطل القادمة في {countryNames[countryCode]} :</h2>
        <Table
          striped
          bordered
          hover
          ref={tableRef}
          style={{ marginTop: "20px", textAlign: "center" }}
        >
          <thead style={{ backgroundColor: "#f1f1f1" }}>
            <tr>
              <th style={blogTextStyle}>اسم الحدث</th>
              <th style={blogTextStyle}>التاريخ</th>
              <th style={blogTextStyle}>التاريخ بالهجري</th>
              <th style={blogTextStyle}>كم باقي</th>
            </tr>
          </thead>
          <tbody>
            {holidays && holidays.length > 0 ? (
              holidays.map((holiday, index) => (
                <tr key={index}>
                  <td style={{ ...blogTextStyle, color: "black" }}>
                    <h3 style={{ fontSize: '18px' }}>    {holiday.EventName} </h3>
                  </td>
                  <td style={{ ...blogTextStyle, color: "black" }}>
                    <time dateTime={convertExcelDate(holiday.TargetDate)}>
                      {convertExcelDate(holiday.TargetDate)}
                    </time>
                  </td>
                  <td style={{ ...blogTextStyle, color: "black" }}>
                    <GregorianToHijri
                      date={convertExcelDate(holiday.TargetDate)}
                    />
                  </td>
                  <td style={{ ...blogTextStyle, color: "black" }}>
                    {calculateDaysLeft(holiday.TargetDate)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ ...blogTextStyle, color: "black" }}>
                  لا يوجد عطل
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default HolidayTable;
