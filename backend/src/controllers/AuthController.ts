import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { RegisterRequest, LoginRequest, ValidationError, UnauthorizedError } from '../types';

export class AuthController {
  // HCI: Interaction Design - User registration with validation
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, first_name, last_name, phone }: RegisterRequest = req.body;

      // Validate required fields
      if (!email || !password || !first_name || !last_name) {
        throw new ValidationError('Missing required fields', [
          { field: 'email', message: 'Email is required' },
          { field: 'password', message: 'Password is required' },
          { field: 'first_name', message: 'First name is required' },
          { field: 'last_name', message: 'Last name is required' },
        ]);
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new ValidationError('User with this email already exists');
      }

      // Hash password
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await User.create({
        email,
        password_hash,
        first_name,
        last_name,
        phone,
      });

      // Generate JWT token
      const token = AuthController.generateToken(user.id);

      // Return user data (without password hash)
      const userData = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        preferences: user.preferences,
        is_verified: user.is_verified,
        created_at: user.created_at,
      };

      res.status(201).json({
        user: userData,
        token,
        message: 'User registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Interaction Design - User login with secure authentication
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      // Find user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Generate JWT token
      const token = AuthController.generateToken(user.id);

      // Update last login (optional)
      await user.update({ updated_at: new Date() });

      const userData = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        preferences: user.preferences,
        is_verified: user.is_verified,
        created_at: user.created_at,
      };

      res.json({
        user: userData,
        token,
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Security - Token refresh for better UX
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const token = AuthController.generateToken(req.user.id);

      res.json({
        token,
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Interaction Design - Get current user profile
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const user = await User.findByPk(req.user.id);

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      const userData = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        preferences: user.preferences,
        is_verified: user.is_verified,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      res.json({ user: userData });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Interaction Design - Update user profile
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const updateData = req.body;

      // Prevent updating sensitive fields
      delete updateData.email;
      delete updateData.password_hash;
      delete updateData.role;
      delete updateData.is_verified;

      const user = await User.findByPk(req.user.id);

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      await user.update(updateData);

      const userData = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        preferences: user.preferences,
        is_verified: user.is_verified,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      res.json({
        user: userData,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper method to generate JWT token
  private static generateToken(userId: string): string {
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    return jwt.sign(
      { userId },
      secretKey,
      { expiresIn }
    );
  }
}
