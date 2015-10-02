var User = require('../data/models/user');
var nodemailer = require('nodemailer');
var randtoken = require('rand-token');
var fs = require('fs');
module.exports = function (app, passport) {
    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ithtan660@gmail.com',
            pass: 'htans2ntmtran'
        }
    });
    //change avatar
    app.post('/api/user/upload/avatar',function(req, res) {
      var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);
            var extension=(/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
            var strand= randtoken.generate(20);
            fstream = fs.createWriteStream('public/images/uploads/users/'+strand+'.'+ extension);
            file.pipe(fstream);
            fstream.on('close', function (err) {
                if(err)
                    res.send(err);
                else
                    res.send(strand+'.'+extension);
            });
        });
    });
    app.get('/api/user/edit/avatar/:avatar', function(req, res){
        User.findById(req.user._id,function(err, user){
            if(err)
                res.send(err);
            else{
                user.avatar="/images/uploads/users/"+req.params.avatar;
                user.save(function(err, user){
                    if(err)
                        res.send(err);
                    else
                        res.json(user);
                });
            }
        });
    });
    //check loggedin
    app.get('/loggedin', function(req, res) { res.send(req.isAuthenticated() ? req.user : '0'); });
     // xử lý trang đăng nhập
    app.post('/login', passport.authenticate('login'), function(req, res) {
      res.send(req.user);
    });
    // Đăng xuất
    app.get('/logout', function(req, res) {
            req.logout();
            req.session.destroy();
            res.send(200);
    });
    //Xử lý đăng nhập facebook -------------------------------
    // gửi thông tin đến facebook để yêu cầu xác thực
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // xử lý callback sau khi facebook đã xác thực user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
                successRedirect : '/',
                failureRedirect : '/login'
        }));

    // Xử lý đăng nhập qua tài khoản google ---------------------------------

    // gửi thông tin đến facebook để yêu cầu xác thực
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // xử lý callback sau khi goog đã xác thực user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/login'
        }));
    // xử lý trang đăng ký
    app.post('/register', passport.authenticate('register'), function(req, res) {
        /*Gửi thư thông báo tạo tài khoản thành công*/
        // Thiết lập nội dung thư
        var domain =req.headers.host || "mean.com";
        var mailOptions = {
            from: 'The first project abount mean <mean.com@gmail.com>', // Địa chỉ người gửi
            to: req.user.email, //Danh sách người nhận, ngăn cách nhau bằng dấu phẩy
            subject: 'Email kích hoạt tài khoản', // Tiêu đề thư
            //text: 'Hello world', // Nội dung thư dạng thường
            html: '<strong>Chúc mừng đã đăng ký thành công tài khoản tại Mean.</strong><br><p>Thông tin đăng ký</p><ul><li>Email: '+req.user.email+'</li><li>Mật khẩu: ******</li></ul><br /><p>Vui lòng kích hoạt tài khoản bằng cách nhấn &nbsp;<a href="http://' + domain + '/users/active/'+req.user._id+'/'+req.user.activeToken+'"target="_blank">vào đây</a>' // Nội dung dạng html
        };

        // gửi mail với đối tượng transporter đã được khai báo
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });
        res.send(req.user);
    });
    // get user by email
    app.post('/api/user/getUserbyEmail', function(req, res){
        User.find({email: req.body.email}, function(err, user){
            if(err)
                res.send(err);
            else
                res.send(user);
        });
    });
    // process edit user
    app.post('/api/user/edit', function(req, res){
        User.findById(req.body._id, function(err, user){
            if(err)
                res.send(err);
            var skills = req.body.skills;
            var listSkills = [];
            skills.forEach(function(item){
                listSkills.push(item.name);
            });
            user.displayname=req.body.displayname;
            user.location=req.body.location;
            user.skills = listSkills;
            user.birthday = req.body.birthday;
            user.save(function(err, u){
                if(err)
                    res.send(err);
                else
                    res.json(u);
            });
        });
    });
    // xử lý trang avtive account
    app.get('/api/user/active/:user_id/:token', function(req, res){
        User.findById(req.params.user_id,function(err, user){
            if (err)
                res.send(err);
            else{
                var token = req.params.token;
                if(user.activeToken==token)
                    user.status=1;
                user.save(function(err, u){
                    if(err)
                        res.send(err);
                    else
                        res.json(u);
                });
            }
        });
    });
    // xử lý trang profile
    app.get('/api/user/profile/:user_id', function(req, res) {
        User.findById(req.params.user_id,function(err, user){
            if (err)
                res.send(err);
            else
                res.json(user);
        });
     });
}