import { Sequelize, Model, DataTypes } from 'sequelize';

export interface UserAttributes {
  id: number;
  first_name: string | null;
  last_name: string | null;
  user_name: string | null;
  email: string | null;
  instagram_url: string | null;
  company: string | null;
  role_in_company: string | null;
  tags: string | null;
  first_date: Date | null;
  last_date: Date | null;
  registration_date: Date;
  password: string;
  password_display: string | null;
  verified: string | null;
  verificationToken: string | null;
}

export interface UserModel extends Model<UserAttributes>, UserAttributes {}

export const defineUserModel = (sequelize: Sequelize) => {
  const User = sequelize.define<UserModel>('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role_in_company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    first_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
      
    },
    password_display: {
      type: DataTypes.STRING,
      allowNull: true,
      
    },
    verified: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    }
    
  },
  {
    timestamps: false,
  });

  return User;
};
