
const express =require('express')
const router= new express.Router()
const Reporter=require('../models/reporter')
const auth=require('../middleware/auth')
const multer=require('multer')

router.post('/reporters/register',async(req,res)=>{
    try{
    const reporter=new Reporter(req.body)
    const token=await reporter.generateToken()
    await reporter.save()
    res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send('error'+e)
    }
})



router.post('/reporters/login',async(req,res)=>{
    try{
        const reporter=await Reporter.findByCredentials(req.body.email,req.body.password)
        const token =await reporter.generateToken()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send('error'+e)

    }
})




router.get('/reporters/getall',async(req,res)=>{
    try{
   const reporter = await Reporter.find({})
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(500).send('e'+e)
    }
})





router.get('/reporters/:id',async(req,res)=>{
    try{
    const _id=req.params.id
    const reporter = await Reporter.findById(_id)
        if(!reporter){
            throw new Error('not found')
        }
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(500).send(e)
    }
    
})



router.patch('/reporters/edit/:id',async(req,res)=>{
    try{
        const updates=Object.keys(req.body)
        const allowedUpdates=["name","password","phone"]
        var isvalid=updates.every((update)=>allowedUpdates.includes(update))
        if(!isvalid){
            throw new Error('cannot update')
        }
        const _id=req.params.id
       const reporter=await Reporter.findById(_id)
       if(!reporter){
           throw new Error('no reporter is found')
       }
       updates.forEach((update)=>reporter[update]=req.body[update])
           await reporter.save()
           res.status(200).send(reporter)
       
    }
    catch(e){
        res.status(400).send(e)
    }
})





router.delete('/logout',auth,async(req,res)=>{
    try{
        req.reporter.tokens=req.reporter.tokens.filter((el)=>{
            return el.token!==req.token
        })
        await req.reporter.save()
        res.send('logout success')
    }
    catch(e){
        res.status(500).send(e)
    }
})



router.delete('/logoutall',auth,async(req,res)=>{
    try{
        req.reporter.tokens=[]
    
        await req.reporter.save()
        res.send('logout success')
    }
    catch(e){
        res.status(500).send(e)
    }
})











module.exports=router