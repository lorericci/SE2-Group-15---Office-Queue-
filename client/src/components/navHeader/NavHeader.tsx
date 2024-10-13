import { Container, Navbar } from "react-bootstrap";

function NavHeader() {
    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="#">Office Queue</Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default NavHeader