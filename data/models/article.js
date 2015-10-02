var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;

// tạo cấu trúc db
var schema = mongoose.Schema({
    userId:   {type: ObjectId, ref: 'User',index:true },
    title:   {type: 'String', required: true},
    content:   {type: 'String', required: true},
    thumbnail:   {type: 'String', required: true},
    categoryId: {type: ObjectId, ref: 'Category',index:true },
    tag:   [],
    creationDate:   {type: 'Date', default: Date.now},
    lastEditDate:   {type: 'Date', default: Date.now},
    status: {type: 'Number', default: 0}
});

// tạo model cho skill và export vào app
module.exports = mongoose.model('Article', schema);
