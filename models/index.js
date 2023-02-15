const dbConfig = require('../config/database')
const Sequelize = require("sequelize")
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.books = require("./books.model")(sequelize, Sequelize)
db.members = require("./members.modul")(sequelize, Sequelize)
db.checkout = require("./checkout.model")(sequelize, Sequelize)
db.penalty = require("./log_penalty.model")(sequelize, Sequelize)

db.books.hasMany(db.checkout, {foreignKey:"book_code", onDelete:"cascade", onUpdate: 'cascade',foreignConstraint:true})
db.members.hasMany(db.checkout, {foreignKey:"borrower_code", onDelete:"cascade", onUpdate: 'cascade',foreignConstraint:true})

module.exports = db