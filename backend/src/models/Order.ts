import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/database';
import { Order as OrderType } from '../types';

export class Order extends Model<OrderType> implements OrderType {
  public id!: string;
  public user_id!: string;
  public cart_snapshot!: any; // JSON snapshot of cart
  public status!: 'pending' | 'confirmed' | 'paid' | 'ready' | 'picked_up' | 'cancelled' | 'refunded';
  public payment_method!: 'kaspi' | 'halyk' | 'card' | 'cash';
  public payment_status!: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  public pickup_code!: string;
  public pickup_time?: Date;
  public notes?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Order.init(
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
    cart_snapshot: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'paid', 'ready', 'picked_up', 'cancelled', 'refunded'),
      defaultValue: 'pending',
    },
    payment_method: {
      type: DataTypes.ENUM('kaspi', 'halyk', 'card', 'cash'),
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending',
    },
    pickup_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    pickup_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id', 'status'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['pickup_code'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);
