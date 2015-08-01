// Get /login   -- Formulario de login
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('sessions/new', {errors: errors});
};

// POST /login
exports.create = function(req, res) {

    var login = req.body.login;
    var password = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error,user) {

        if (error) {  // si hay error retornamos mensajes de error de sesión
            req.session.errors = [{"message": 'Se ha producido un error: '+error}];
            res.redirect("/login");
            return;
        }

        // Crear req.session.user y guardar campos   id  y username
        // La sesión se define por la existencia de: req.session.user
        req.session.user = {id:user.id, username:user.username, date:date };
		
		req.session.cookie.expires = new Date( Date.now() + 120000 );

        res.redirect(req.session.redir.toString());// redirección a path anterior a login
    });
};

// DELETE /logout
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect(req.session.redir.toString());
};

// Autorización
exports.userRequired = function( req, res, next ) {
	if( req.session.user ) {
		next();
	} else {
		res.redirect('/login');
	}
};
