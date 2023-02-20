const bcrypt = require("bcrypt");
const User = require("../models/user");
const Content = require("../models/pizza");
const Cart = require("../models/cart");

const getCart = (req, res) => {
  Cart.find({ userId: req.params.userId })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: "not found",
        error: err,
      });
    });
};

const cartItems = (req, res) => {
  Cart.findOneAndUpdate({
    userId: req.params.userId,
    "product._id": req.body._id,
  }).then((result) => {
    console.log("result ====>", result);
    res.status(200).send(result);
  });
};

const AddCartItem = async (req, res) => {
  await Cart.findOneAndUpdate(
    { userId: req.params.userId, "product._id": req.body._id },
    {
      $set: {
        "product.$.quantity": req.body.quantity,
      },
    }
  ).then((result) => {
    res.status(200).send(result);
   
  });
 
 
};

const removeCart = (req,res) => {
  Cart.update({userId: req.params.userId,"product._id":req.body._id}, { "$pull": { "product": { _id:req.body._id } }},{ safe: true, upsert: true } ).then(result => {
    res.status(200).send(result)
  })
}

// const removeCart = (req,res) => {
//   Cart.find({
//     userId: req.body.userId,
//    "product._id": req.body._id
//  }).then((data) => {
//     console.log("doc", data);
//    //  JSON.parse(JSON.stringify
//    if(data.length > 0){
//   Cart.findOneAndRemove( { userId: req.body.userId},
//     {
//       $pull: {
//         product: {
//           _id: req.body._id,
//           title: req.body.title,
//           price: req.body.price,
//           category: req.body.category,
//           profile: req.body.profile,
//           quantity: req.body.quantity,
//         },
//       },
//     }).then((result) => {
//     res.status(200).send(result);
//   })
// }
// })
// }

const addCart = (req, res) => {
  Cart.find({ userId: req.body.userId }).then((result) => {
    console.log("result", result);

    // JSON.parse(JSON.stringify(result)).map((data,index) => data.product.findIndex())

    if (result.length > 0) {
      Cart.find({
        userId: req.body.userId,
        "product._id": req.body._id,
      }).then((data) => {
        console.log("doc", data);
        //  JSON.parse(JSON.stringify(data[0].product)).map((val) => {let index = val.product.findIndex(val => val._id === {"product._id":req.body._id})
        // console.log("index",index)})
        if (data.length > 0) {
          Cart.findOneAndUpdate(
            { userId: req.body.userId, "product._id": req.body._id },
            { $inc: { "product.$.quantity": 1 } },
            { new: true }
          ).then((val) => {
            console.log("console=> ", val);

            res.send(val);
          });
        } else {
          console.log("else occured =============");
          Cart.findOneAndUpdate(
            { userId: req.body.userId },
            {
              $push: {
                product: {
                  _id: req.body._id,
                  title: req.body.title,
                  price: req.body.price,
                  category: req.body.category,
                  profile: req.body.profile,
                  quantity: req.body.quantity,
                },
              },
            }
          ).then((result) => {
            res.status(200).send(result);
          });
        }
        // })
      });

      //  let itemIndex = cart.product.findIndex(p => p.productId == 'product._id');
      // console.log("itemIndex",itemIndex)
    } else {
      const addCart = new Cart({
        userId: req.params.userId,
        product: {
          _id: req.body._id,
          title: req.body.title,
          price: req.body.price,
          category: req.body.category,
          profile: req.body.profile,
          quantity: req.body.quantity,
        },
      });

      addCart
        .save()
        .then((result) => {
          res.status(200).send(result);
        })

        .catch((error) => {
          res.status(400).send({
            error: error,
          });
        });
    }
  });
};

const cart = (req, res) => {
  Cart.find()
    .populate("userId")
    .then((result) => res.status(200).send(result));
};

const signup = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        console.log(req.body.password);
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(400).json({
              error: err,
            });
          } else {
            const user = new User({
              name: req.body.name,
              email: req.body.email,
              password: hash,
            });
            console.log(user);
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                  result,
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

const signin = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(400).json({
          message: "user not exist",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          res.status(400).json({
            message: "wrong password",
          });
        } else {
          res.status(200).send({
            result: result,
            user: user,
          });
        }
      });
    });
};

const pizza = (req, res, next) => {
  const pizzaData = new Content({
    title: req.body.title,
    price: req.body.price,
    category: req.body.category,
    profile: req.file.path,
  });
  pizzaData
    .save()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));

  res.json({
    message: "file uploaded",
    createcContent: pizzaData,
    profile_url: `localhost:5000/profile/${req.file.path}`,
  });
};

const getAllPizza = (req, res) => {
  Content.find().then((result) => {
    res.status(200).send(result);
  });
};

const userCart = async (req, res) => {
  const { _id, title, quantity, category, price, profile } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.params.userId });

    if (cart) {
      //cart exists for user
      let itemIndex = cart.product.findIndex((p) => p.productId === _id);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity

        let productItem = cart.product[itemIndex];
        productItem.quantity = quantity;
        cart.product[itemIndex] = productItem;
        console.log("productItem", productItem);
      } else {
        //product does not exists in cart, add new item
        cart.product.push({ _id, title, quantity, category, price, profile });
      }
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      //no cart for user, create new cart
      const newCart = await Cart.create({
        userId: req.body.userId,
        product: [{ _id, title, quantity, category, price, profile }],
      });

      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

module.exports = {
  signup,
  signin,
  pizza,
  getAllPizza,
  addCart,
  cart,
  userCart,
  getCart,
  removeCart,
  AddCartItem,
  cartItems,
};
