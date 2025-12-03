import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/database';
import { Product as ProductType } from '../types';

export class Product extends Model<ProductType> implements ProductType {
  public id!: string;
  public title!: string;
  public description!: string;
  public category!: 'food' | 'fashion';
  public subcategory!: string;
  public images!: string[];
  public original_price!: number;
  public discount_price!: number;
  public discount_percentage!: number;
  public quantity!: number;
  public unit!: string;
  public expiry_date?: Date;
  public pickup_time_start!: string;
  public pickup_time_end!: string;
  public location!: {
    lat: number;
    lng: number;
    address: string;
  };
  public partner_id!: string;
  public tags!: string[];
  public allergens?: string[];
  public condition!: 'new' | 'like_new' | 'good' | 'fair';
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('food', 'fashion'),
      allowNull: false,
    },
    subcategory: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    images: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    original_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    discount_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    discount_percentage: {
      type: DataTypes.VIRTUAL,
      get() {
        const originalPrice = parseFloat(this.getDataValue('original_price'));
        const discountPrice = parseFloat(this.getDataValue('discount_price'));
        if (originalPrice > 0) {
          return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
        }
        return 0;
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    unit: {
      type: DataTypes.STRING(20),
      defaultValue: 'шт',
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pickup_time_start: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    pickup_time_end: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    partner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'partners',
        key: 'id',
      },
    },
    tags: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    allergens: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    condition: {
      type: DataTypes.ENUM('new', 'like_new', 'good', 'fair'),
      defaultValue: 'new',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['category'],
      },
      {
        fields: ['subcategory'],
      },
      {
        fields: ['discount_price'],
      },
      {
        fields: ['is_active'],
      },
      {
        fields: ['partner_id'],
      },
    ],
  }
);
