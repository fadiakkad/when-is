import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { Table } from "react-bootstrap";
import { blogTextStyle, createCountdownURL } from "./constants";
import { isMobile } from "react-device-detect";
import Confetti from "./Confetti";
import { LoadingSpinner } from "./LoadingSpinner";
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
              height: "70px",
              padding: "5px 0",
              ...blogTextStyle,
            }}
          >
            العد التنازلي ل
            {EventName}
          </h2>
          <div
  style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    padding: '20px',
    backgroundColor: '#f3f4f6',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '0 auto',
    flexWrap: 'wrap', // Allows wrapping on smaller screens
  }}
>
  {[
    { value: timeLeft.months, label: 'شهر' },
    { value: timeLeft.days, label: 'يوم' },
    { value: timeLeft.hours, label: 'ساعة' },
    { value: timeLeft.minutes, label: 'دقيقة' },
    { value: timeLeft.seconds, label: 'ثانية' },
  ].map((item, index) => (
    <div
      key={index}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 15px',
        borderRadius: '8px',
        backgroundColor: '#65bee7',
        color: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        width: '120px', // Default width for desktop
        textAlign: 'center',
        fontSize: '16px',
        
        // Media query for mobile devices
        ...(window.innerWidth < 600
          ? {
              width: '80px', // Smaller width for mobile
              padding: '8px 10px',
            }
          : {}),
      }}
    >
      <div style={{ fontSize: window.innerWidth < 600 ? '30px' : '40px', fontWeight: 'bold' }}>
        {item.value}
      </div>
      <div
        style={{
          fontSize: window.innerWidth < 600 ? '14px' : '18px',
          marginTop: '5px',
          textTransform: 'uppercase',
          color: '#ffffff',
          opacity: 0.9,
        }}
      >
        {item.label}
      </div>
    </div>
  ))}
</div>


          <hr />
          <Table striped bordered hover responsive>
            <tbody>
              <tr>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {`باقي على ${EventName} بالأشهر:`}
                </td>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {Math.floor(timeLeft.months)} شهر
                </td>
              </tr>
              <tr>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {`باقي على ${EventName} بالأسابيع:`}
                </td>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {Math.floor(timeLeft.totalWeeks)} اسبوع
                </td>
              </tr>

              <tr>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {`باقي على ${EventName} بالأيام:`}
                </td>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {Math.floor(timeLeft.totalDays)} يوم
                </td>
              </tr>
              <tr>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {`باقي على ${EventName} بالساعات:`}
                </td>
                <td style={{ ...blogTextStyle, color: "black" }}>
                  {Math.floor(timeLeft.totalHours)} ساعة
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
        <a href={`/${createCountdownURL}/`}>
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
