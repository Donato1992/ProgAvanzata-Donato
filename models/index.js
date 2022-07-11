const dbConfig =  require('../config/dbConfig.js');
const mysql = require('mysql2/promise');

const {Sequelize, DataTypes} = require ('sequelize');
const { dialect } = require('../config/dbConfig.js');

// Ottengo tutta la configurazione del Database

const sequelize = new Sequelize (
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)




sequelize.authenticate().then(() => {
    console.log('connessione...')
})
.catch(err => {
    console.log('Errore'+err)
})


const db ={}


db.Sequelize = Sequelize
db.sequelize = sequelize


db.asta = require('./astaModello.js')(sequelize, DataTypes)
db.rilanci = require('./rilanciAsta.js')(sequelize, DataTypes)

db.sequelize.sync({force: false})
.then(()=> {
    console.log('Si è Sincronizzato con il Database')
})

module.exports = db


// Relazione uno a Molti nel database

db.products.hasMany(db.reviews, {
    foreignKey: 'product_id',
    as: 'review'
})

db.reviews.belongsTo(db.products, {
    foreignKey: 'product_id',
    as: 'product'
})

