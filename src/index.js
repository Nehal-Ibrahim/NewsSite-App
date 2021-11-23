
const express=require('express')
const app=express()
const port=5000
const reporterRouter=require('./routers/reporter')
const newsRouter=require('./routers/news')


require('./db/mongoose')


app.use(express.json())
app.use(reporterRouter)
app.use(newsRouter)





app.listen(port,()=>{
    console.log('server is runing')
})