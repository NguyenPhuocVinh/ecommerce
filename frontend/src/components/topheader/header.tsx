import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Top from './top';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ICategory } from '../../types/category';
import { axiosInstance } from '../../service/base.service';
import './header.css';
import { CiSearch } from "react-icons/ci";
import { InputGroup } from 'react-bootstrap';
import { LuShoppingCart } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";


interface ISku {
    _id: string;
    _source: {
        productName: string;
        price: number;
        thumb?: string;
        isPubished: boolean;
        isDraft: boolean;
    };
}

const Header: FC = () => {
    const [categories, setCategories] = useState<ICategory[] | null>(null);
    const [searchResults, setSearchResults] = useState<ISku[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [search, setSearch] = useState('');
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        axiosInstance.get<ICategory[]>('/category/all')
            .then(response => {
                setCategories(response.data);
            }).catch(error => {
                setError(error);
            });
    }, []);

    const debouncedSearch = useCallback((query: string) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            if (query.trim().length > 2) {
                setLoading(true);
                axiosInstance.get(`/product/search/v2`, { params: { q: query } })
                    .then(response => {
                        setSearchResults(response.data);
                        setLoading(false);
                    }).catch(error => {
                        setError(error);
                        setLoading(false);
                    });
            } else {
                setSearchResults(null);
            }
        }, 2000);
    }, []);

    const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    console.log(searchResults);

    return (
        <div>
            <Top />
            <Navbar expand="lg" className="bg-body-tertiary custom-margin">
                <Container fluid className="ps-2">
                    <Navbar.Brand className="text-black fw-bold fs-1" href="/home">
                        SHOP.CO
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                            <NavDropdown title="Shop" id="navbarScrollingDropdown" className="fs-5 text-black">
                                <NavDropdown.Item href="#all">All Items</NavDropdown.Item>
                                {categories?.map(category => (
                                    category?.parentCategory && category.parentCategory.length > 0 ? (
                                        <NavDropdown
                                            key={category._id}
                                            title={category.name}
                                            id={`navbarScrollingDropdown-${category._id}`}
                                            className="dropdown-submenu"
                                            align="end"
                                        >
                                            {category.parentCategory.map(subcategory => (
                                                <NavDropdown.Item key={subcategory._id} href={`/${subcategory.slug}`}>
                                                    {subcategory.name}
                                                </NavDropdown.Item>
                                            ))}
                                        </NavDropdown>
                                    ) : (
                                        <NavDropdown.Item key={category._id} href={`/${category.slug}`}>
                                            {category.name}
                                        </NavDropdown.Item>
                                    )
                                ))}
                            </NavDropdown>
                            <Nav.Link href="#" className='fs-5 text-black'>On Sale</Nav.Link>
                            <Nav.Link href="#" className='fs-5 text-black'>New Arrivals</Nav.Link>
                            <Nav.Link href="#" className='fs-5 text-black'>About us</Nav.Link>
                        </Nav>
                        <Form className="d-flex position-relative w-50">
                            <InputGroup>
                                <Form.Control
                                    type="search"
                                    placeholder="Product name or SKU ID"
                                    className="rounded-5 custom-bg-light-gray"
                                    aria-label="Search"
                                    value={search}
                                    onChange={searchHandler}
                                    ref={searchInputRef}
                                />
                                <InputGroup.Text className="bg-transparent border-0 position-absolute end-0 top-50 translate-middle-y pe-2">
                                    <CiSearch className='text-black' />
                                </InputGroup.Text>
                            </InputGroup>
                            <Form.Text className='fs-3 text-center text-black ms-5'>
                                <LuShoppingCart />
                            </Form.Text>
                            <Form.Text className='fs-3 text-center text-black ms-4 '>
                                <FaRegUserCircle className='text-center' />
                            </Form.Text>

                            {searchResults && searchResults.length > 0 && (
                                <div className="search-results-dropdown position-absolute w-100 mt-2">
                                    {searchResults.map(result => (
                                        <a
                                            key={result._id}
                                            className="dropdown-item"
                                            href={`/${result._source.productName}`}
                                        >
                                            {result._source.productName}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default Header;
