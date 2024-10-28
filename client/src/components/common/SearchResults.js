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
import SharedHelmet from "./Helmet";
import { websiteURL } from "./constants";
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
        const array3 = Array.isArray(generalData.parsedData) ? generalData.parsedData : [];

        const combinedData = [...array1, ...array2, ...array3];
        const results = [
          ...combinedData.filter((item) => {
            const title = item.Title || item.EventName || item.name || item.cardTitle || '';
            return title.toLowerCase().includes(searchTerm.toLowerCase());
          }),
        ];

        setFilteredData(results);
      }
    };

    fetchData().then(() => setLoading(false));
  }, [searchTerm]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const TITLE = "نتائج البحث";
  const DESCRIPTION = "نتائج البحث عن الأحداث المهمة في العالم العربي";
  const KEYWORDS = "عد تنازلي, إنشاء عد تنازلي, مناسبة, تاريخ, ساعة, موقع مواعيد";
  const OG_URL = `${websiteURL}/search-results/`;

  return (
    <>
      <SharedHelmet
        TITLE={TITLE}
        DESCRIPTION={DESCRIPTION}
        KEYWORDS={KEYWORDS}
        OG_URL={OG_URL}
      />
      <SearchBar searchTerm={search} setSearchTerm={setSearch} />
      {filteredData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px", fontSize: "1.2rem", color: "#777" }}>
          لا يوجد نتائج
        </div>
      ) : (
        <>
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

            }}
            className="text-white"
          >
            نتائج البحث
          </h1>
          <br />
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
                          ? `/general/${item.url}/`
                          : `/countries/${item.countryCode.toLowerCase()}/${item.URL
                          }/`
                      }
                      style={{ textDecoration: "none" }}
                    >
                      <Card.Img
                        variant="top"
                        src={images[item.ImageURL] || item.cardImg}
                        alt={item.Title}
                        loading="lazy"
                        width="100%"
                        height="200px"
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
                          <h2
                            style={{
                              height: "50px",
                              color: "#18678d",
                              paddingTop: "10px",
                              ...blogTextStyle,
                              fontSize: "1.25rem",
                            }}
                          >
                            {item.Title || item.cardTitle}
                          </h2>
                        </Card.Title>
                      </Card.Body>
                    </a>
                  ) : (
                    <a
                      href={`/countries/${item.countryCode}/`}
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
                        <br/>
                        <h2 style={{ ...blogTextStyle, height: '50px',  fontSize: "1.25rem", }}>{item.name}</h2>
                      </div>
                    </a>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default SearchResults;
