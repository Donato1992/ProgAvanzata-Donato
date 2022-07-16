const dbConfig =  require('../config/dbConfig.js');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const axios = require('axios').default;
require('dotenv').config()

const {Sequelize, DataTypes} = require ('sequelize');
const { QueryTypes } = require('sequelize');
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
db.offer= require ('./offerModels.js')(sequelize, DataTypes)

db.sequelize.sync({force: false})
.then(()=> {
    console.log('Si è Sincronizzato con il Database')
    start();
})

module.exports = db




// Relazione uno a Molti nel database Asta-Utente

db.user.hasMany(db.asta, {
    foreignKey: 'UserID',
    as: 'AuctionC'
})

db.asta.belongsTo(db.user, {
    foreignKey: 'UserID',
    as: 'UserC'
})



// Relazione uno a Molti nel database Asta-Utente-Winner

db.user.hasMany(db.asta, {
     foreignKey: 'winner',
     as: 'Auction'
 })

db.asta.belongsTo(db.user, {
     foreignKey: 'winner',
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
     as: 'Auction'
 })

//Creo il token del mio wallet
let wallet=100
const token=jwt.sign({wallet}, process.env.ACCESS_TOKEN_WALLET)
console.log('Mio Token---->'+token)
//Utilizzo IGNORE per Bypassare il Prolema dei valori già esistenti
const miaquery="INSERT IGNORE INTO `users` (`id`, `nome`, `cognome`, `email`, `wallet`, `role`, `createdAt`, `updatedAt`) "+
"VALUES (1, 'Donato', 'Di Zinno', 'dizinno@gmail.com','"+token+"', 'admin', '2022-07-13 15:17:44', '2022-07-13 15:17:44'),"+
" (2, 'Alessio', 'Brugiavini', 'alessiob@gmail.com', '"+token+"', 'bid-creator', '2022-07-13 15:19:08', '2022-07-13 15:19:08'),"+
"(3, 'Massimo', 'Puntavo', 'puntatamax@gmail.com', '"+token+"', 'bid-partecipant', '2022-07-13 15:20:11', '2022-07-13 15:20:11')";
async function start() {
    await sequelize.query(miaquery, { type: QueryTypes.INSERT });
    //await Asta.create(info)
    
}
