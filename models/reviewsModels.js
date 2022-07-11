module.exports =(sequelize, DataTypes) => {

    const Review= sequelize.define("review", {
        rating: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.TEXT
        },
        published: {
            type: DataTypes.BOOLEAN
        }
    })
    return Review
}
