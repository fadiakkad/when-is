import React, { useEffect, useState } from "react";
import Flag from "react-flagkit";
import { useLocation } from "react-router-dom";
import { importAllImages } from "../../helpers/importImages";
import { Card, Col, Row } from "react-bootstrap";
import { fetchAllData } from "../../helpers/readExcel";
import landingPageSheet from "../../Excel/Data/General.xlsx";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { blogTextStyle } from "./constants";
import { SearchBar } from "./SearchBar";

const images = importAllImages(
  require.context("../../images", false, /\.(png|jpe?g|webp)$/)
);

const SearchResults = () => {
  const location = useLocation();
  const { searchTerm } = location.state || {};
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const allData = await fetchAllData(landingPageSheet);

      if (searchTerm) {
        const countryFlags = allData.countryFlags;
        const generalData = allData.generalData;
        const array1 = Array.isArray(countryFlags.allCountriesData)
          ? countryFlags.allCountriesData
          : [];
        const array2 = Array.isArray(countryFlags.combinedJsonData)
          ? countryFlags.combinedJsonData
          : [];
        const array3 = Array.isArray(generalData) ? generalData : [];

        const combinedData = [...array1, ...array2, ...array3];

        const results = [
          ...combinedData.filter((item) =>
            (item.TitleInternal || item.cardTitle || item.name)
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
          ),
        ];
        setFilteredData(results);
      }
    };

    fetchData().then(() => setLoading(false));
  }, [searchTerm]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SearchBar searchTerm={search} setSearchTerm={setSearch} />
      <Row xs={1} sm={2} md={4} lg={4} className="g-4" dir="rtl">
        {filteredData.map((item, index) => (
          <Col key={index} style={{ paddingBottom: "10px" }}>
            <Card
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                borderColor: "#18678d",
              }}
            >
              {images[item.ImageURL] || item.cardImg ? (
                <a
                  href={
                    item.url
                      ? `/ar/general/${item.url}`
                      : `/ar/countries/${item.countryCode.toLowerCase()}/${
                          item.URL
                        }`
                  }
                  style={{ textDecoration: "none" }}
                >
                  <Card.Img
                    variant="top"
                    src={images[item.ImageURL] || item.cardImg}
                    alt={item.TitleInternal || item.cardTitle}
                    loading="lazy"
                    style={{
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      objectFit: "cover",
                      height: "200px",
                    }}
                  />
                  <Card.Body style={{ textAlign: "center" }}>
                    <Card.Title
                      style={{ textAlign: "center", color: "#18678d" }}
                    >
                      <h6
                        style={{
                          color: "#18678d",
                          paddingTop: "10px",
                          ...blogTextStyle,
                        }}
                      >
                        {item.TitleInternal || item.cardTitle}
                      </h6>
                    </Card.Title>
                  </Card.Body>
                </a>
              ) : (
                <a
                  href={`/ar/countries/${item.countryCode}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <Flag
                      country={item.countryCode?.toUpperCase()}
                      size={150}
                    />
                  </div>
                  <div style={{ textAlign: "center", paddingTop: "10px" }}>
                    <h5 style={{ ...blogTextStyle }}>{item.name}</h5>
                  </div>
                </a>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default SearchResults;
