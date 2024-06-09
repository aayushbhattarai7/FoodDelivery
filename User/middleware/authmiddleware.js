const jwt = require('jsonwebtoken');

const requireAuth =(req, res, next)=>{
const token = req.cookies.jwt

//check 
if(token){
jwt.verify(token, '8840c0cfe9aa76d47c38d4b15dab92c95ded775ed83567c58a43551cd1d1b4462396fd8da6d9828b0820d027ba90f26d5dbf127f6aedc097371528e1793270e1',(err, decodedToken)=>{
if(err){
    console.log(err.message);
    res.redirect('/login')
}else{
    console.log(decodedToken);
    next();
}
})
}else{
    res.redirect('/login')
}
    
}



module.exports={requireAuth,
    
}
