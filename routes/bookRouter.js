const router = require('express').Router()
const bookCtrl = require('../controllers/bookCtrl')

router.route('/books')
    .get(bookCtrl.getBooks)
    .post(bookCtrl.createBook)


router.route('/books/:id')
    .delete(bookCtrl.deleteBook)
    .put(bookCtrl.updateBook)

module.exports = router