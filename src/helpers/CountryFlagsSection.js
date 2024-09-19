import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Flag from "react-flagkit";
import {
  blogTextStyle,
  countriesURL,
  locale,
} from "../components/common/constants";

function CountryFlagsSection({ countryFlags }) {
  return (
    <>
      <h2
        className="rtl text-white text-center"
        style={{
          backgroundColor: "#1e81b0",
          height: "60px",
          ...blogTextStyle,
          paddingTop: "10px",
        }}
      >
        أحداث مخصصة لكل دولة
      </h2>
      <br />
      <Row lg={4} className="g-3 justify-content-center rtl">
        {countryFlags.map((country, index) => (
          <a
            key={index}
            href={`/${locale}/${countriesURL}/${country.url}/`}
            style={{ textDecoration: "none" }}
          >
            <Card
              className="text-center"
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderColor: "#1e81b0",
                padding: "10px",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  margin: "0 auto",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f7f7f7",
                  border: "2px",
                }}
              >
                <Flag country={country.countryCode.toUpperCase()} size={48} />
              </div>
              <Card.Body>
                <Card.Title
                  style={{
                    marginTop: "10px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    ...blogTextStyle,
                  }}
                >
                  {country.name}
                </Card.Title>
              </Card.Body>
            </Card>
          </a>
        ))}
      </Row>
    </>
  );
}

export default CountryFlagsSection;
