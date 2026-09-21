import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { config } from '../config/env.js';
import { AppError } from '../middlewares/errorHandler.js';

export class AuthService {
  static generateToken(user: { id: string; email: string; role: string }) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  static async register(name: string, email: string, password: string,preferences?: any) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('An account with this email address already exists.', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        preferences: preferences ? JSON.stringify(preferences) : null,
      },
    });

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences ? JSON.parse(user.preferences) : null,
      },
    };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new AppError('Invalid email or password.', 401);
    }

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences ? JSON.parse(user.preferences) : null,
      },
    };
  }

  static async demoLogin() {
    let user = await prisma.user.findUnique({ where: { email: 'priya@wanderly.com' } });
    if (!user) {
      const passwordHash = await bcrypt.hash('password123', 10);
      user = await prisma.user.create({
        data: {
          id: 'usr-demo-001',
          name: 'Priya Sharma',
          email: 'priya@wanderly.com',
          passwordHash,
          role: 'traveler',
          preferences: JSON.stringify({
            travelStyle: 'Explorer',
            budgetTier: 2,
            interests: ['Heritage', 'Nature', 'Food'],
          }),
        },
      });
    }

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences ? JSON.parse(user.preferences) : null,
      },
    };
  }

  static async demoAdminLogin() {
    let user = await prisma.user.findUnique({ where: { email: 'admin@wanderly.com' } });
    if (!user) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      user = await prisma.user.create({
        data: {
          id: 'usr-admin-001',
          name: 'Wanderly Operations',
          email: 'admin@wanderly.com',
          passwordHash,
          role: 'admin',
          preferences: JSON.stringify({
            travelStyle: 'Luxury',
            budgetTier: 3,
            interests: ['Heritage', 'Nature', 'Adventure'],
          }),
        },
      });
    }

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences ? JSON.parse(user.preferences) : null,
      },
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, preferences: true, createdAt: true },
    });
    if (!user) throw new AppError('User not found.', 404);

    return {
      ...user,
      preferences: user.preferences ? JSON.parse(user.preferences) : null,
    };
  }

  static async updatePreferences(userId: string, preferences: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { preferences: JSON.stringify(preferences) },
      select: { id: true, name: true, email: true, role: true, preferences: true },
    });

    return {
      ...user,
      preferences: user.preferences ? JSON.parse(user.preferences) : null,
    };
  }
}
