const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    
  },
  price: {
    type: Number,
    required: true,
    
   
  },
  category: {
    type: String,
    required: true,
    
  },
  profile: {
    type: String,
    required: true,
  },
 
 
});

module.exports = mongoose.model("pizza", pizzaSchema);
