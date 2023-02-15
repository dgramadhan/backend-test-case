module.exports = (sequelize, Sequelize) => {
    const Checkout = sequelize.define("checkout", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        book_code: {
            type: Sequelize.STRING
        },
        borrower_code : {
            type: Sequelize.STRING,
        },
        is_return: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        date_return : {
            type : Sequelize.DATE
        }
    })

    return Checkout
}