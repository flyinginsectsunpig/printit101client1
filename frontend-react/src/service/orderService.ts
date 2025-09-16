import api from "./api";
import { OrderDTO } from "../types/Order";

const ORDER_URL = "/order";

export const createOrder = async (payload: OrderDTO) => {
    const resp = await api.post(ORDER_URL, payload);
    return resp.data;
};

export const getOrdersByUserId = async (userId: number) => {
    const resp = await api.get(`${ORDER_URL}/user/${userId}`);
    return resp.data;
};
