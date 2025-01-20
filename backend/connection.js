const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:123Wadz@localhost:5432/training_performance_db');

async function connect() {
    try {
        await sequelize.authenticate();
        console.log('SUCCES🚀🚀🚀🚀');
    } catch (error) {
        console.error('NOT SUCCES💀💀💀')
    }
}
connect()
module.exports = { sequelize }