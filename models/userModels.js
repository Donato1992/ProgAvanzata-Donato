module.exports =(sequelize, DataTypes) => {

    const User= sequelize.define ("user", {
        name: {
            type: DataTypes.STRING,
        },
        cognome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.TEXT
        },
        wallet: {
            type: DataTypes.FLOAT
        },
		bidId: { 
			type:DataTypes.STRING,
			allowNull: false
        }
    })

    return User
}