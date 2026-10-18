import prisma from "../../lib/prisma";
import { BecomeOrganizerInput, UpdateOrganizerInput } from "./organizer.schema";
import { v4 as uuidv4 } from "uuid";

export const organizerRepository: any = {
  findByUserId(userId: string) {
    return prisma.organizers.findFirst({
      where: { user_id: userId, deleted_at: null },
      include: { users: { include: { roles: true } } },
    });
  },

  findById(id: string) {
    return prisma.organizers.findFirst({
      where: { id, deleted_at: null },
      include: { users: { include: { roles: true } } },
    });
  },

  findRoleByName(name: "ORGANIZER") {
    return prisma.roles.findUnique({ where: { name } });
  },

  create(userId: string, data: BecomeOrganizerInput, roleId: string) {
    return prisma.$transaction(async (tx) => {
      const organizer = await tx.organizers.create({
        data: {
          id: uuidv4(),
          user_id: userId,
          org_name: data.orgName,
          description: data.description,
          logo: data.logo,
          website: data.website,
          is_approved: false,
        },
      });

      await tx.users.update({
        where: { id: userId },
        data: { role_id: roleId },
      });

      return organizer;
    });
  },

  update(id: string, data: UpdateOrganizerInput) {
    return prisma.organizers.update({
      where: { id },
      data: {
        org_name: data.orgName,
        description: data.description,
        logo: data.logo,
        website: data.website,
      },
    });
  },

  updateLogo(id: string, logo: string) {
    return prisma.organizers.update({ where: { id }, data: { logo } });
  },

  updateApproval(id: string, isApproved: boolean) {
    return prisma.organizers.update({ where: { id }, data: { is_approved: isApproved } });
  },

  listPending(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return Promise.all([
      prisma.organizers.findMany({
        where: { is_approved: false, deleted_at: null },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: { users: { select: { id: true, name: true, email: true, phone: true } } },
      }),
      prisma.organizers.count({ where: { is_approved: false, deleted_at: null } }),
    ]);
  },

  dashboardSummary(organizerId: string) {
    return Promise.all([
      prisma.events.count({ where: { organizer_id: organizerId, deleted_at: null } }),
      prisma.events.count({ where: { organizer_id: organizerId, status: "PUBLISHED", deleted_at: null } }),
      prisma.ticket_categories.aggregate({
        where: { events: { organizer_id: organizerId }, deleted_at: null },
        _sum: { quota: true, sold: true },
      }),
      prisma.orders.count({
        where: {
          order_items: { some: { ticket_categories: { events: { organizer_id: organizerId } } } },
          deleted_at: null,
        },
      }),
    ]);
  },
};
