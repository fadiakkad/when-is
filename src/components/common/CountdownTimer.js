import React, { useState, useEffect, useRef } from "react";
import { Table } from "react-bootstrap";
import SocialMedia from "./SocialMedia";
import { blogTextStyle, createCountdownURL, locale } from "./constants";
import { isMobile } from "react-device-detect";
import HolidayMessage from "./HolidayMessage";

const CountdownTimer = ({ targetDate, CountDown, EventName, shareUrl }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTabletOrLarger, setIsTabletOrLarger] = useState(false);
  const countdownRef = useRef(null);

  const calculateTimeLeft = (targetDate) => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        totalDays: Math.floor(difference / (1000 * 60 * 60 * 24)),
        totalHours: Math.floor(difference / (1000 * 60 * 60)),
        months: Math.floor(difference / (1000 * 60 * 60 * 24 * 30)),
        days: Math.floor((difference / (1000 * 60 * 60 * 24)) % 30),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = {
        totalDays: 0,
        totalHours: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return timeLeft;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    const checkDeviceSize = () => {
      const screenWidth = window.innerWidth;
      setIsTabletOrLarger(screenWidth >= 768 && screenWidth <= 1280);
    };

    checkDeviceSize();
    window.addEventListener("resize", checkDeviceSize);

    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []);

  const toggleFullscreen = () => {
    if (!isMobile && !isTabletOrLarger) {
      const elem = countdownRef.current;
      if (isFullscreen) {
        document.exitFullscreen?.();
        setIsFullscreen(false);
      } else {
        elem.requestFullscreen?.();
        setIsFullscreen(true);
      }
    }
  };

  return (
    <div
      ref={countdownRef}
      style={{
        textAlign: "center",
        padding: "15px",
        borderRadius: "10px",
        marginTop: "20px",
        border: "1px solid #1e81b0",
        position: "relative",
        backgroundColor: "white",
      }}
    >
      {/* Countdown Display */}
      {
        <>
          {/* Display when not in fullscreen */}
          <h2
            className="text-white"
            style={{
              backgroundColor: "#1e81b0",
              height: "50px",
              padding: "5px 0",
              ...blogTextStyle,
            }}
          >
            {CountDown}
          </h2>
          <p style={{ ...blogTextStyle, color: "black" }}>CountDown</p>
          <div style={{ position: "relative" }}>
            <HolidayMessage />
          </div>
          <div style={{ display: "table", width: "100%", fontWeight: "bold" }}>
            <div style={{ display: "table-row" }}>
              <div
                style={{
                  display: "table-cell",
                  fontSize: "50px",
                  textAlign: "center",
                }}
              >
                {timeLeft.months}
              </div>
              <div
                style={{
                  display: "table-cell",
                  fontSize: "50px",
                  textAlign: "center",
                }}
              >
                {timeLeft.days}
              </div>
              <div
                style={{
                  display: "table-cell",
                  fontSize: "50px",
                  textAlign: "center",
                }}
              >
                {timeLeft.hours}
              </div>
              <div
                style={{
                  display: "table-cell",
                  fontSize: "50px",
                  textAlign: "center",
                }}
              >
                {timeLeft.minutes}
              </div>
              <div
                style={{
                  display: "table-cell",
                  fontSize: "50px",
                  textAlign: "center",
                }}
              >
                {timeLeft.seconds}
              </div>
            </div>
            <div style={{ display: "table-row" }}>
              <div
                style={{
                  display: "table-cell",
                  fontSize: "20px",
                  textAlign: "center",
                  ...blogTextStyle,
                  color: "black",
                }}
              >
                أشهر
              </div>
              <div
                style={{
                  display: "table-cell",
                  fontSize: "20px",
                  textAlign: "center",
                  ...blogTextStyle,
                  color: "black",
                }}
              >
                أيام
              </div>
              <div
                style={{
                  display: "table-cell",
                  fontSize: "20px",
                  textAlign: "center",
                  ...blogTextStyle,
                  color: "black",
                }}
              >
                ساعات
              </div>
              <div
                style={{
                  display: "table-cell",
                  fontSize: "20px",
                  textAlign: "center",
                  ...blogTextStyle,
                  color: "black",
                }}
              >
                دقائق
              </div>
              <div
                style={{
                  display: "table-cell",
                  fontSize: "20px",
                  textAlign: "center",
                  ...blogTextStyle,
                  color: "black",
                }}
              >
                ثواني
              </div>
            </div>
          </div>
          <hr />
          <Table striped bordered hover responsive>
            <tbody>
              <tr>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {`باقي على ${EventName} بالأشهر:`}
                </td>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {Math.floor(timeLeft.months)} أشهر
                </td>
              </tr>
              <tr>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {`باقي على ${EventName} بالأيام:`}
                </td>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {Math.floor(timeLeft.totalDays)} أيام
                </td>
              </tr>
              <tr>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {`باقي على ${EventName} بالساعات:`}
                </td>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {Math.floor(timeLeft.totalHours)} ساعات
                </td>
              </tr>
            </tbody>
          </Table>
          <hr />
          <SocialMedia shareUrl={shareUrl} />
        </>
      }

      {!isMobile && !isTabletOrLarger && (
        <button
          onClick={toggleFullscreen}
          style={{
            position: "absolute",
            right: "10px",
            bottom: "10px",
            padding: "10px 20px",
            backgroundColor: "#1e81b0",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isFullscreen ? "خروج من وضع ملء الشاشة" : "عرض ملء الشاشة"}
        </button>
      )}
      {!isFullscreen ? (
        <a href={`/${locale}/${createCountdownURL}/`}>
          <button
            style={{
              position: "relative",
              backgroundColor: "#1e81b0",
              padding: "10px 20px",
              color: "white",
              marginTop: "10px",
              marginRight: isMobile ? "" : "820px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            أنشئ العد التنازلي الخاص بك!
          </button>
        </a>
      ) : (
        ""
      )}
    </div>
  );
};

export default CountdownTimer;
