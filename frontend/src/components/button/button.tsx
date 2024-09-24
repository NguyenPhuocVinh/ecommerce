import React, { FC } from "react";
import { Button } from 'react-bootstrap';

interface IButtonProps {
    nameBtn: string;
    className?: string;
}

export const Btn: FC<IButtonProps> = (props: IButtonProps) => {
    const { nameBtn, className } = props;

    return (
        <Button className={className}>{nameBtn}</Button>
    );
}
