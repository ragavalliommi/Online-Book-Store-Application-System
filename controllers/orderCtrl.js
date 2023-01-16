const Orders = require('../models/orderModel')
const Users = require('../models/userModel')
const Books = require('../models/bookModel')


const orderCtrl = {
    getOrders: async(req, res) =>{
        try {
            const orders = await Orders.find()
            res.json(orders)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createOrder: async(req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('name email')
            if(!user) return res.status(400).json({msg: "User does not exist."})

            const {cart} = req.body;

            const {_id, name, email} = user;

            const newOrder = new Orders({
                user_id: _id, name, email, cart
            })
            
            cart.forEach(item => {
                return sold(item._id, item.quantity, item.sold, item.stock)
            })
            
            await newOrder.save()
            res.json({msg: "Order Succes!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const sold = async (id, quantity, oldSold, oldstock) =>{

    await Books.findOneAndUpdate({_id: id}, { "$set": 
        {
        sold: quantity + oldSold,
        stock: oldstock - quantity
        }
    })

}

module.exports = orderCtrl