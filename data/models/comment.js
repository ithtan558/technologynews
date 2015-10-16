var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;

// tạo cấu trúc db
var schema = mongoose.Schema({
    articleId:   {type: ObjectId, ref: 'Article',index:true },
    userId:   {type: ObjectId, ref: 'User',index:true },
    commentId:   {type: ObjectId, ref: 'Comment',index:true },
    child:   {type: Number, default: 0 },
    content:   {type: 'String', required: true},
    creationDate:   {type: 'Date', default: Date.now},
    lastEditDate:   {type: 'Date', default: Date.now},
    isAcepted: {type: 'Number', default: 1}
});

// tạo model cho skill và export vào app
module.exports = mongoose.model('Comment', schema);
