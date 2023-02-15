module.exports = (sequelize, Sequelize) => {
    const Members = sequelize.define("members", {
        code: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        penalty: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0
        }
    })

    return Members
}