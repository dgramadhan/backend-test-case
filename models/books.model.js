module.exports = (sequelize, Sequelize) => {
    const Books = sequelize.define("books", {
        code: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING
        },
        author: {
            type: Sequelize.STRING,
        },
        stock: {
            type: Sequelize.INTEGER,
        }
    })

    return Books
}