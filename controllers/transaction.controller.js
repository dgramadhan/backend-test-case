const db = require("./../models");
const Books = db.books;
const Members = db.members;
const Checkout = db.checkout;
const LogPenalty = db.penalty
const Op = db.Sequelize.Op;
const { nanoid } = require('nanoid');

exports.getBooks = (req, res) => {
    Books.findAll({
        attributes: ['code', 'title', 'author', 'stock']
    })
        .then(data => {
            return res.status(200).send({ "status": "success", "data": data })
        })
        .catch(() => {
            return res.status(400).send({ "status": "gagal", "pesan": "data gagal ditampilkan" })
        })
}

exports.getBooksAvail = (req, res) => {
    Books.findAll({
        attributes: ['code', 'title', 'author', 'stock'],
        where: {
            stock: {
                [Op.gt]: 0
            }
        }
    })
        .then(data => {
            if (data == 0) {
                return res.status(200).send({ "status": "success", "data": "data kosong" })
            }
            return res.status(200).send({ "status": "success", "data": data })
        })
        .catch(() => {
            return res.status(400).send({ "status": "gagal", "pesan": "data gagal ditampilkan" })
        })
}

exports.listMember = (req, res) => {
    Members.findAll({
        attributes: ['code', 'name']
    })
        .then(data => {
            return res.status(200).send({ "status": "success", "data": data })
        })
        .catch(err => {
            return res.status(400).send({ "status": "gagal", "pesan": "data gagal ditampilkan" + err })
        })
}

exports.listMemberBorrow = (req, res) => {
    Members.findAll({
        attributes: ['code', 'name'],
        include: [{
            model: Checkout,
            attributes: ['book_code'],
            where: {
                is_return: 1
            }
        }]
    })
        .then(data => {
            return res.status(200).send({ "status": "success", "data": data })
        })
        .catch(err => {
            return res.status(400).send({ "status": "gagal", "pesan": "data gagal ditampilkan" + err })
        })
}

let checkBorrow = async (id) => {
    const count = await Checkout.count({
        where: {
            [Op.and]:
            {
                borrower_code: id,
                is_return: 1
            }

        }
    })
    return count
}

let checkBook = async (id) => {
    const stockBook = await Books.findOne({
        attributes: ['stock'],
        where: {
            code: id
        }
    })
    return stockBook.stock
}

let checkPenalty = async (id) => {
    const penalty = await Members.findOne({
        attributes: ['penalty'],
        where: {
            code: id
        }
    })
    return penalty.penalty
}

exports.borrowBook = async (req, res) => {
    let id = nanoid(4);
    let book_code = req.body.book;
    let borrower_code = req.body.member;
    let checking = await checkBorrow(borrower_code);
    let checkingBook = await checkBook(book_code);
    let checkingPenalty = await checkPenalty(borrower_code)

    console.log(checkingPenalty)

    if (checkingPenalty === true) {
        return res.status(400).send({ "status": "gagal", "pesan": "anda sedang dalam penalty" })
    }
    else if (checking >= 2) {
        return res.status(400).send({ "status": "gagal", "pesan": "pinjaman melebihi" })
    } else if (checkingBook === 0) {
        return res.status(400).send({ "status": "gagal", "pesan": "buku sedang tidak tersedia" })
    } else {
        Checkout.create({
            id: id,
            book_code: book_code,
            borrower_code: borrower_code
        })
            .then(() => {
                Books.update({
                    stock: checkingBook - 1,
                }, {
                    where: {
                        code: book_code
                    }
                })
                return res.status(200).send({ "status": "success", "pesan": "data berhasil ditambahkan" })
            })
            .catch(err => {
                return res.status(400).send({ "status": "gagal", "pesan": "data gagal ditambahkan" + err })
            })
    }

}

let checkDate = async (id_book, id_member) => {
    const date = await Checkout.findOne({
        attributes: ['date_return', 'createdAt'],
        where: {
            book_code: id_book,
            borrower_code: id_member,
            is_return: 0
        }
    })
    return date
}

exports.returnBook = async (req, res) => {
    let id = nanoid(4);
    let book_code = req.body.book;
    let borrower_code = req.body.member;
    let date = req.body.date;
    let countingBook = await checkBook(book_code);
    let returnDate = await checkDate(book_code, borrower_code)

    const diffTime = Math.abs(returnDate.date_return - returnDate.createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffTime + " milliseconds");
    console.log(diffDays + " days");

    const newdate = new Date(date);
    newdate.setDate(newdate.getDate() + 3);

    Checkout.findAll({
        attributes: ['book_code', 'borrower_code'],
        where: {
            [Op.and]: {
                book_code: book_code,
                borrower_code: borrower_code,
                is_return: 1
            }
        }
    })
        .then(data => {
            console.log(data)
            if (data != 0) {
                Checkout.update({
                    is_return: 0,
                    date_return: date
                }, {
                    where: {
                        book_code: book_code,
                        borrower_code: borrower_code,
                    }
                })

                Books.update({
                    stock: countingBook + 1
                }, {
                    where: {
                        code: book_code
                    }
                })

                if (diffDays > 7) {
                    Members.update({
                        penalty : 1
                    }, {
                        where : {
                            code : borrower_code
                        }
                    })
                    
                   
                    LogPenalty.create({
                        id : id,
                        borrower_code : borrower_code,
                        start_date : date,
                        end_date : newdate,
                        is_penalty : 1
                    })
                    return res.status(200).send({ "status": "success", "pesan": "berhasil mengembalikan buku dan mendapatkan penalty 3 hari" })
                }

                return res.status(200).send({ "status": "success", "pesan": "berhasil mengembalikan buku" })
            } else {
                return res.status(400).send({ "status": "gagal", "pesan": "tidak berhasil mengembalikan buku" })
            }

        })
        .catch(err => {
            return res.status(400).send({ "status": "gagal", "pesan": "cek kembali inputan" + err })
        })
}