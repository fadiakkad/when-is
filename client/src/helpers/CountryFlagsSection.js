import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import {
  blogTextStyle,
} from "../components/common/constants";
import LazyLoadFlag from "./LazyLoadFlag";
function CountryFlagsSection({ countryFlags }) {
  return (
    <>
      <h2
        className="text-white text-center"
        dir="rtl"
        style={{
          backgroundColor: "#18678d",
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
            href={`/countries/${country.url}/جميع_المناسبات/`}
            style={{ textDecoration: "none" }}
          >
            <Card
              className="text-center"
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderColor: "#18678d",
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
                <LazyLoadFlag countryCode={country.countryCode.toUpperCase()} />
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
