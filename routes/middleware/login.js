
module.exports =  {
    loggedIn : function  (req, res, next) {
      if (req.session && req.session.user) {
        return res.redirect('/');
      }
      next();
    },
    notLoggedIn : function  (req, res, next) {
      if (!(req.session && req.session.user)) {
        return res.redirect('/register_login');
      }
      next();
    }
}
