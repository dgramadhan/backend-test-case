const express = require("express");
const app = express();
const dotenv = require('dotenv');
const swaggerUi = require("swagger-ui-express")
const swaggerDocs = require("./swagger.json") 
dotenv.config();

const db = require("./models/")

const port = process.env.PORT;

const dataBooks = db.books;
const dataMember = db.members;

db.sequelize.sync()
    .then(async () => {
        await console.log("Database Sync");
        await dataBooks.bulkCreate([
            {
                code: "JK-45",
                title: "Harry Potter",
                author: "J.K Rowling",
                stock: 1
            },
            {
                code: "SHR-1",
                title: "A Study in Scarlet",
                author: "Arthur Conan Doyle",
                stock: 1
            },
            {
                code: "TW-11",
                title: "Twilight",
                author: "Stephenie Meyer",
                stock: 1
            },
            {
                code: "HOB-83",
                title: "The Hobbit, or There and Back Again",
                author: "J.R.R. Tolkien",
                stock: 1
            },
            {
                code: "NRN-7",
                title: "The Lion, the Witch and the Wardrobe",
                author: "C.S. Lewis",
                stock: 1
            },
        ], {
            ignoreDuplicates : true,
        }),
        await dataMember.bulkCreate([
            {
                code: "M001",
                name: "Angga",
            },
            {
                code: "M002",
                name: "Ferry",
            },
            {
                code: "M003",
                name: "Putri",
            },
        ], {
            ignoreDuplicates : true,
        })
    })
    .catch((err) => {
        console.log("Gagal Sync DB : " + err.message)
    })
    
require("./routes/books.router")(app)
require("./routes/member.router")(app)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, {explorer: true}));