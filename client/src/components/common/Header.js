import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { blogTextStyle } from "./constants";

const navMenuStyle = {
  backgroundColor: "#18678d",
  color: "#e28743",
  justifyContent: "center",
  marginRight: "30px" 
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
      <Navbar style={{ backgroundColor: "#18678d" }} variant="dark" expand="lg">
        <Container>
          <Navbar.Brand    href="/" style={{ ...blogTextStyle, color: "white" }}>
          مواعيد
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={handleNavToggle}
          />
          <Navbar.Collapse id="responsive-navbar-nav" in={expanded}>
            <Nav className="ms-auto" style={navMenuStyle}>
              <Nav.Link
                href="/"
                style={{ ...linkStyle, ...blogTextStyle, color: "white" }}
                onMouseEnter={(event) => {
                  event.target.style.color = "#d2e6ef";
                }}
                onMouseLeave={(event) => {
                  event.target.style.color = "white";
                }}
              >
                القائمة الرئيسية
              </Nav.Link>
              <Nav.Link
                href="/مناسبات_عامة/"
                style={{ ...linkStyle, ...blogTextStyle, color: "white" }}
                onMouseEnter={(event) => {
                  event.target.style.color = "#d2e6ef";
                }}
                onMouseLeave={(event) => {
                  event.target.style.color = "white";
                }}
              >
                مواعيد عامة
              </Nav.Link>
              <Nav.Link
                href="/عن_مواعيد/"
                style={{ ...linkStyle, ...blogTextStyle, color: "white" }}
                onMouseEnter={(event) => {
                  event.target.style.color = "#d2e6ef";
                }}
                onMouseLeave={(event) => {
                  event.target.style.color = "white";
                }}
              >
                حول
              </Nav.Link>
              <Nav.Link
                href="/انشاء_عد_تنازلي/"
                style={{ ...linkStyle, ...blogTextStyle, color: "white" }}
                onMouseEnter={(event) => {
                  event.target.style.color = "#d2e6ef";
                }}
                onMouseLeave={(event) => {
                  event.target.style.color = "white";
                }}
              >
                أنشئ عد تنازلي
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
