var Category = require('../data/models/category');
module.exports = function (app) {
    // get category by status
    app.get('/api/category/list', function(req, res){
        Category.find({status: 1}, function(err, category){
            if(err)
                res.send(err);
            else
            	res.send(category);
        });
    });
    // get detail category
    app.get('/api/category/:category_id', function(req, res) {
        Category.findById(req.params.category_id, function(err, category){
            if (err)
                res.send(err);
            else
                res.json(category);
        });
     });
}
