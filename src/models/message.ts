import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../config/sequelize-config';

class MessageModel extends Model {
  public id!: string;
  public data!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MessageModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
  }
);

export default MessageModel;
