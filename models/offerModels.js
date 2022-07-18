/*
        In questa sezione vado a stabilire come saranno composte le mie tabelle del Database Asta
*/
module.exports =(sequelize, DataTypes) => {

    const Offer= sequelize.define("offer", {
        price: {
            type: DataTypes.INTEGER,
        },
		
		
    })
    return Offer
}