const mongoose = require('mongoose')


const bookSchema = new mongoose.Schema({
    book_id:{
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    image_name:{
        type: String,
        trim: true,
        required: true
    },
    title:{
        type: String,
        trim: true,
        required: true
    },
    price:{
        type: Number,
        trim: true,
        required: true
    },
    details:{
        type: String,
        required: true
    },
    plot:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    checked:{
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        index: true,
        default: false
    },
    sold:{
        type: Number,
        default: 0
    },
    stock:{
        type: Number,
        default: 0,
        required: true
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("Books", bookSchema)