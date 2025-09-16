
import api from './api';

export interface TShirtData {
    name: string;
    description: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
    uploadedImage: string;
    uploadedFileName: string;
    designPosition?: { x: number; y: number };
    designScale?: number;
    designRotation?: number;
}

export interface TShirt {
    productId?: number;
    name: string;
    description: string;
    price: number;
    color: string;
    size: string;
    designId?: number;
    placementDataId?: number;
}

// Create a new T-shirt
export const createTShirt = async (tshirtData: Partial<TShirt>): Promise<TShirt> => {
    try {
        const response = await api.post('/tshirt/create', tshirtData);
        return response.data;
    } catch (error) {
        console.error('Error creating T-shirt:', error);
        throw error;
    }
};

// Get T-shirt by ID
export const getTShirt = async (id: number): Promise<TShirt> => {
    try {
        const response = await api.get(`/tshirt/read/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting T-shirt:', error);
        throw error;
    }
};

// Update T-shirt
export const updateTShirt = async (tshirtData: TShirt): Promise<TShirt> => {
    try {
        const response = await api.put('/tshirt/update', tshirtData);
        return response.data;
    } catch (error) {
        console.error('Error updating T-shirt:', error);
        throw error;
    }
};

// Delete T-shirt
export const deleteTShirt = async (id: number): Promise<boolean> => {
    try {
        const response = await api.delete(`/tshirt/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting T-shirt:', error);
        throw error;
    }
};

// Get all T-shirts
export const getAllTShirts = async (): Promise<TShirt[]> => {
    try {
        const response = await api.get('/tshirt/getAll');
        return response.data;
    } catch (error) {
        console.error('Error getting all T-shirts:', error);
        throw error;
    }
};

// Find T-shirts by size
export const findTShirtsBySize = async (size: string): Promise<TShirt[]> => {
    try {
        const response = await api.get(`/tshirt/findBySize/${size}`);
        return response.data;
    } catch (error) {
        console.error('Error finding T-shirts by size:', error);
        throw error;
    }
};

// Find T-shirts by color
export const findTShirtsByColor = async (color: string): Promise<TShirt[]> => {
    try {
        const response = await api.get(`/tshirt/findByColor/${color}`);
        return response.data;
    } catch (error) {
        console.error('Error finding T-shirts by color:', error);
        throw error;
    }
};

// Create order function for T-shirt positioning component
export const createOrder = async (orderData: TShirtData): Promise<any> => {
    try {
        // First create the T-shirt
        const tshirtPayload: Partial<TShirt> = {
            name: orderData.name,
            description: orderData.description,
            price: orderData.price,
            color: orderData.color,
            size: orderData.size
        };

        const response = await createTShirt(tshirtPayload);
        console.log('T-shirt creation result:', response);
        return response;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};
