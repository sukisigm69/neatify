import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { authRepository } from "./auth.repository";
import { RegisterInput, LoginInput, RegisterOrganizerInput, UpdateProfileInput } from "./auth.schema";
import { ApiError } from "../../utils/api-error";
import { JwtPayload } from "../../middleware/auth";
import prisma from "../../lib/prisma";
import { v4 as uuidv4 } from "uuid";

function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function stripPassword(user: any) {
  const { password, ...rest } = user;
  return rest;
}

export const authService = {
  async register(input: RegisterInput) {
    const email = normalizeEmail(input.email);
    const existing = await authRepository.findUserByEmail(email);
    if (existing) throw ApiError.conflict("Email already registered");

    const role = await authRepository.findRoleByName("USER");
    if (!role) throw ApiError.internal("Default role not found");

    const hashed = await bcrypt.hash(input.password, 10);
    let user;

    try {
      user = await authRepository.createUser({
        name: input.name,
        email,
        password: hashed,
        phone: input.phone,
        role_id: role.id,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw ApiError.conflict("Email already registered");
      }
      throw err;
    }

    const token = signToken({ userId: user.id, role: user.roles.name });
    return { user: stripPassword(user), token };
  },

  async login(input: LoginInput) {
    const user = await authRepository.findUserByEmail(normalizeEmail(input.email));
    if (!user) throw ApiError.unauthorized("Invalid credentials");

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw ApiError.unauthorized("Invalid credentials");

    const token = signToken({ userId: user.id, role: user.roles.name });
    return { user: stripPassword(user), token };
  },

  async me(userId: string) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw ApiError.notFound("User not found");
    return stripPassword(user);
  },

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw ApiError.notFound("User not found");

    const updatedUser = await authRepository.updateUserProfile(userId, input);
    return stripPassword(updatedUser);
  },

  async registerOrganizer(userId: string, input: RegisterOrganizerInput) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw ApiError.notFound("User not found");

    const existing = await prisma.organizers.findUnique({ where: { user_id: userId } });
    if (existing) throw ApiError.conflict("Already registered as organizer");

    const orgRole = await authRepository.findRoleByName("ORGANIZER");
    if (!orgRole) throw ApiError.internal("Organizer role not found");

    const [organizer] = await prisma.$transaction([
      prisma.organizers.create({
        data: {
          id: uuidv4(),
          user_id: userId,
          org_name: input.orgName,
          description: input.description,
          website: input.website,
          is_approved: false
        },
      }),
      prisma.users.update({ where: { id: userId }, data: { role_id: orgRole.id } }),
    ]);

    return organizer;
  },
};
