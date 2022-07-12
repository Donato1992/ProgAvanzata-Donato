module.exports =(sequelize, DataTypes) => {

    const Offer= sequelize.define("offer", {
        price: {
            type: DataTypes.INTEGER,
        },
		
		
    })
    return Offer
}