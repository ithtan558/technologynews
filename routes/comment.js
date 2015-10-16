var Comment = require('../data/models/comment');
var randtoken = require('rand-token');
var fs = require('fs');
module.exports = function (app) {
    //get all comments of user
    app.get('/api/comment/getOfUser',function(req, res) {
        Comment.find({$and: [ {status:1},{userId:req.user._id} ]}).populate('userId').exec(function(err, comment){
            if (err)
                res.send(err)
            else
                res.json(comment);
        });
     });
    //get all comments
    app.get('/api/comment/list',function(req, res) {
        Comment.find({status:1}).populate('userId').exec(function(err, comment){
            if (err)
                res.send(err)
            else
                res.json(comment);
        });
     });
    //get all comments of article
    app.get('/api/getCommentArticle/list/:article_id',function(req, res) {
        Comment.find({$and: [ {isAcepted:1},{articleId:req.params.article_id}, {child:0} ]}).populate('userId').populate('articleId').exec(function(err, comment){
            if (err)
                res.send(err)
            else
                res.json(comment);
        });
     });
    app.get('/api/getCommentChildArticle/list/:article_id',function(req, res) {
        Comment.find({$and: [ {isAcepted:1},{articleId:req.params.article_id}, {child:1} ]}).populate('userId').populate('articleId').exec(function(err, comment){
            if (err)
                res.send(err)
            else
                res.json(comment);
        });
     });
    //create comment
    app.post('/api/comment/create', function(req, res){
        var newComment= new Comment();
        newComment.userId=req.user._id;
        newComment.articleId=req.body.articleId;
        newComment.commentId= req.body.commentId;
        if(req.body.commentId){
            newComment.child= 1;
        }
        newComment.content= req.body.content;
        newComment.creationDate= new Date();
        newComment.status=1;
        newComment.save(function(err, a) {
            if(err)
                res.send(err);
            else
                res.json(a);
        });
    });
    // process edit comment
    app.post('/api/comment/edit', function(req, res){
        Comment.findById(req.body._id, function(err, comment){
            if(err)
                res.send(err);
            comment.title=req.body.title;
            comment.content= req.body.content;
            var tags = req.body.tag;
            var listTags = [];
            tags.forEach(function(item){
                listTags.push(item.name);
            });
            comment.tag= listTags;
            comment.categoryId= req.body.categoryId;
            comment.thumbnail= "/images/uploads/comments/" + req.body.thumbnail;
            comment.save(function(err, a){
                if(err)
                    res.send(err);
                else
                    res.json(a);
            });
        });
    });
    // get detail comment
    app.get('/api/comment/:comment_id', function(req, res) {
        Comment.findById(req.params.comment_id).populate('userId').exec(function(err, comment){
            if (err)
                res.send(err);
            else
                res.json(comment);
        });
     });
}