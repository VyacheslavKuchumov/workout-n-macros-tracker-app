const {sequelize} = require('../connection')
const {DataTypes} = require('sequelize')

const Auth = sequelize.define(
    'auth',
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        auth_uid: {
            type: DataTypes.UUID,
            unique: true
        },
        
        AccessToken:{
            type: DataTypes.TEXT
        },
        RefreshToken:{
            type: DataTypes.TEXT
        },
        password:{
            type: DataTypes.TEXT
        },
        email:{
            type: DataTypes.TEXT
        },
    },
    {
        tableName: 'Auths',
        timestamps: true,
    }
)


module.exports = {Auth}

