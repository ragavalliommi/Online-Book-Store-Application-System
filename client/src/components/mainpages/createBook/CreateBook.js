import React, {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import {GlobalState} from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import {useNavigate, useParams} from 'react-router-dom'


const initialState = {
    book_id: '',
    image_name: '',
    title: '',
    stock: 0,
    price: 0,
    details: '',
    plot: '',
    category: '',
    _id: ''
}

function CreateBook() {

    const state = useContext(GlobalState)
    const [book, setBook] = useState(initialState)
    const [categories] = state.categoriesAPI.categories

    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token

    const history = useNavigate()
    const param = useParams()

    const [books] = state.booksAPI.books
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.booksAPI.callback

    useEffect(() => {
        if(param.id){
            setOnEdit(true)
            books.forEach(book => {
                if(book._id === param.id) {
                    console.log(book)
                    setBook(book)
                }
            })
        }else{
            setOnEdit(false)
            setBook(initialState)
        }
    }, [param.id, books])

    const handleChangeInput = e =>{
        const {name, value} = e.target
        setBook({...book, [name]:value})
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        try {
            if(!isAdmin) return alert("Admin login required")
           
            if(onEdit){
                await axios.put(`/api/books/${book._id}`, {...book}, {
                    headers: {Authorization: token}
                })
            }else{
                await axios.post('/api/books', {...book}, {
                    headers: {Authorization: token}
                })
            }
            
            setCallback(!callback)
            setBook(initialState)
            history("/")

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const [File, setFile] = React.useState("");

    function handleUpload(event) {
    setFile(event.target.files[0]);
    book.image_name = event.target.files[0]['name'];
     }

    return (
        <div className="create_book">

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="book_id">Book ID</label>
                    <input type="text" name="book_id" id="book_id" required
                    value={book.book_id} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="image_name">Upload Image</label>
                    <div>
                        <input type="file" onChange={handleUpload} />
                    </div>
                </div>

                <div className="row">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" required
                    value={book.title} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="stock">Total Stock</label>
                    <input type="text" name="stock" id="stock" required
                    value={book.stock} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="price">Price</label>
                    <input type="number" name="price" id="price" required
                    value={book.price}  onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="details">Details</label>
                    <textarea type="number" name="details" id="details" required
                    value={book.details} rows="5" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="plot">Plot</label>
                    <textarea type="text" name="plot" id="plot" required
                    value={book.plot} rows="7" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="categories">Category: </label>
                    <select name="category" value={book.category} onChange={handleChangeInput}>
                        <option value="">Choose a category</option>
                        {
                            categories.map(category => (
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <button type="submit">{onEdit? "Update" : "Create"}</button>
            </form> 
        </div>
    )

}

export default CreateBook
