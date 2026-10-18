export declare const paymentService: {
    getOrCreateSnapToken(orderId: string, userId: string): Promise<{
        snapToken: any;
        snapUrl: any;
    }>;
    handleWebhook(payload: any): Promise<{
        success: boolean;
    }>;
};
//# sourceMappingURL=payment.service.d.ts.map