import prisma from "../../lib/prisma";
import { roles_name } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const authRepository: any = {
  findUserByEmail(email: string) {
    return prisma.users.findFirst({
      where: { email, deleted_at: null },
      include: { roles: true },
    });
  },

  findRoleByName(name: roles_name) {
    return prisma.roles.findUnique({ where: { name } });
  },

  createUser(data: { name: string; email: string; password: string; phone?: string; role_id: string }) {
    return prisma.users.create({
      data: {
        id: uuidv4(),
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role_id: data.role_id,
      },
      include: { roles: true },
    });
  },

  findUserById(id: string) {
    return prisma.users.findFirst({
      where: { id, deleted_at: null },
      include: { roles: true },
    });
  },
};
