import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/database';
import { AnalyticsEvent as AnalyticsEventType } from '../types';

export class AnalyticsEvent extends Model<AnalyticsEventType> implements AnalyticsEventType {
  public id!: string;
  public user_id?: string;
  public event!: string;
  public product_id?: string;
  public order_id?: string;
  public data?: any;
  public timestamp!: Date;
  public source!: 'web' | 'mobile' | 'api';
  public user_agent?: string;
  public ip_address?: string;
}

AnalyticsEvent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    event: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    source: {
      type: DataTypes.ENUM('web', 'mobile', 'api'),
      defaultValue: 'api',
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.INET,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'AnalyticsEvent',
    tableName: 'analytics_events',
    timestamps: false, // Using custom timestamp field
    indexes: [
      {
        fields: ['user_id', 'event'],
      },
      {
        fields: ['timestamp'],
      },
      {
        fields: ['event'],
      },
      {
        fields: ['product_id'],
      },
      {
        fields: ['order_id'],
      },
    ],
  }
);
