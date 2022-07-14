module.exports =(sequelize, DataTypes) => {

    const BidInglese= sequelize.define("bidInglese", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price_open: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.TEXT
        },
		bidTime:{
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
        }
		
		
    })
    return Bid
}