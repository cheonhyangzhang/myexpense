// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Expense', new Schema({ 
    date: Date, 
    merchant: String, 
    description: String,
    category: String,
    subcategory: String,
    amount: Number,
    unusual: Boolean,
    verified:Boolean,
    owner: String
}));