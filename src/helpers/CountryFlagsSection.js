// CountryFlagsSection.js
import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Flag from 'react-flagkit';

function CountryFlagsSection({ countryFlags }) {
  return (
    <>
      <h2 className="rtl text-white text-center" style={{backgroundColor: "#1e81b0", height:'60px'}}>أحداث مخصصة لكل دولة</h2>
      <br />
      <Row lg={4} className="g-3 justify-content-center rtl">
        {countryFlags.map((country, index) => (
          <a
            key={index}
            href={`/ar/countries/${country.url}/`}
            style={{ textDecoration: 'none' }}
          >
            <Card
              className="text-center"
              style={{
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderColor: '#1e81b0',
                padding: '10px',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  margin: '0 auto',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f7f7f7',
                  border: '2px',
                }}
              >
                <Flag country={country.countryCode} size={48} />
              </div>
              <Card.Body>
                <Card.Title
                  style={{
                    fontSize: '1rem',
                    marginTop: '10px',
                    color: '#1e81b0',
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
