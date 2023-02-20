const express = require("express");
const app = express();
const port = process.env.Port || 4000;
const dotenv = require("dotenv")
const connect = require("./config/conn");
const path = require("path")
const ApiRouter = require("./routes/userroute")
const cors = require('cors')


app.use(express.json());
app.use(express.urlencoded({extended:true}))





app.use("/upload", express.static(path.join(__dirname, "/upload")));
app.use(express.static(path.join(__dirname, "/../frontend/build")));

app.get("", (req, res) => {
  try {
    res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
  } catch (e) {
    res.send("Welcome to stackoverflow clone");
  }
});

app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });




dotenv.config({path: "./config/config.env"})
connect()

app.use("/api",ApiRouter);


app.get("/", (req,res) => {
    res.send("hello dev")
});

app.listen(port, () => {
    console.log(`server running on port ${port}`)
});