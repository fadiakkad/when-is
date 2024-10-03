import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { Table } from "react-bootstrap";
import { blogTextStyle, createCountdownURL, locale } from "./constants";
import { isMobile } from "react-device-detect";
import Confetti from "./Confetti";
import { LoadingSpinner } from "./LoadingSpinner";
const HolidayMessage = lazy(() => import("./HolidayMessage"));
const SocialMedia = lazy(() => import("./SocialMedia"));
const CountdownTimer = ({ targetDate, CountDown, EventName, shareUrl }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTabletOrLarger, setIsTabletOrLarger] = useState(false);
  const countdownRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const calculateTimeLeft = (targetDate) => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        totalDays: Math.floor(difference / (1000 * 60 * 60 * 24)),
        totalWeeks: Math.floor(difference / (1000 * 60 * 60 * 24 * 7)),
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
        totalWeeks: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
      setIsVisible(true);
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
        border: "1px solid #18678d",
        position: "relative",
        backgroundColor: "white",
      }}
    >
      {isVisible && <Confetti />}
      {/* Countdown Display */}
      {
        <>
          {/* Display when not in fullscreen */}
          <h2
            className="text-white"
            style={{
              backgroundColor: "#18678d",
              height: "50px",
              padding: "5px 0",
              ...blogTextStyle,
            }}
          >
            {CountDown}
          </h2>
          <p style={{ ...blogTextStyle, color: "black" }}>CountDown</p>
          <div style={{ position: "relative" }}>
            <Suspense fallback={<LoadingSpinner />}>
              <HolidayMessage />
            </Suspense>
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
                  {`باقي على ${EventName} بالأسابيع:`}
                </td>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {Math.floor(timeLeft.totalWeeks)} أسابيع
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
          <Suspense fallback={<LoadingSpinner />}>
            <SocialMedia shareUrl={shareUrl} />
          </Suspense>
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
            backgroundColor: "#18678d",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            ...blogTextStyle,
            color: "white",
          }}
          onMouseEnter={(event) => {
            event.target.style.color = "#d2e6ef";
          }}
          onMouseLeave={(event) => {
            event.target.style.color = "white";
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
              backgroundColor: "#18678d",
              padding: "10px 20px",
              marginTop: "10px",
              marginRight: isMobile ? "" : "820px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              ...blogTextStyle,
              color: "white",
            }}
            onMouseEnter={(event) => {
              event.target.style.color = "#d2e6ef";
            }}
            onMouseLeave={(event) => {
              event.target.style.color = "white";
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
