import React from "react";
import { blogTextStyle } from "./constants";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#18678d",
        padding: "30px 20px",
        color: "white",
        textAlign: "center",
        borderTop: "2px solid #0f5a80",
        position: "relative",
        bottom: 0,
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Links Section */}
        <div
          style={{
            flex: "1 1 100%",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "15px",
          }}
        >
          <a
            href="/about"
            style={{
              textDecoration: "none",
              fontSize: "18px",
              margin: "0 15px",
              transition: "color 0.3s ease",
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
            حول
          </a>
          <a
            href="/contact"
            style={{
              textDecoration: "none",
              fontSize: "18px",
              margin: "0 15px",
              transition: "color 0.3s ease",
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
            اتصل بنا
          </a>
        </div>
      </div>

      {/* Copyright */}
      <p
        style={{
          marginTop: "20px",
          fontSize: "14px",
          ...blogTextStyle,
          color: "white",
        }}
      >
        جميع الحقوق محفوظة &copy; موعد {new Date().getFullYear()}
      </p>
    </footer>
  );
}

export default Footer;
