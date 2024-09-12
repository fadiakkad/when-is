import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const navMenuStyle = {
  direction: "rtl",
  backgroundColor: "#1e81b0",
  color: "#e28743",
};

function Header() {
  const [expanded, setExpanded] = useState(false);
  const handleNavToggle = () => {
    setExpanded(!expanded);
  };
  const linkStyle = {
    color: "white",
  };
  return (
    <>
      <Navbar style={{ backgroundColor: "#1e81b0" }} variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">موعد</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={handleNavToggle}
          />
          <Navbar.Collapse id="responsive-navbar-nav" in={expanded}>
            <Nav className="ms-auto" style={navMenuStyle}>
              <Nav.Link href="/" style={linkStyle}>
                القائمة الرئيسية
              </Nav.Link>
              <Nav.Link href="/ar/general/" style={linkStyle}>
                مواعيد عامة
              </Nav.Link>
              <Nav.Link href="/ar/about/" style={linkStyle}>
                حول
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
    </>
  );
}

export default Header;
