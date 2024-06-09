const express = require("express");
const router = express.Router();
const Item = require('../models/uploadItem');
const { requireAuth } = require('../middleware/authmiddleware');
const fs = require('fs');
const adController = require('../controller/adminController')




//post
router.post('/admin', adController.upload,adController.storeItem);

router.get('/admin',adController.addToAdmin);

router.get('/',requireAuth,adController.addToUser); 

router.get('/menu',requireAuth,adController.addToMenu); 

  router.get('/order',requireAuth,(req, res)=>{
    res.render('order')
  });

  
  router.get('/cart',requireAuth,(req, res)=>{
    res.render('cart')
  })


  router.get('/edit/:id',adController.getEditPage);


router.post('/edit/:id',adController.upload,adController.updateItem)

router.get('/delete/:id',adController.deleteItem)
    
module.exports={router};
