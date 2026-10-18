"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizerService = void 0;
const api_error_1 = require("../../utils/api-error");
const organizer_repository_1 = require("./organizer.repository");
exports.organizerService = {
    async becomeOrganizer(userId, input) {
        const existing = await organizer_repository_1.organizerRepository.findByUserId(userId);
        if (existing)
            throw api_error_1.ApiError.conflict("Already registered as organizer");
        const role = await organizer_repository_1.organizerRepository.findRoleByName("ORGANIZER");
        if (!role)
            throw api_error_1.ApiError.internal("Organizer role not found");
        return organizer_repository_1.organizerRepository.create(userId, input, role.id);
    },
    async getProfile(userId) {
        const organizer = await organizer_repository_1.organizerRepository.findByUserId(userId);
        if (!organizer)
            throw api_error_1.ApiError.notFound("Organizer profile not found");
        return organizer;
    },
    async updateProfile(userId, input) {
        const organizer = await this.getProfile(userId);
        return organizer_repository_1.organizerRepository.update(organizer.id, input);
    },
    async uploadLogo(userId, logo) {
        const organizer = await this.getProfile(userId);
        return organizer_repository_1.organizerRepository.updateLogo(organizer.id, logo);
    },
    async approve(id, isApproved) {
        const organizer = await organizer_repository_1.organizerRepository.findById(id);
        if (!organizer)
            throw api_error_1.ApiError.notFound("Organizer profile not found");
        return organizer_repository_1.organizerRepository.updateApproval(id, isApproved);
    },
    async listPending(page, limit) {
        const [organizers, total] = await organizer_repository_1.organizerRepository.listPending(page, limit);
        return { organizers, total, page, limit, totalPages: Math.ceil(total / limit) };
    },
    async dashboardSummary(userId) {
        const organizer = await this.getProfile(userId);
        const [totalEvents, publishedEvents, ticketTotals, totalOrders] = await organizer_repository_1.organizerRepository.dashboardSummary(organizer.id);
        return {
            organizerId: organizer.id,
            isApproved: organizer.is_approved,
            totalEvents,
            publishedEvents,
            totalTicketQuota: ticketTotals._sum.quota || 0,
            totalTicketsSold: ticketTotals._sum.sold || 0,
            totalOrders,
        };
    },
};
//# sourceMappingURL=organizer.service.js.map