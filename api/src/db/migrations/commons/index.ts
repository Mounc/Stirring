import {
  DataTypes,
  QueryInterface,
  ModelAttributes,
  QueryInterfaceCreateTableOptions,
} from 'sequelize';

export const commonAttrs: ModelAttributes = {
  id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
};

export const createTableIfNotExist = async (
  queryInterface: QueryInterface,
  tableName: string,
  attributes: ModelAttributes,
  options?: QueryInterfaceCreateTableOptions,
) => {
  const exists = await queryInterface
    .describeTable(tableName, options)
    .catch(() => null);
  if (exists) {
    console.log(`Fail to create table: ${tableName}`);
  } else {
    return queryInterface
      .createTable(
        tableName,
        { ...commonAttrs, ...attributes },
        options,
      )
      .then(() =>
        console.log(`Successfully created table: ${tableName}`),
      );
  }
};

export const dropTableIfExist = async (
  queryInterface: QueryInterface,
  tableName: string,
  options?: QueryInterfaceCreateTableOptions,
) => {
  const exists = await queryInterface
    .describeTable(tableName, options)
    .catch(() => null);
  if (!exists) {
    console.log(`Fail to drop table: ${tableName}`);
  } else {
    return queryInterface
      .dropTable(tableName, options)
      .then(() =>
        console.log(`Successfully dropped table: ${tableName}`),
      );
  }
};
