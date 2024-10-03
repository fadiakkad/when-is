import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { LoadingSpinner } from "./LoadingSpinner";
import CountdownTimer from "./CountdownTimer";
import { collectionName } from "./constants";
import { format, toZonedTime } from "date-fns-tz";
import SharedHelmet from "./Helmet";

const Countdown = () => {
  const { countdownId } = useParams();
  const [countdown, setCountdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);
  const [timezone, setTimezone] = useState("");
  const [isUsingVPN, setIsUsingVPN] = useState(false);

  useEffect(() => {
    const fetchCountdown = async () => {
      const countdownRef = doc(db, collectionName, countdownId);
      const countdownDoc = await getDoc(countdownRef);

      if (countdownDoc.exists()) {
        const countdownData = countdownDoc.data();
        setCountdown(countdownData);
        setIsAccepted(countdownData.isAccepted);
        setLoading(false);
      } else {
        console.error("No such countdown!");
        setLoading(false);
      }
    };

    const checkUserTimezoneAndVPN = async () => {
      const { timezone, isUsingVPN } = await CheckTimezone();
      setTimezone(timezone);
      setIsUsingVPN(isUsingVPN);
    };

    fetchCountdown();
    checkUserTimezoneAndVPN();
  }, [countdownId]);

  const CheckTimezone = async () => {
    try {
      const endpoint =
        "http://ip-api.com/json/?fields=status,message,countryCode,query,proxy,timezone";
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.status !== "success") {
        console.log("Query failed: " + data.message);
        return {
          isUsingVPN: false,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
      }

      return {
        isUsingVPN: data.proxy === true,
        timezone:
          data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    } catch (error) {
      console.error("Error checking VPN:", error);
      return {
        isUsingVPN: false,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    }
  };

  const convertToUserTimezone = (firestoreTimestamp, userTimezone) => {
    const zonedTime = toZonedTime(firestoreTimestamp, userTimezone);
    const formattedTime = format(zonedTime, "yyyy-MM-dd HH:mm:ssXXX", {
      timeZone: userTimezone,
    });
    return new Date(formattedTime);
  };

  if (loading) return <LoadingSpinner />;

  if (!isAccepted) {
    return (
      <div style={styles.messageContainer}>
        <h2 style={styles.message}>هذا العد التنازلي لم يتم قبوله بعد!</h2>
        <p>يرجى الانتظار حتى يوافق المسؤول على العد التنازلي الخاص بك.</p>
      </div>
    );
  }

  const targetDate = convertToUserTimezone(countdown.date.toDate(), timezone);
  return (
    <>
      <SharedHelmet
        TITLE={countdown.title}
        DESCRIPTION={countdown.description}
        KEYWORDS={countdown.description}
        OG_URL={window.location.href}
      />
      <div style={styles.countdownContainer} dir="rtl">
        <h3 style={styles.countdownTitle}>
          العد التنازلي ل {countdown.description}
        </h3>

        {/* Show VPN warning if the user is using VPN */}
        {isUsingVPN && (
          <div style={styles.vpnWarning}>
            <p>
              <strong>تنبيه:</strong> قد لا يكون العد التنازلي دقيقًا بسبب
              استخدام VPN.
            </p>
          </div>
        )}

        {/* Countdown Timer Component */}
        <CountdownTimer
          targetDate={targetDate}
          CountDown={`العد التنازلي ل ${countdown.title}`}
          EventName={countdown.title}
          shareUrl={window.location.href}
        />
      </div>
    </>
  );
};

const styles = {
  countdownContainer: {
    padding: "20px",
    maxWidth: "1500px",
    margin: "0 auto",
    textAlign: "center",
    backgroundColor: "#f0f8ff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  countdownTitle: {
    color: "#18678d",
    fontSize: "32px",
    marginBottom: "20px",
  },
  messageContainer: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#ffe6e6",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  message: {
    color: "#d9534f",
  },
  vpnWarning: {
    backgroundColor: "#ffeb3b",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
    color: "#000",
  },
};

export default Countdown;
