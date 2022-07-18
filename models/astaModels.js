/*
        In questa sezione vado a stabilire come saranno composte le mie tabelle del Database Asta
*/
module.exports =(sequelize, DataTypes) => {

    const Auction= sequelize.define("auction", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price_open: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.TEXT
        },
		auctionTimeStart:{
			type:DataTypes.DATE,
			allowNull:false
		},
        auctionTimeFinish:{
			type:DataTypes.DATE,
			allowNull:false
		},
        price_now: {
            type: DataTypes.INTEGER
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        winner:{
            type:DataTypes.INTEGER
        },
        nuova_proposta:{
            type:DataTypes.INTEGER
        }
		
		
    })
    return Auction
}