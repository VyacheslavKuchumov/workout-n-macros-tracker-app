const { sequelize } = require('../connection')
const { DataTypes } = require('sequelize')



const draft = sequelize.define(
    'draft',
    {
        draft_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        draft_name:{
            type:DataTypes.TEXT,
            allowNull: false,
            unique: true
        }

    },
    {
        tableName: 'drafts',
        timestamps: false
    },
    
)




module.exports = { draft }