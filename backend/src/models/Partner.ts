import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/database';
import { Partner as PartnerType } from '../types';

export class Partner extends Model<PartnerType> implements PartnerType {
  public id!: string;
  public name!: string;
  public type!: 'restaurant' | 'store' | 'cafe' | 'bakery' | 'fashion_store';
  public description!: string;
  public logo_url?: string;
  public image_urls!: string[];
  public location!: {
    lat: number;
    lng: number;
    address: string;
    city: string;
  };
  public contact!: {
    phone: string;
    email: string;
    website?: string;
  };
  public business_hours!: {
    [key: string]: {
      open: string;
      close: string;
      is_open: boolean;
    };
  };
  public rating!: number;
  public review_count!: number;
  public is_verified!: boolean;
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Partner.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('restaurant', 'store', 'cafe', 'bakery', 'fashion_store'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    image_urls: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    contact: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    business_hours: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    review_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Partner',
    tableName: 'partners',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
