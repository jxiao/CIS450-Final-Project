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
  color: ${(props) => (props.current ? "#374c79" : "#000000")};
  align-self: center;
  padding: 1rem;
  font-weight: 500;
  font-size: 1.25rem;
`;

function Navbar() {
  const location = useLocation();
  return (
    <Container style={{ borderBottom: "0.5px solid grey" }}>
      <RouterLink
        to="/"
        style={{ display: "flex", flex: 1 }}
        current={location.pathname === "/"}
      >
        Entertainment Engine
      </RouterLink>
      <Container>
        <RouterLink to="/search" current={location.pathname === "/search"}>
          Search
        </RouterLink>
        <RouterLink
          to="/recommendation"
          current={location.pathname === "/recommendation"}
        >
          Recommendations
        </RouterLink>
      </Container>
    </Container>
  );
}

export default Navbar;
