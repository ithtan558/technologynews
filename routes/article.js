var Article = require('../data/models/article');
var randtoken = require('rand-token');
var fs = require('fs');
module.exports = function (app) {
    //get all articles of user
    app.get('/api/article/getOfUser',function(req, res) {
        Article.find({$and: [ {status:1},{userId:req.user._id} ]}).populate('userId').exec(function(err, article){
            if (err)
                res.send(err)
            else
                res.json(article);
        });
     });
    //get all articles
    app.get('/api/article/list',function(req, res) {
        Article.find({status:1}).populate('userId').exec(function(err, article){
            if (err)
                res.send(err)
            else
                res.json(article);
        });
     });
    //get all articles of category
    app.get('/api/getArticleCategory/list/:category_id',function(req, res) {
        Article.find({$and: [ {status:1},{categoryId:req.params.category_id} ]}).populate('userId').populate('categoryId').exec(function(err, article){
            if (err)
                res.send(err)
            else
                res.json(article);
        });
     });
    //get all articles of tag
    app.get('/api/getArticleTag/list/:name',function(req, res) {
        Article.find({tag:req.params.name}).populate('userId').populate('categoryId').exec(function(err, article){
            if (err)
                res.send(err)
            else
                res.json(article);
        });
     });
    //create article
    app.post('/api/article/create', function(req, res){
        var newArticle= new Article();
        newArticle.userId=req.user._id;
        newArticle.title=req.body.title;
        newArticle.content= req.body.content;
        var tags = req.body.tag;
        var listTags = [];
        tags.forEach(function(item){
            listTags.push(item.name);
        });
        newArticle.tag= listTags;
        newArticle.categoryId= req.body.categoryId;
        newArticle.thumbnail= "/images/uploads/articles/" + req.body.thumbnail;
        newArticle.creationDate= new Date();
        newArticle.status=1;
        newArticle.save(function(err, a) {
            if(err)
                res.send(err);
            else
                res.json(a);
        });
    });
    // process edit article
    app.post('/api/article/edit', function(req, res){
        Article.findById(req.body._id, function(err, article){
            if(err)
                res.send(err);
            article.title=req.body.title;
            article.content= req.body.content;
            var tags = req.body.tag;
            var listTags = [];
            tags.forEach(function(item){
                listTags.push(item.name);
            });
            article.tag= listTags;
            article.categoryId= req.body.categoryId;
            article.thumbnail= "/images/uploads/articles/" + req.body.thumbnail;
            article.save(function(err, a){
                if(err)
                    res.send(err);
                else
                    res.json(a);
            });
        });
    });
    //upload images
    app.post('/api/article/upload/thumbnail',function(req, res) {
      var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);
            var extension=(/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
            var strand= randtoken.generate(20);
            fstream = fs.createWriteStream('public/images/uploads/articles/'+strand+'.'+ extension);
            file.pipe(fstream);
            fstream.on('close', function (err) {
                if(err)
                    res.send(err);
                else
                    res.send(strand+'.'+extension);
            });
        });
    });
    // get detail article
    app.get('/api/article/:article_id', function(req, res) {
        Article.findById(req.params.article_id).populate('userId').exec(function(err, article){
            if (err)
                res.send(err);
            else
                res.json(article);
        });
     });
}