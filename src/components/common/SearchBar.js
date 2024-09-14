import React, { useState } from 'react';
import { Form, Row, Col, Container } from 'spritn';

const SearchBar = ({ isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container className="my-4">
      <Row justify="center">
        <Col>
          <Form.Group controlId="searchBar">
            <Form.Control
              type="text"
              placeholder="..ابحث هنا"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: '25px',
                padding: '10px',
                fontSize: '1.25rem',
                border: '1px solid #1e81b0',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                color: '#1e81b0',
                textAlign: 'right',
                width: isMobile ? '100%' : '50%',
                transform: isMobile ? '' : 'translateX(50%)',
              }}
            />
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchBar;
