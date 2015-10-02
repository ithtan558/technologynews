var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// tạo cấu trúc db
var schema = mongoose.Schema({
    name:   {type: 'String', required: true},
    description:   {type: 'String', required: false},
    status: {type: 'Number', default: 0}
});

// tạo model cho category và export vào app
module.exports = mongoose.model('Category', schema);
