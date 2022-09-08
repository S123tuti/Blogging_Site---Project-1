const express = require('express')
const route = require ('./routes/route.js')
const mongoose = require('mongoose')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://GroupDatabase:yysYmXKv6mOkoW9N@cluster0.jwlonbw.mongodb.net/Group35-DB?retryWrites=true&w=majority",{
useNewUrlParser : true
})
.then(()=>{
    console.log('MongoDB is connected')
})
.catch((err)=>{
    console.log(err) 
})


app.use('/' , route)

app.listen(process.env.PORT || 3000 , function(){
    console.log('Express app is running on port '+(process.env.PORT||3000) )
})