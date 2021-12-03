
const express=require('express')
const app=express()
require('dotenv').config()
const cors=require('cors')
const port= 5000
const reporterRouter=require('./routers/reporter')
const newsRouter=require('./routers/news')


require('./db/mongoose')


app.use(express.json())
app.use(cors())
app.use(reporterRouter)
app.use(newsRouter)





app.listen(port,()=>{
    console.log('server is runing ' + port)
})