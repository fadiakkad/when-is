import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  blogTextStyle,
  collectionName,
  countdowns_per_day,
  countdownURL,
  descriptionMaxLength,
  locale,
  titleMaxLength,
} from "./constants";
import Swal from "sweetalert2";

const CreateCountdown = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // const checkVPN = async () => {
  //   try {
  //     const endpoint =
  //       "http://ip-api.com/json/?fields=status,message,countryCode,query,proxy,timezone";
  //     const response = await fetch(endpoint);
  //     const data = await response.json();
  //     if (data.status !== "success") {
  //       console.log("Query failed: " + data.message);
  //       return false;
  //     }

  //     return data.proxy === true;
  //   } catch (error) {
  //     console.error("Error checking VPN:", error);
  //     return false; 
  //   }
  // };

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

    // const isUsingVPN = await checkVPN();
    // if (isUsingVPN) {
    //   Swal.fire({
    //     title: "لإنشاء عد تنازلي لا يمكنك استعمال VPN",
    //     text: "يرجى تعطيله والمحاولة مجدداً",
    //     icon: "error",
    //     confirmButtonText: "حسناً",
    //     confirmButtonColor: "#d9534f",
    //   });
    //   return;
    // }

    if (
      storedData &&
      storedData.ip_address === currentIpAddress &&
      hoursPassed < 24
    ) {
      if (storedData.countdowns_remaining <= 0) {
        Swal.fire({
          title: "مسموح بإنشاء عد تنازلي واحد كل يوم",
          text: "لقد قمت بإنشاء عد تنازلي خلال الـ 24 ساعة الماضية.",
          icon: "error",
          confirmButtonText: "حسنًا",
          confirmButtonColor: "#d9534f",
        });
        return;
      }
    } else if (!storedData || hoursPassed >= 24) {
      setCountdownLimit(true);
    }

    try {
      const docRef = await addDoc(collection(db, collectionName), {
        title,
        description,
        date: countdownDateTime,
        isAccepted: false,
      });
      const countdownId = docRef.id;
      Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تستطيع التعديل على العد التنازلي! إذا أردت التعديل يمكنك التواصل مع الدعم.",
        icon: "warning",
        confirmButtonColor: "#1e81b0",
        cancelButtonColor: "#d9534f",
        confirmButtonText: "نعم متأكد",
        showCancelButton: true,
        cancelButtonText: "إلغاء",
      }).then((result) => {
        if (result.isConfirmed) {
          setCountdownLimit();
          const countdown = `/${locale}/${countdownURL}/${countdownId}`;
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
            confirmButtonColor: "#1e81b0",
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

  return (
    <div
      style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}
      className="rtl"
    >
      <h2 style={{ textAlign: "center", color: "#1e81b0", ...blogTextStyle }}>
        إنشاء العد التنازلي الخاص بك!
      </h2>
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
  backgroundColor: "#1e81b0",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

export default CreateCountdown;
