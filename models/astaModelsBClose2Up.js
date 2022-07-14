module.exports =(sequelize, DataTypes) => {

    const Bid= sequelize.define("bid", {
        type: {
            type: DataTypes.STRING,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.TEXT
        },
		bidTime:{
			type:DataTypes.DATE,
			allowNull:false
		},
        winner:{
            type:DataTypes.INTEGER
        }
		
		
    })
    return Bid
}