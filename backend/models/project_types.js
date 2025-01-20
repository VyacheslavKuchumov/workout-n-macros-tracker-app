const { sequelize } = require('../connection')
const { DataTypes } = require('sequelize')



const project_type = sequelize.define(
    'project_type',
    {
        project_type_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        project_type_name:{
            type:DataTypes.TEXT,
            allowNull: false,
            unique: true
        }

    },
    {
        tableName: 'project_types',
        timestamps: false
    },
    
)




module.exports = { project_type }