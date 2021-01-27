const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    slug:{
        type: String
    }
   
});

const category = module.exports = mongoose.model("Category",categorySchema);