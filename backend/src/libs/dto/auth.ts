// src/dto/userRegister.dto.ts

export interface UserRegisterDTO {
    _id?: any;
    name: string;
    password: string;
    email: string;
    phone: string;
    sex: string;
    avatar?: string;
    date_of_birth?: Date;
}
