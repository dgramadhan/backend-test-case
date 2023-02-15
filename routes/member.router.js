
module.exports = (app) => {
    var router = require("express").Router();
    const transaction = require("../controllers/transaction.controller")
    var bodyParser = require('body-parser') 

    var jsonParser = bodyParser.json();  

    router.get("/list_member", transaction.listMember)
    router.get("/list_member_borrow", transaction.listMemberBorrow)
    app.use("/member", router)

}