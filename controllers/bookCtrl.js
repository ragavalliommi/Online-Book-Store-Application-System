const Books = require('../models/bookModel')

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filtering(){
        const queryObj = {...this.queryString}

        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete(queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        this.query.find(JSON.parse(queryStr))

        return this;
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}


const bookCtrl = {
    getBooks: async(req, res) =>{
        try {

            
            const features = new APIfeatures(Books.find({deleted: false}), req.query)
            .filtering().sorting().paginating()

            const books = await features.query
    
            res.json({
                status: 'success',
                result: books.length,
                books: books
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createBook: async(req, res) =>{
        try {
            const {book_id, image_name, title, stock, price, details, plot, category} = req.body;

            const book = await Books.findOne({book_id})
            if(book)
                return res.status(400).json({msg: "This book already exists."})

            const newBook = new Books({
                book_id, image_name, title: title.toLowerCase(), stock, price, details, plot, category
            })

            await newBook.save()
            res.json({msg: "Created a book item"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteBook: async(req, res) =>{
        try {

            const book1 = await Books.findOne({
                                        $and: [
                                            {_id: req.params.id},
                                            {deleted: false}
                                        ]
                                    })
            book1.deleted = Boolean(true)
            await book1.save()

            res.json({msg: "Deleted a book item"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateBook: async(req, res) =>{
        try {
            const {title, image_name, stock, price, details, plot, category} = req.body;

            await Books.findOneAndUpdate({_id: req.params.id}, {
                title: title.toLowerCase(), image_name, stock, price, details, plot, category
            })

            res.json({msg: "Updated a book item"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = bookCtrl