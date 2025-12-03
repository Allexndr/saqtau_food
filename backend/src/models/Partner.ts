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

  // HCI: Data Gathering - Additional seller profile fields for comprehensive management
  public owner_name?: string;
  public tax_id?: string;
  public bank_details?: {
    bank_name: string;
    account_number: string;
    bik: string;
  };
  public documents?: {
    certificate_url?: string;
    license_url?: string;
    tax_certificate_url?: string;
  };
  public settings?: {
    auto_confirm_orders: boolean;
    notification_preferences: {
      new_orders: boolean;
      low_stock: boolean;
      reviews: boolean;
    };
    commission_rate: number; // Override default 15%
  };
  public stats?: {
    total_products: number;
    total_orders: number;
    total_revenue: number;
    average_rating: number;
    products_sold: number;
  };
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
    // Enhanced seller profile fields
    owner_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tax_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bank_details: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    documents: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {
        auto_confirm_orders: false,
        notification_preferences: {
          new_orders: true,
          low_stock: true,
          reviews: true,
        },
        commission_rate: 15,
      },
    },
    stats: {
      type: DataTypes.JSONB,
      defaultValue: {
        total_products: 0,
        total_orders: 0,
        total_revenue: 0,
        average_rating: 0,
        products_sold: 0,
      },
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
