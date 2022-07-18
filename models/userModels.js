/* 

In questa sezione vado a stabilire come saranno composte le mie tabelle del Database Asta

*/

module.exports =(sequelize, DataTypes) => {

    const User= sequelize.define ("user", {
        nome: {
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
            type: DataTypes.STRING
        },
		role: { 
			type:DataTypes.STRING,
			allowNull: false
        }
    })

    return User
}