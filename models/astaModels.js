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
            type:DataTypes.STRING
        }
		
		
    })
    return Auction
}