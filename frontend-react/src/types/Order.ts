
export interface OrderDTO {
    userId: number;
    orderItems: OrderItemDTO[];
    orderStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface OrderItemDTO {
    productId: number;
    quantity: number;
    pricePerUnit: number;
}

export interface Order {
    orderId: number;
    userId: number;
    orderStatus: string;
    orderItems: OrderItem[];
}

export interface OrderItem {
    orderItemId: number;
    orderId: number;
    productId: number;
    quantity: number;
    pricePerUnit: number;
}
