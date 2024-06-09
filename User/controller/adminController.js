const Item = require('../models/uploadItem');
const multer = require('multer');
const fs = require('fs')
const Admin = require('../models/AdminModel')





var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./uploads');
    },
    filename: function(req, file, cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
})
var upload = multer({
    storage:storage
}).single('image');

const storeItem = async (req, res) => {
    try {
        const items = new Item({
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            image:  req.file.filename
        });

        await items.save();
        console.log("Item added:", items);
        res.redirect('/admin');
    } catch (err) {
        console.error("Error adding item:", err); 
        res.status(500).send("Error adding item. Please try again later."); 
    }
}



const addToAdmin = async(req, res)=>{
    Item.find({}).exec()
    .then(items =>{
        res.render('AdminHome',{
            items:items,})
        }).catch(err =>{
            res.json({message: err.message})
        })
        
}

const addToUser = async(req, res)=>{
    Item.find({}).exec()
    .then(items =>{
        res.render('Homepage',{
            items:items,})
        }).catch(err =>{
            res.json({message: err.message})
        })
}

const addToMenu = async(req, res)=>{
    Item.find({}).exec()
  .then(items =>{
      res.render('Menu',{
          items:items,})
      }).catch(err =>{
          res.json({message: err.message})
      })
}

const getEditPage = async(req, res)=>{
    try {
        let id = req.params.id;
        let items = await Item.findById(id).exec();
        
        if (!items) {
            return res.redirect('/admin');
        }
        
        res.render('edit', { items: items });
    } catch (err) {
        console.error(err);
        res.redirect('/admin');
    }
}


const updateItem = async(req, res)=>{
    try {
        let id = req.params.id;
        let new_image = '';

        if (req.file) {
            new_image = req.file.filename;
            try {
                fs.unlinkSync('./uploads/' + req.body.old_image);
            } catch (err) {
                console.log(err);
            }
        } else {
            new_image = req.body.old_image;
        }

        await Item.findByIdAndUpdate(id, {
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            image: new_image
        });

        res.redirect('/admin'); // Redirect after successful update
        console.log("Edit success");
    } catch (err) {
        console.error("Error:", err);
        res.redirect('/admin'); // Redirect in case of error
    }
}

const deleteItem = async(req, res) =>{
    try {
        let id = req.params.id;
        const result = await Item.findByIdAndDelete(id);

        if (result && result.image !== '') {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (err) {
                console.log(err);
            }
        }
        console.log("Item Deleted");
        res.redirect('/admin');
    } catch (err) {
        console.error("Error while deleting:", err);
        res.redirect('/admin');
    }
}

module.exports ={
    storeItem,
    upload,
    addToAdmin,
    addToUser,
    addToMenu,
    updateItem,
    getEditPage,
    deleteItem,
  
} 