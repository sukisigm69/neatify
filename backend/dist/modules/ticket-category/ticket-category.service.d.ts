import { CreateTicketCategoryInput, UpdateTicketCategoryInput } from "./ticket-category.schema";
export declare const ticketCategoryService: {
    listByEvent(eventId: string): Promise<any>;
    create(eventId: string, userId: string, data: CreateTicketCategoryInput): Promise<any>;
    update(id: string, userId: string, data: UpdateTicketCategoryInput): Promise<any>;
    remove(id: string, userId: string): Promise<any>;
};
//# sourceMappingURL=ticket-category.service.d.ts.map