import React from 'react'
import BtnRender from './BtnRender'


function BookItem({book, isAdmin, deleteBook, handleCheck}){

    var author = book.details.split(',')[0];   
    var genre = book.details.split(',')[1]; 

    return (
        <div className="book_card">
            {
                isAdmin && <input type="checkbox" checked={book.checked} onChange={() => handleCheck(book._id)}/>
            }
            
            <div className="book_box">
                <img src={"/images/" + book.image_name} alt=""/>
                <h2 title={book.title}>{book.title}</h2>
                <span>${book.price}</span>
                <p>- {author}</p>
                <p>- {genre}</p>
                <p>- Total sold: {book.sold}</p>
                <p>- Remaining stock: {book.stock}</p>
            </div>

            <BtnRender book={book} deleteBook={deleteBook}/>
        </div>
    )
}

export default BookItem