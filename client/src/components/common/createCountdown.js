import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  blogTextStyle,
  collectionName,
  countdowns_per_day,
  countdownURL,
  createCountdownURL,
  descriptionMaxLength,
  titleMaxLength,
} from "./constants";
import Swal from "sweetalert2";
import SharedHelmet from "./Helmet";
import { websiteURL } from "./constants";
import logoImage from "../../images/logo.jpg";
const CreateCountdown = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");

  const today = new Date().toISOString().split("T")[0];


  const setCountdownLimit = async (reset = false) => {
    const response = await fetch("https://api64.ipify.org?format=json");
    const data = await response.json();
    const now = new Date();

    if (reset) {
      const item = {
        countdown_created_at: now.getTime(),
        ip_address: data.ip,
        countdowns_remaining: countdowns_per_day,
      };
      localStorage.setItem("Countdown", JSON.stringify(item));
    } else {
      const storedData = JSON.parse(localStorage.getItem("Countdown"));
      if (storedData && storedData.countdowns_remaining > 0) {
        storedData.countdowns_remaining -= 1;
        localStorage.setItem("Countdown", JSON.stringify(storedData));
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const countdownDateTime = new Date(`${date}T${hour}:00`);
    if (isNaN(countdownDateTime)) {
      console.error("Invalid date or hour");
      return;
    }

    const getCurrentIP = async () => {
      try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error("Error fetching IP address:", error);
        return null;
      }
    };

    const currentIpAddress = await getCurrentIP();

    const storedData = JSON.parse(localStorage.getItem("Countdown"));
    const now = new Date();
    let timeDifference = storedData
      ? now.getTime() - storedData.countdown_created_at
      : null;
    let hoursPassed = timeDifference ? timeDifference / (1000 * 60 * 60) : null;


    if (!storedData || hoursPassed >= 24) {
      setCountdownLimit(true);
    }

    if (storedData) {
      if (
        storedData.ip_address === currentIpAddress &&
        hoursPassed < 24 &&
        storedData.countdowns_remaining <= 0
      ) {
        Swal.fire({
          title: "لا يمكنك إنشاء المزيد من العد التنازلي اليوم",
          text: "لقد استنفدت عدد العد التنازلي المسموح خلال الـ 24 ساعة الماضية.",
          icon: "error",
          confirmButtonText: "حسنًا",
          confirmButtonColor: "#d9534f",
        });
        return;
      }

      if (
        storedData.ip_address !== currentIpAddress &&
        storedData.countdowns_remaining <= 0 &&
        hoursPassed < 24
      ) {
        const updatedStoredData = {
          ...storedData,
          ip_address: currentIpAddress,
        };
        localStorage.setItem("Countdown", JSON.stringify(updatedStoredData));
        Swal.fire({
          title: "لا يمكنك إنشاء المزيد من العد التنازلي اليوم",
          text: "لقد استنفدت عدد العد التنازلي المسموح خلال الـ 24 ساعة الماضية.",
          icon: "error",
          confirmButtonText: "حسنًا",
          confirmButtonColor: "#d9534f",
        });
        return;
      }
    }

    try {
      Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تستطيع التعديل على العد التنازلي! إذا أردت التعديل يمكنك التواصل مع الدعم.",
        icon: "warning",
        confirmButtonColor: "#18678d",
        cancelButtonColor: "#d9534f",
        confirmButtonText: "نعم متأكد",
        showCancelButton: true,
        cancelButtonText: "إلغاء",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const docRef = await addDoc(collection(db, collectionName), {
            title,
            description,
            date: countdownDateTime,
            isAccepted: true,
            createdAt: new Date(),
          });
          const countdownId = docRef.id;
          if (storedData.ip_address !== currentIpAddress) {
            const updatedStoredData = {
              ...storedData,
              ip_address: currentIpAddress,
            };
            localStorage.setItem(
              "Countdown",
              JSON.stringify(updatedStoredData)
            );
          }
          setCountdownLimit();
          const countdown = `/${countdownURL}/${countdownId}`;
          Swal.fire({
            title: "تم إنشاء العد التنازلي الخاص بك",
            icon: "success",
            html: `
              سيمكنك رؤية العد التنازلي الخاص بك عبر هذا
              <a href="${countdown}" autofocus>الرابط</a>
              عند قبوله.
              <br/><br/>
              <button id="copyButton" style="background-color: #b0671e; color: white; border: none; padding: 10px; cursor: pointer; border-radius: 5px; font-size: 16px; font-family: 'Noto Sans Arabic'; font-weight:650;">
                نسخ الرابط
              </button>
            `,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: `
              <i class="fa fa-thumbs-up"></i> تم
            `,
            confirmButtonAriaLabel: "Thumbs up, great!",
            confirmButtonColor: "#18678d",
          });

          document
            .getElementById("copyButton")
            .addEventListener("click", () => {
              navigator.clipboard
                .writeText(`${window.location.origin}${countdown}`)
                .then(() => {
                  Swal.fire({
                    title: "تم نسخ الرابط!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                  });
                })
                .catch((err) => {
                  Swal.fire({
                    title: "فشل النسخ!",
                    text: "حدث خطأ ما أثناء نسخ الرابط.",
                    icon: "error",
                    confirmButtonColor: "#d9534f",
                  });
                });
            });
        }
      });
    } catch (error) {
      console.error("Error adding countdown: ", error);
    }
  };
  const TITLE = "إنشاء عد تنازلي لمناسباتك الخاصة بسهولة - عد تنازلي مجاني وفوري";
  const DESCRIPTION = "أنشئ عد تنازلي خاص بك لأهم مناسباتك بسهولة تامة. سواء كان عيد ميلاد، حفل زفاف، حدث رياضي، أو أي مناسبة هامة أخرى، يمكنك إنشاء عد تنازلي مجاني ومشاركته مع أصدقائك وعائلتك لزيادة الحماس! احسب الأيام، الساعات والدقائق المتبقية لأي مناسبة قادمة.";
  const KEYWORDS = "إنشاء عد تنازلي, عد تنازلي مجاني, عد تنازلي للمناسبات, حساب الوقت, حدث رياضي, عيد ميلاد, زفاف, حدث هام, ساعة عد تنازلي, مؤقت زمني, عد تنازلي للحفلات, مشاركات العد التنازلي, حساب وقت المناسبات";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": TITLE,
    "description": DESCRIPTION,
    "url": `${websiteURL}/${createCountdownURL}/`,
    "potentialAction": {
      "@type": "CreateAction",
      "target": `${websiteURL}/${createCountdownURL}/`,
      "name": TITLE
  }

  };
  const OG_URL = `${websiteURL}/${createCountdownURL}/`
  return (
    <>
      <SharedHelmet
        TITLE={TITLE}
        DESCRIPTION={DESCRIPTION}
        KEYWORDS={KEYWORDS}
        OG_URL={OG_URL}
        structuredData={structuredData}
        IMAGE={logoImage}
      />

      <div
        style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}
        dir="rtl"
      >
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
إنشاء عد تنازلي
</h1>
<br/>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <label
            htmlFor="title"
            style={{ fontWeight: "bold", ...blogTextStyle, color: "black" }}
          >
            العنوان
          </label>
          <input
            type="text"
            id="title"
            placeholder="عنوان العد التنازلي"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              ...inputStyle,
              ...blogTextStyle,
              fontWeight: "normal",
              color: "black",
            }}
            maxLength={titleMaxLength}
            required
          />
          <small style={{ textAlign: "left", color: "#888", ...blogTextStyle }}>
            عدد المحارف الباقي: {titleMaxLength - title.length}
          </small>

          <label
            htmlFor="description"
            style={{ fontWeight: "bold", ...blogTextStyle, color: "black" }}
          >
            الوصف
          </label>
          <textarea
            id="description"
            placeholder="وصف العد التنازلي"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              ...textareaStyle,
              ...blogTextStyle,
              fontWeight: "normal",
              color: "black",
            }}
            maxLength={descriptionMaxLength}
            required
          />
          <small style={{ textAlign: "left", color: "#888", ...blogTextStyle }}>
            عدد المحارف الباقي: {descriptionMaxLength - description.length}
          </small>

          <label
            htmlFor="date"
            style={{ fontWeight: "bold", ...blogTextStyle, color: "black" }}
          >
            التاريخ
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
            min={today}
            required
          />

          <label
            htmlFor="hour"
            style={{ fontWeight: "bold", ...blogTextStyle, color: "black" }}
          >
            الساعة (HH:MM)
          </label>
          <input
            type="time"
            id="hour"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            style={inputStyle}
            required
          />

          <button
            type="submit"
            style={{ ...buttonStyle, ...blogTextStyle, color: "white" }}
          >
            إنشاء
          </button>
        </form>
      </div>
    </>
  );
};

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const textareaStyle = {
  ...inputStyle,
  height: "100px",
  resize: "none",
};

const buttonStyle = {
  padding: "10px",
  backgroundColor: "#18678d",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

export default CreateCountdown;
