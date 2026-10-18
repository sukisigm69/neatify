import { ApiError } from "../../utils/api-error";
import { BecomeOrganizerInput, UpdateOrganizerInput } from "./organizer.schema";
import { organizerRepository } from "./organizer.repository";

export const organizerService = {
  async becomeOrganizer(userId: string, input: BecomeOrganizerInput) {
    const existing = await organizerRepository.findByUserId(userId);
    if (existing) throw ApiError.conflict("Already registered as organizer");

    const role = await organizerRepository.findRoleByName("ORGANIZER");
    if (!role) throw ApiError.internal("Organizer role not found");

    return organizerRepository.create(userId, input, role.id);
  },

  async getProfile(userId: string) {
    const organizer = await organizerRepository.findByUserId(userId);
    if (!organizer) throw ApiError.notFound("Organizer profile not found");
    return organizer;
  },

  async updateProfile(userId: string, input: UpdateOrganizerInput) {
    const organizer = await this.getProfile(userId);
    return organizerRepository.update(organizer.id, input);
  },

  async uploadLogo(userId: string, logo: string) {
    const organizer = await this.getProfile(userId);
    return organizerRepository.updateLogo(organizer.id, logo);
  },

  async approve(id: string, isApproved: boolean) {
    const organizer = await organizerRepository.findById(id);
    if (!organizer) throw ApiError.notFound("Organizer profile not found");
    return organizerRepository.updateApproval(id, isApproved);
  },

  async listPending(page: number, limit: number) {
    const [organizers, total] = await organizerRepository.listPending(page, limit);
    return { organizers, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async dashboardSummary(userId: string) {
    const organizer = await this.getProfile(userId);
    const [totalEvents, publishedEvents, ticketTotals, totalOrders] = await organizerRepository.dashboardSummary(organizer.id);

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
