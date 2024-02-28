const express = require("express");
const mysql = require("mysql");
const dotenv = require('dotenv');
const cors = require("cors");
const { register } = require('./Authentication/Register')
const { signIn } = require('./Authentication/Login');
const { viewData } = require('./Data/Data');
const { updateData } = require('./Data/UpdateData');
// const { connectDB } = require('./Connect/Connect');


const app = express();
app.use(cors());

dotenv.config({ path: './.env'});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT



app.get("/", (req, res) => {
    res.send("<h1>Home Page </h1>")
})

app.post('/register', async (req,res) => {
        await register(req,res);
})

app.post('/login', async(req,res)=> {
    await signIn(req,res);
})

app.get('/viewData', async(req,res)=> {
    await viewData(req,res);
})

app.post('/updateData', async(req,res)=> {
    await updateData(req, res);
})
app.listen(port, () => {
    console.log("Server started on port:", port);
})