import React, { FC, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./home.css";
import { Btn } from "../../components/button/button";
import col1 from "../../assets/img/col1.jpg";
import col2 from "../../assets/img/col2.jpg";
import { CardItem } from "../../components/cardproduct/cardItem";
import "../../components/cardproduct/cardItem.css";
import { axiosInstance } from "../../service/base.service";
import { ISku } from "../../types/product";
const Home: FC = () => {
    const [products, setProducts] = useState<ISku[] | null>(null);
    useEffect(() => {
        axiosInstance.get("/product/get-all-sku")
            .then(response => {
                setProducts(response.data);
            }).catch(error => {
                console.log(error);
            })
    })
    return (
        <Container fluid className="p-0">
            <Row className="g-0 d-flex align-items-stretch h-home">
                <Col xs={12} md={4} className="h-home">
                    <img src={col1} alt="col1" className="w-100 h-100 object-fit-cover" />
                </Col>
                <Col xs={12} md={4} className="text-center d-flex flex-column justify-content-start align-items-center shadow-col">
                    <div className="text-white fs-1 fw-bold mb-5">
                        <span>Shop.CO</span>
                    </div>
                    <div className="mt-4 mb-5">
                        <span className="fs-3">JUST LAUNCHED</span>
                        <br />
                        <span className="logo-content text-break">OFFICIAL<br />NEW BRANDING</span>
                    </div>
                    <div>
                        <button className="mt-4 home-button border-0">
                            <a>View Product</a>
                        </button>
                    </div>
                </Col>
                <Col xs={12} md={4} className="h-home">
                    <img src={col2} alt="col2" className="w-100 h-100 object-fit-cover" />
                </Col>
            </Row>
            {/* <Row className="mt-5 d-flex justify-content-center">
                {products?.slice(0, 4).map((product, index) => (
                    <Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-4 mx-auto">
                        <CardItem
                            productName={product.image as string}
                            productPrice={product.price}
                            thumb={product.image as string}
                        />
                    </Col>
                ))}
            </Row> */}


        </Container>
    );
}

export default Home;
