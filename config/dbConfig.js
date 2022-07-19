// Configuro i dati per il collegamento al DB
module.exports = {
    HOST: '127.0.0.1',
    USER: 'root',
    PASSWORD: 'pass124',
    DB: 'Aste',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}