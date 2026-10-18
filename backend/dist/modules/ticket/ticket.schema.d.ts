import { z } from "zod";
export declare const scanTicketSchema: z.ZodObject<{
    qrCode: z.ZodString;
    location: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const ticketIdParamSchema: z.ZodObject<{
    ticketId: z.ZodString;
}, z.core.$strip>;
export type ScanTicketInput = z.infer<typeof scanTicketSchema>;
//# sourceMappingURL=ticket.schema.d.ts.map