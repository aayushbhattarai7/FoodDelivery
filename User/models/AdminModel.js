// const mongoose = require("mongoose");

// const adminSchema = new mongoose.Schema({
//     email:{
//         type:String,
        
//     },password:{
//         type: String
//     }
// })
// adminSchema.statics.login = async function(email, password) {
//     const user = await this.findOne({ email });
//     if (user) {
//         const auth = await bcrypt.compare(password, user.password);
//         if (auth) {
//             return user;
//         }
//         throw Error('Incorrect password');
//     }
//     throw Error('Incorrect email');
// }
// const Admin = mongoose.model("admin",adminSchema);
// module.exports= Admin;