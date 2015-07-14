var models = require( '../models/models.js' );

// GET QUESTION
exports.question = function( req, res ) {
	models.Quiz.findAll().then(function(quiz) {
		res.render( '../views/quizes/question', { pregunta: quiz[0].pregunta } );
	})
};
// GET ANSWER
exports.answer = function ( req, res ) {
	models.Quiz.findAll().then(function(quiz) {
		if (req.query.respuesta == quiz[0].respuesta ) {
			res.render( '../views/quizes/answer', { respuesta: 'correcta' });
		} else {
			res.render( '../views/quizes/answer', { respuesta: 'incorrecta' } );
		}
	})
}
