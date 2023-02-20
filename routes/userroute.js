const express = require("express");
const router = express.Router();
const userRouter = require("../controller/user");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./upload/videos",
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 52428800,
  },
});


router.post("/signup", userRouter.signup);
router.post("/signin", userRouter.signin);
router.post("/addPizza", upload.single("profile"), userRouter.pizza);
router.get("/getAllPizza", userRouter.getAllPizza);
router.put("/addcart/:userId", userRouter.addCart);
router.get("/cart", userRouter.cart)
router.put("/cart/user/:userId", userRouter.userCart)
router.get("/getCart/:userId", userRouter.getCart)
 router.put("/removeCart/:userId",userRouter.removeCart)
  router.put("/increase/:userId",userRouter.AddCartItem)
  router.get("/cartItems/:userId",userRouter.cartItems)


module.exports = router