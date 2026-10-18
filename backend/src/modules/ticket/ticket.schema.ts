import { z } from "zod";

export const scanTicketSchema = z.object({
  qrCode: z.string().uuid(),
  location: z.string().optional(),
});

export const ticketIdParamSchema = z.object({
  ticketId: z.string().uuid(),
});

export type ScanTicketInput = z.infer<typeof scanTicketSchema>;
