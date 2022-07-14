module.exports =(sequelize, DataTypes) => {

    const Bid= sequelize.define("bid", {
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