module.exports = {
    //Per il mio server non utilizare localhost ma 127.0.0.1 in quanto ci sta un problema con la porta 3306 che rifiuta
    // la connessione
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