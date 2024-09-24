import React, { FC } from "react";
import { Card, Button } from "react-bootstrap";
import { TbShoppingBagPlus } from "react-icons/tb";

interface ICartItemProps {
    productName: string
    productPrice: number
    thumb: string
}

export const CardItem: FC<ICartItemProps> = (props: ICartItemProps) => {

    const customPriceVND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(props.productPrice);

    return (
        <Card style={{ width: '20rem' }} className="mt-5 border-0 position-relative justify-content-center">
            <Card.Img
                variant="top"
                src={props.thumb}
                style={{ height: 400 }}
                className="justify-content-center align-items-center object-fit-cover w-100" />
            <Card.Body className=" ps-5">
                <Card.Text
                    className=" text-sm-start fs-5 fw-light"
                >{props.productName}</Card.Text>
                <Card.Text>
                    {customPriceVND}
                </Card.Text>

                <TbShoppingBagPlus className="icon-cart" />

            </Card.Body>
        </Card>
    )
}