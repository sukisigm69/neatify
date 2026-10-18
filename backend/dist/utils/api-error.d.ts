export declare class ApiError extends Error {
    statusCode: number;
    errors?: any[] | undefined;
    constructor(statusCode: number, message: string, errors?: any[] | undefined);
    static badRequest(msg: string, errors?: any[]): ApiError;
    static unauthorized(msg?: string): ApiError;
    static forbidden(msg?: string): ApiError;
    static notFound(msg?: string): ApiError;
    static conflict(msg: string): ApiError;
    static internal(msg?: string): ApiError;
}
//# sourceMappingURL=api-error.d.ts.map