import React, { useRef, useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { Table, Button, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { blogTextStyle } from "../../common/constants";
import { fetchCountryFlags } from "../../../helpers/readExcel";
import GregorianToHijri from "../../common/GregorianToHijri";

const HolidayTable = () => {
  const location = useLocation();
  // const { holidayData } = location.state || {};
  const [holidays, setHolidays] = useState([]);
  const pathname = location.pathname;
  const segments = pathname.split("/");
  const countryCode = segments[2];
  const tableRef = useRef();

  useEffect(() => {
    // if (holidayData) {
    //   setHolidays(holidayData);
    // } else {
    fetchCountryFlags()
      .then((data) => {
        const holidayEvents = data.combinedJsonData
          .filter(
            (item) =>
              item.isHoliday === true &&
              item.countryCode.toLowerCase() === countryCode
          )
          .sort((a, b) => a.LastUpdated - b.LastUpdated);
        setHolidays(holidayEvents);
      })
      .catch((error) => {
        console.error("Error fetching holiday data:", error);
      });
    // }
  }, [countryCode]);

  const calculateDaysLeft = (excelDate) => {
    const today = new Date();
    if (typeof excelDate === "number") {
      const holidayDate = new Date(1900, 0, excelDate - 1);
      const daysLeft = differenceInDays(holidayDate, today);
      return daysLeft >= 0
        ? `${daysLeft} أيام باقية من تاريخ اليوم`
        : "انتهت العطلة";
    }
    return "";
  };
  const buttonStyle = {
    float: "left",
  };
  const convertExcelDate = (excelDate) => {
    if (typeof excelDate === "number") {
      const date = new Date(1900, 0, excelDate - 1);
      return format(date, "yyyy-MM-dd");
    }
    return "";
  };

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  return (
    <Container className="rtl">
      <Button
        onClick={handlePrint}
        style={{
          ...blogTextStyle,
          backgroundColor: "#1e81b0",
          color: "white",
          ...buttonStyle,
        }}
      >
        اطبع الجدول
      </Button>
      <h2 style={{ ...blogTextStyle, marginTop: "20px" }}>العطل القادمة:</h2>
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
                  {holiday.Title}
                </td>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {convertExcelDate(holiday.LastUpdated)}
                </td>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  <GregorianToHijri
                    date={convertExcelDate(holiday.LastUpdated)}
                  />
                </td>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {calculateDaysLeft(holiday.LastUpdated)}
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
  );
};

export default HolidayTable;
