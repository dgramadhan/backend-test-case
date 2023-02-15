module.exports = (app) => {
    var router = require("express").Router();
    const transaction = require("../controllers/transaction.controller");
    var bodyParser = require('body-parser') 

    var jsonParser = bodyParser.json();  

    router.get("/list_books", transaction.getBooks)
    router.get("/list_books_avail", transaction.getBooksAvail)
    router.post("/borrow_books", jsonParser, transaction.borrowBook)
    router.post("/return_books", jsonParser, transaction.returnBook)
    app.use("/books", router)

}
