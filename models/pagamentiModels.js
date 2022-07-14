module.exports =(sequelize, DataTypes) => {

    const Payment= sequelize.define("payment", {
        userID: {
            type: DataTypes.STRING,
			allowNull: false
        },
		bidId : {
            type: DataTypes.STRING,
			allowNull: false
        },
        state: {
            type: DataTypes.STRING
        }
		
    })
    return Payment
}