import React from "react";
import Form from "react-bootstrap/Form";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { blogTextStyle } from "./constants";

export const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/ar/search-results", { state: { searchTerm } });
  };

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      handleSearch();
    }
  }

  return (
    <div className="container my-4">
      <div
        className="row"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: isMobile ? "translateX(10%)" : "translateX(-25%)",
          width: isMobile ? "90%" : "",
          ...blogTextStyle,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: isMobile ? "100%" : "50%",
            transform: isMobile ? "" : "translateX(50%)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "25px",
            overflow: "hidden",
            border: "1px solid #1e81b0",
          }}
        >
          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="btn"
            style={{
              backgroundColor: "#1e81b0",
              color: "white",
              borderRadius: "10px",
              padding: "10px 20px",
              fontSize: "1.25rem",
              border: "none",
              margin: "10px",
            }}
            onMouseEnter={(event) => {
              event.target.style.backgroundColor = "#0f5a80";
            }}
            onMouseLeave={(event) => {
              event.target.style.backgroundColor = "#1e81b0";
            }}
          >
            بحث
          </button>

          {/* Input Field */}
          <Form.Control
            type="text"
            placeholder="...ابحث هنا"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "1.25rem",
              border: "none",
              textAlign: "right",
              color: "#1e81b0",
              width: "100%",
              outline: "none",
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
};
