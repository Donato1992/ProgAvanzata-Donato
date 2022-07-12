module.exports =(sequelize, DataTypes) => {

    const Bid= sequelize.define("bid", {
        image: {
            type: DataTypes.STRING,
        },
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
        published: {
            type: DataTypes.BOOLEAN
        },
		BidTime:{
			type:DataTypes.DATE,
			allowNull:false
		},
		
		
    })
    return Bid
}