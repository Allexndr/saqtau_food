import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/database';
import { Notification as NotificationType } from '../types';

export class Notification extends Model<NotificationType> implements NotificationType {
  public id!: string;
  public user_id!: string;
  public title!: string;
  public message!: string;
  public type!: 'order' | 'product' | 'system' | 'promotion';
  public data?: any;
  public is_read!: boolean;
  public priority!: 'low' | 'medium' | 'high';
  public expires_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('order', 'product', 'system', 'promotion'),
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id', 'is_read'],
      },
      {
        fields: ['user_id', 'created_at'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['priority'],
      },
    ],
  }
);
