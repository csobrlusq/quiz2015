var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var routes = require('./routes/index');
var session = require('express-session');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//helpers dinámicos:
app.use( function( req, res, next ) {

//	guardar path en session.redir para despues de login
	if(!req.path.match(/\/login|\/logout/)) {
		req.session.redir = req.path;
	}

//	hacer visible req.session en las vistas
	res.locals.session = req.session;
	next();
});

// Auto-logout
app.use( function( req, res, next ) {
	var now = new Date(); // captura hora actual

	if( req.session.user ) { // Comprueba si existe una sesion activa
		ref = new Date( req.session.user.date ); // Crea una fecha usando la variable de sesion almacenada
		if( now-ref >= 120000 ){ 
			res.redirect('/logout'); // Redirige a /logout, el cual destruye la sesion
			next();
		} else {
			req.session.user.date = now; // Refresca la hora en la sesion
			next();
		}
	} else {
		next();
	}
});




app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
			errors:[]
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
		errors: []
    });
});


module.exports = app;
