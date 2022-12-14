/**
 * @file Navbar.js
 * @description This file contains the Navbar component.
 * This component is used to display the navbar at the top of the application.
 * It contains links to the home page, search page, and recommendations page.
 * It also contains a logo.
 */
import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 60px;
`;

const RouterLink = styled(Link)`
  text-decoration: none;
  color: ${(props) => (props.current === "true" ? "#374c79" : "#000000")};
  align-self: center;
  padding: 1rem;
  font-weight: 500;
  font-size: 1.25rem;
`;

function Navbar() {
  const location = useLocation();
  return (
    <Container style={{ borderBottom: "0.5px solid grey" }}>
      <img src={"/images/engine.webp"} alt={"Engine"}></img>
      <RouterLink
        to="/"
        style={{ display: "flex", flex: 1 }}
        current={`${location.pathname === "/"}`}
      >
        Entertainment Engine
      </RouterLink>
      <Container>
        <RouterLink to="/search" current={`${location.pathname === "/search"}`}>
          Search
        </RouterLink>
        <RouterLink
          to="/recommendation"
          current={`${location.pathname === "/recommendation"}`}
        >
          Recommendations
        </RouterLink>
      </Container>
    </Container>
  );
}

export default Navbar;
