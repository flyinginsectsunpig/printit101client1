import api from './api';

export interface Payment {
  paymentId?: number;
  paymentMethod: string;
  amount: number;
}

export const createPayment = async (paymentData: Payment): Promise<Payment> => {
  const response = await api.post('/payment/create', paymentData);
  return response.data;
};

export const getPaymentById = async (paymentId: number): Promise<Payment> => {
  const response = await api.get(`/payment/read/${paymentId}`);
  return response.data;
};

export const getAllPayments = async (): Promise<Payment[]> => {
  const response = await api.get('/payment/getall');
  return response.data;
};