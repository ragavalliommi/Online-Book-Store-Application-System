import React, {useContext} from 'react'
import {Routes, Route} from 'react-router-dom'
import Books from './books/Books'
import DetailBook from './detailBook/DetailBook'
import Login from './auth/Login'
import Register from './auth/Register'
import Cart from './cart/Cart'
import NotFound from './utils/not_found/NotFound'
import Categories from './categories/Categories'
import CreateBook from './createBook/CreateBook'
import OrderHistory from './history/OrderHistory'
import OrderDetails from './history/OrderDetails'


import {GlobalState} from '../../GlobalState'

function Pages(){

    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin

    return (
        <Routes>
            <Route path="/" exact element = {<Books/>} />
            <Route path="/detail/:id" exact element = {<DetailBook/>} />
            <Route path="/login" exact element = {isLogged ? <NotFound/> : <Login/>} />
            <Route path="/register" exact element = {isLogged ? <NotFound/> : <Register/>} />
            <Route path="/category" exact element={isAdmin ? <Categories/> : <NotFound/>} />
            <Route path="/create_book" exact element={isAdmin ? <CreateBook/> : <NotFound/>} />
            <Route path="/edit_book/:id" exact element={isAdmin ? <CreateBook/> : <NotFound/>} />
            <Route path="/history" exact element={isLogged ? <OrderHistory/> : <NotFound/>} />
            <Route path="/history/:id" exact element={isLogged ? <OrderDetails/> : <NotFound/>} />
            <Route path="/cart" exact element = {<Cart/>} />

            <Route path="*" exact element = {<NotFound/>} />
        </Routes>
    )
}

export default Pages