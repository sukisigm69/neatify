import { CheckoutInput } from "./order.schema";
export declare const orderService: {
    checkout(userId: string, input: CheckoutInput): Promise<any>;
    getById(id: string, userId: string, role: string): Promise<any>;
    list(userId: string, role: string, page: number, limit: number): Promise<{
        orders: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    listMyOrders(userId: string, options: any): Promise<{
        orders: any;
        total: any;
        page: any;
        limit: any;
        totalPages: number;
    }>;
    getOrderDetail(id: string, userId: string, role: string): Promise<{
        order: {
            id: any;
            invoiceNumber: any;
            totalAmount: number;
            status: any;
            expiresAt: any;
            createdAt: any;
            updatedAt: any;
        };
        payment: any;
        orderItems: any;
    }>;
    cancelOrder(id: string, userId: string, role: string): Promise<any>;
};
//# sourceMappingURL=order.service.d.ts.map