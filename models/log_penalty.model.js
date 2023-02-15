module.exports = (sequelize, Sequelize) => {
    const LogPenalty = sequelize.define("log_penalty", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        borrower_code : {
            type: Sequelize.STRING,
        },
        start_date : {
            type : Sequelize.DATE
        },
        end_date : {
            type : Sequelize.DATE
        },
        is_penalty : {
            type : Sequelize.BOOLEAN
        }
    })

    return LogPenalty
}