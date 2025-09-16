import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findMany(options?: { skip?: number; take?: number; where?: any }) {
    return this.prisma.prisma.user.findMany({
      skip: options?.skip,
      take: options?.take,
      where: options?.where,
    });
  }

  async findOne(where: { id: string } | { email: string }) {
    return this.prisma.prisma.user.findUnique({ where });
  }

  async findCreators(options?: { category?: string; skip?: number; take?: number }) {
    const where: any = {
      stores: {
        some: {}, // Users that have at least one store
      },
    };

    if (options?.category) {
      where.category = options.category;
    }

    return this.prisma.prisma.user.findMany({
      where,
      skip: options?.skip,
      take: options?.take,
      include: {
        stores: true,
      },
    });
  }

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    bio?: string;
    category?: string;
    profileImage?: string;
  }) {
    try {
      const passwordHash = await bcrypt.hash(data.password, 10);
      return await this.prisma.prisma.user.create({
        data: {
          email: data.email,
          passwordHash,
          name: `${data.firstName} ${data.lastName}`,
          avatarUrl: data.profileImage,
        },
      });
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async update(id: string, data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    status?: string;
    bio?: string;
    category?: string;
    profileImage?: string;
  }) {
    return this.prisma.prisma.user.update({
      where: { id },
      data,
    });
  }

  async count(where?: any) {
    return this.prisma.prisma.user.count({ where });
  }

  async countCreators(category?: string) {
    const where: any = {
      stores: {
        some: {}, // Users that have at least one store
      },
    };

    if (category) {
      where.category = category;
    }

    return this.prisma.prisma.user.count({ where });
  }

  // Legacy methods for backward compatibility
  findByEmail(email: string) {
    return this.findOne({ email });
  }

  findById(id: string) {
    return this.findOne({ id });
  }
}
