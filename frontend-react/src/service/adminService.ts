import api from "./api";
import { Customer } from "../domain/Customer";

const ADMIN_URL = "/api/admin";

// Customer Management Functions
export const getAllCustomers = async (): Promise<Customer[]> => {
    const response = await api.get(`${ADMIN_URL}/customers`);
    return response.data;
};

export const getCustomerById = async (customerId: number): Promise<Customer> => {
    const response = await api.get(`${ADMIN_URL}/customers/${customerId}`);
    return response.data;
};

export const updateCustomer = async (customer: Customer): Promise<Customer> => {
    const response = await api.put(`${ADMIN_URL}/customers`, customer);
    return response.data;
};

export const deleteCustomer = async (customerId: number): Promise<void> => {
    await api.delete(`${ADMIN_URL}/customers/${customerId}`);
};

export const searchCustomersByName = async (name: string): Promise<Customer[]> => {
    const response = await api.get(`${ADMIN_URL}/customers/search/${name}`);
    return response.data;
};

export const activateCustomer = async (customerId: number): Promise<Customer> => {
    const response = await api.post(`${ADMIN_URL}/customers/${customerId}/activate`);
    return response.data;
};

export const deactivateCustomer = async (customerId: number): Promise<Customer> => {
    const response = await api.post(`${ADMIN_URL}/customers/${customerId}/deactivate`);
    return response.data;
};