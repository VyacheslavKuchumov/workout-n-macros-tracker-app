const { sequelize } = require('../connection')
const { DataTypes } = require('sequelize')



const set_type = sequelize.define(
    'set_type',
    {
        set_type_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        set_type_name:{
            type:DataTypes.TEXT,
            allowNull: false,
            unique: true
        }

    },
    {
        tableName: 'set_types',
        timestamps: false
    },
    
)




module.exports = { set_type }