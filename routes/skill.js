var Skill = require('../data/models/skill');
module.exports = function (app) {
    // get skill by status
    app.get('/api/skill/getSkills', function(req, res){
        Skill.find({status: 1}, function(err, skill){
            if(err)
                res.send(err);
            else
            	res.send(skill);
        });
    });
    // get detail skill
    app.get('/api/skill/:skill_id', function(req, res) {
        Skill.findById(req.params.skill_id, function(err, skill){
            if (err)
                res.send(err);
            else
                res.json(skill);
        });
     });
    // get detail skill
    app.get('/api/skill/getByName/:name', function(req, res) {
        Skill.find({name: req.params.name}, function(err, skill){
            if (err)
                res.send(err);
            else
                res.json(skill);
        });
     });
}
