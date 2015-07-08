// GET QUESTION
exports.question = function( req, res ) {
	res.render( '../views/quizes/question', { pregunta: 'Capital de Italia' } );
};
// GET ANSWER
exports.answer = function ( req, res ) {
	if (req.query.respuesta == "Roma") {
		res.render( '../views/quizes/answer', { respuesta: 'correcta' });
	} else {
		res.render( '../views/quizes/answer', { respuesta: 'incorrecta' } );
	}
}
