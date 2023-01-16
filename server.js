require('dotenv').config()
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))

//Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/bookRouter'))
app.use('/api', require('./routes/orderRouter'))

// To access images folder inside public
app.use('/client/public', express.static('public'));


// Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err =>{
    if(err) throw err;
    console.log('Connected to MongoDB successfully')
})

app.get('/',(req, res) => {
    res.json({msg: "Hi, Perfect working condition"})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log('Server is perfectly running on port', PORT)
})