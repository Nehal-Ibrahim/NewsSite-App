const express =require('express')
const router= new express.Router()
const auth=require('../middleware/auth')
const News=require('../models/news')
const multer=require('multer')


router.post('/news/add',auth,async(req,res)=>{
    try{
        const news=new News({...req.body,owner:req.reporter._id})
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})



router.get('/news/:id',auth,async(req,res)=>{
    try{
        const _id=req.params.id
        const news=await News.findOne({_id,owner:req.reporter._id})
        if(!news){
           return res.status(404).send('no news are found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send('error'+e)
    }
})




router.patch('/news/:id',auth,async(req,res)=>{
    try{
        const updates=Object.keys(req.body)
        const allowedupdates=['description','title']
        var isvalid=updates.every((update)=>allowedupdates.includes(update))
        if(!isvalid){
            return res.status(404).send('cannot update')
        }
        const _id=req.params.id
        const news=await News.findOneAndUpdate({_id,owner:req.reporter._id},req.body,{
            new:true,
            runValidators:true
        })
        if(!news){
            throw new Error('no news are found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})



router.delete('/news/:id',auth,async(req,res)=>{
    try{
        const _id=req.params.id
        const news=await News.findOneAndDelete({_id,owner:req.reporter._id})
        if(!news){
            return res.status(404).send('unable to find any news')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e)
    }
})




const uploads=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            cb(new Error('you must upload  an image file'))
        }
        cb(null,true)
    }
})

router.post('/newsimages/:id',auth,uploads.single('avatar'),async(req,res)=>{
    try{
        const _id=req.params.id
        const newsid=await News.findById(_id)
        console.log(newsid)
        if(!newsid){
           return res.status(404).send('unable to upload a pic')
        }
        newsid.avatar=req.file.buffer
        console.log(newsid.avatar)
        await newsid.save()
        res.send('done')

        console.log('done')
    }
    catch(e){
        res.status(400).send('e'+e)
    }

    
})




router.get('/news',auth,async(req,res)=>{
    try{
        
        await req.reporter.populate('news')
        res.status(200).send(req.reporter.news)
    }
    catch(e){
        res.status(400).send('e'+e)
    }
})





module.exports=router

