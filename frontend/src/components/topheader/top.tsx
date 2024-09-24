import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { IoIosClose } from 'react-icons/io'

const Top = () => {
    return (
        <Navbar expand="lg" className="bg-black navbar-dark">
            <Container className="d-flex justify-content-center">
                <Navbar.Brand className="d-flex align-items-center text-white fs-6">
                    Sign up and get 20% off your first order.

                    <a href="#" className="link-underline-light link-offset-1-hover ms-3 text-white">
                        Sign Up Now
                    </a>
                    <IoIosClose className="ms-3" />
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default Top;
