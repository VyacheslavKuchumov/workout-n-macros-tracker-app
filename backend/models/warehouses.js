const { sequelize } = require('../connection')
const { DataTypes } = require('sequelize')



const warehouse = sequelize.define(
    'warehouse',
    {
        warehouse_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        warehouse_name:{
            type:DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        warehouse_adress:{
            type:DataTypes.TEXT,
            allowNull: true
        }

    },
    {
        tableName: 'warehouses',
        timestamps: false
    },
    
)




module.exports = { warehouse }