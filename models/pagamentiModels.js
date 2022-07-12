module.exports =(sequelize, DataTypes) => {

    const Payment= sequelize.define("payment", {
        PaymentID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        UserID: {
            type: DataTypes.STRING,
			allowNull: false
        },
		BidId : {
            type: DataTypes.STRING,
			allowNull: false
        },
		
    })
    return Payment
}