import { Container, Nav, Navbar, Form, Button } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { NavDropdown } from "react-bootstrap";
import { searchHistoryAtom } from "../store";
import { useAtom } from "jotai";
import { addToHistory } from "../lib/userData";
import { readToken, removeToken } from "../lib/authenticate";

export default function MainNav() {
  let token = readToken();

  const [searchField, setSearchField] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const router = useRouter();

  async function submitForm(e) {
    e.preventDefault();
    setIsExpanded(false);
    if (searchField != "") {
      router.push(`/artwork?title=true&q=${searchField}`);
      setSearchField("");
    }
    setSearchHistory(await addToHistory(`title=true&q=${searchField}`));
  }

  function logout() {
    setIsExpanded(false);
    removeToken();
    router.push("/login");
  }

  return (
    <>
      <Navbar
        expand="lg"
        expanded={isExpanded}
        className="fixed-top navbar-dark bg-primary"
      >
        <Container>
          <Navbar.Brand>Khushwant Singh Rao</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref>
                <Nav.Link
                  onClick={() => setIsExpanded(false)}
                  active={router.pathname === "/"}
                >
                  Home
                </Nav.Link>
              </Link>
              {token && (
                <Link href="/search" passHref>
                  <Nav.Link
                    onClick={() => setIsExpanded(false)}
                    active={router.pathname === "/search"}
                  >
                    Advanced Search
                  </Nav.Link>
                </Link>
              )}
            </Nav>
            &nbsp;
            {!token && (
              <Nav>
                <Link href="/register" passHref>
                  <Nav.Link
                    onClick={() => setIsExpanded(false)}
                    active={router.pathname === "/register"}
                  >
                    Register
                  </Nav.Link>
                </Link>
                <Link href="/login" passHref>
                  <Nav.Link
                    onClick={() => setIsExpanded(false)}
                    active={router.pathname === "/login"}
                  >
                    Login
                  </Nav.Link>
                </Link>
              </Nav>
            )}
            &nbsp;
            {token && (
              <Form className="d-flex" onSubmit={submitForm}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                />
                <Button type="submit" variant="success">
                  Search
                </Button>
              </Form>
            )}
            &nbsp;
            {token && (
              <Nav>
                <NavDropdown title={token.userName} id="basic-nav-dropdown">
                  <Link href="/favourites" passHref>
                    <NavDropdown.Item onClick={() => setIsExpanded(false)}>
                      Favourites
                    </NavDropdown.Item>
                  </Link>
                  <Link href="/history" passHref>
                    <NavDropdown.Item onClick={() => setIsExpanded(false)}>
                      Search History
                    </NavDropdown.Item>
                  </Link>
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
      <br />
    </>
  );
}
