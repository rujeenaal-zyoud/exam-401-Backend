
'use strict';
const axios = require('axios');
const cors = require('cors');
const express = require('express');
//const server = require('server');
const mongoose=require('mongoose');

require('dotenv').config();

// server=require('express')
// const server = require('express')

const server = express()
server.use(cors());
server.use(express.json());
const PORT= process.env.PORT;

mongoose.connect('mongodb://localhost:27017/Digimon',{ useNewUrlParser: true, useUnifiedTopology: true });

// create mongooseScheme and model 


 const digimoSchema = new mongoose.Schema({

    name:String,
    level:String,
     img:String,
 })

 const digimonModel = mongoose.model('dig',digimoSchema)





 server.get('/getDigimons',getDataHandller);
 server.post('/addDataToFav',addDataToFavHandller);
 server.get('/getDataFav',getDataFavHandler);
 server.delete('/deleteData/:id',deleteDataHandler);
 server.put('/updateData/:id',updateDataHandler);



 function getDataHandller(req,res){
    const {digimon} = req.query;
     const url = `https://digimon-api.vercel.app/api/${digimon}`;
     axios.get(url)
     .then(result=>{
         const digiomnArray = result.data.map(item =>{
             return new Digiomn(item);
             console.log(digiomnArray)

         })
    res.send(digiomnArray)
     })
 }




  function addDataToFavHandller(req,res){
     const {level,img,name} =req.body;
     
     const newDigimon = new digimonModel({
         level:level,
         img:img,
         name:name,

     })
     newDigimon.save()
 }


  function getDataFavHandler(req,res){
    digimonModel.find({},(error,favData)=>{
        res.send(favData)
    })

  }




  function deleteDataHandler(req,res){
    const {id}=req.params;
    digimonModel.deleteOne({_id:id},(err,deletedData)=>{
        digimonModel.find({},(err,digimonData)=>{
            res.send(digimonData);
            // console.log(digimonData);
        })
    })
}


function updateDataHandler(req,res){
  
    const {name,img,level}=req.body;
    const {id}=req.params;
    digimonModel.findOne({_id:id},(err,dData)=>{
        dData.name=name;
        dData.img=img;
        dData.level=level;
        dData.save().then(()=>{
            digimonModel.find({},(error,digimonData)=>{
                res.send(digimonData);
            })
        })
    })
}
class Digiomn{
    constructor(item){
       this.img=item.img
this.level=item.level
this.name=item.name
    }
}









server.listen(PORT,()=>{
    console.log(`listening on PORT ${PORT}`);
})

