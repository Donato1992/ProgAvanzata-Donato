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


db.user = require('./userModels.js')(sequelize, DataTypes)
db.asta = require('./astaModels.js')(sequelize, DataTypes)
db.pagamenti= require('./pagamentiModels.js')(sequelize,DataTypes)
db.offer= require ('./offerModels.js')(sequelize, DataTypes)

db.sequelize.sync({force: false})
.then(()=> {
    console.log('Si è Sincronizzato con il Database')
})

module.exports = db


// Relazione uno a Molti nel database Asta-Utente

db.user.hasMany(db.asta, {
     foreignKey: 'UserID',
     as: 'Bid'
 })

db.asta.belongsTo(db.user, {
     foreignKey: 'UserID',
     as: 'User'
 })

// Relazione uno a Molti nel database Offerta-Utente

db.user.hasMany(db.offer, {
    foreignKey: 'UserID',
    as: 'Offer'
})

db.offer.belongsTo(db.user, {
      foreignKey: 'UserID',
      as: 'User'
  })

// Relazione uno a Molti nel database Asta-Offerta

db.asta.hasMany(db.offer, {
     foreignKey: 'AstaID',
     as: 'Offer'
})

db.offer.belongsTo(db.asta, {
     foreignKey: 'AstaID',
     as: 'Bid'
 })