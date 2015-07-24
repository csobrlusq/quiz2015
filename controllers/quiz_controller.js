var models = require( '../models/models.js' );

// Autoload factoriza el código si ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next( new Error('No existe quizId = ' + quizId));
			}
		}
	).catch( function( error ) { next( error ); });
}

// GET /quizes
exports.index = function(req, res) {
	if (req.query.search) { // Si hay un parametro search
		// Remplaza el principio del string, los espacios, y el fin del string con % y lo guarda en la variable search
		var search = req.query.search.replace(/^\b|\s|\b$/g, '%');
		models.Quiz.findAll({ where: [ "pregunta like ?", search ]}).then( function( quizes ) {
			res.render( 'quizes/index', { quizes: quizes, errors: [] });}
		).catch(function(error) { next(error); });
	} else {
		models.Quiz.findAll().then( function( quizes ) {
			res.render( 'quizes/index', { quizes: quizes, errors: [] });}
		).catch(function(error) { next(error); });
	}
};

// GET /quizes/:id
exports.show = function( req, res ) {
	res.render( 'quizes/show', { quiz: req.quiz, errors: []} );
};

// GET ANSWER
exports.answer = function ( req, res ) {
	var resultado = 'incorrecta';
	if ( req.query.respuesta === req.quiz.respuesta ) {
		resultado = 'correcta';
	}
	res.render( 'quizes/answer', 
		{ 	quiz: req.quiz, 
			respuesta: resultado, 
			errors: []
		} 
	);
};

// GET /quizes/new
exports.new = function( req, res ) {
	var quiz = models.Quiz.build( // crear objeto quiz
		{ tema: "Tema", pregunta: 'Pregunta', respuesta: 'Respuesta' }
	);
	res.render( 'quizes/new', { quiz: quiz, errors: []});
};

// GET /quizes/:quizId/edit
exports.edit = function(req, res) {
	var quiz = req.quiz;
	res.render( 'quizes/edit', { quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function (req,res) {
	var quiz = models.Quiz.build ( req.body.quiz );
	quiz
	.validate()
	.then(
		function(err) {
			if (err) {
				res.render('/quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				// Guarda los campos pregunta y respuesta
				quiz
				.save({ fields: [ "tema", "pregunta", "respuesta" ]})
				.then(function(){ res.redirect('/quizes'); });
			}
		}
	);
};

// PUT /quizes/:quizId
exports.update = function (req,res) {
	req.quiz.pregunta = req.body.quiz.pregunta; //en post viaja en body
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz
	.validate()
	.then(
		function(err) {
			if (err) {
				res.render('quizes/edit', {quiz:req.quiz, errors: err.errors});
			} else {
				req.quiz
				.save({fields: [ "tema", "pregunta", "respuesta"]})
				.then( function() { res.redirect('/quizes');});
			}
		}
	);
}

// DELETE /quizes/:quizId
exports.destroy = function (req,res) {
	req.quiz.destroy()
	.then(
		function(err) {
			res.redirect('/quizes');
		}
	)
	.catch(function(error) {next(error)});
};
