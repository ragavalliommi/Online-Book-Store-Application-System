import React, {useContext, useState, useEffect} from 'react'
import {GlobalState} from '../../../GlobalState'
import axios from 'axios'
import {Link} from 'react-router-dom'


function Cart() {
    const state = useContext(GlobalState) 
    const [token] = state.token
    const [cart, setCart] = state.userAPI.cart
    const [total, setTotal] = useState(0)   

    useEffect(() =>{
        const getTotal = () =>{
            const total = cart.reduce((prev, item) => {
                return prev + (item.price * item.quantity)
            },0)

            setTotal(total)
        }

        getTotal()

    },[cart])

    const addToCart = async (cart) =>{
        await axios.patch('/user/addcart', {cart}, {
            headers: {Authorization: token}
        })
    }

    const increment = (id) =>{
        cart.forEach(item => {
            if(item._id === id){
                item.quantity += 1
            }
        })

        setCart([...cart])
        addToCart(cart)
    }

    const decrement = (id) =>{
        cart.forEach(item => {
            if(item._id === id){
                item.quantity === 1 ? item.quantity = 1 : item.quantity -= 1
            }
        })

        setCart([...cart])
        addToCart(cart)
    }

    const removeBook = id =>{
        if(window.confirm("Do you want to delete this book?")){
            cart.forEach((item, index) => {
                if(item._id === id){
                    cart.splice(index, 1)
                }
            })

            setCart([...cart])
            addToCart(cart)
        }
    }

    const tranSuccess = async() => {

        await axios.post('/api/order', {cart}, {
            headers: {Authorization: token}
        })

        setCart([])
        addToCart([])
        alert("You have successfully placed an order.")
    }


    if(cart.length === 0) 
        return <h2 style={{textAlign: "center", fontSize: "5rem"}}>Cart Empty</h2> 
    return (
        <div>
            {
                cart.map(book => (
                    <div className="detail cart" key={book._id}>
                    <img src={"/images/" + book.image_name} alt=""/>
                        <div className="box-detail">
                            
                            <h2>{book.title}</h2>
                            
                            <h3>$ {book.price * book.quantity}</h3>
                            <p>{book.details}</p>
                            <p>{book.plot}</p>
                            
                            <div className="amount">
                                <button onClick={() => decrement(book._id)}> - </button>
                                <span>{book.quantity}</span>
                                <button onClick={() => increment(book._id)}> + </button>
                            </div>

                            <div className="delete" onClick={() => removeBook(book._id)}>X</div>
                </div>
            </div>
                ))
            }
            <div className="total">
                <h1>Total: $ {total}</h1>
                <button onClick={() => tranSuccess()}><span>Check Out</span></button>
            </div>
        </div>
    )
}

export default Cart