const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    product:[{
       _id:{
       type:mongoose.Schema.Types.ObjectId
    },
        title:String,
        price:Number,
        category:String,
        profile:String,
        quantity:Number
}],

})


module.exports = mongoose.model("Cart",cartSchema)