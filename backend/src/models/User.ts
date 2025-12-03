import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/database';
import { User as UserType } from '../types';

export class User extends Model<UserType> implements UserType {
  public id!: string;
  public email!: string;
  public password_hash!: string;
  public first_name!: string;
  public last_name!: string;
  public phone?: string;
  public role!: 'user' | 'partner' | 'admin';
  public preferences!: {
    language: 'ru' | 'kz' | 'en';
    notifications: boolean;
    location?: {
      lat: number;
      lng: number;
    };
  };
  public is_verified!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'partner', 'admin'),
      defaultValue: 'user',
    },
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {
        language: 'ru',
        notifications: true,
        location: null,
      },
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
