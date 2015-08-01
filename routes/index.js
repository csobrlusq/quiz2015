var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);

// Definición de rutas de sesion
router.get('/login',sessionController.new );
router.post('/login',	sessionController.create );
router.get('/logout',	sessionController.destroy );

// Definicion de rutas de /quizes
router.get( '/quizes', quizController.index );
router.get( '/quizes/:quizId(\\d+)',quizController.show );
router.get( '/quizes/:quizId(\\d+)/answer', quizController.answer );

router.get( '/author', function( req,res ) {
	res.render( 'author' , {errors: []});
});

// Crear preguntas
router.get( '/quizes/new', sessionController.userRequired, quizController.new );
router.post( '/quizes/create', sessionController.userRequired, quizController.create );

// Modificar preguntas
router.get( '/quizes/:quizId(\\d+)/edit', sessionController.userRequired, quizController.edit);
router.put( '/quizes/:quizId(\\d+)', sessionController.userRequired, quizController.update);

// Eliminar preguntas
router.delete( '/quizes/:quizId(\\d+)', sessionController.userRequired, quizController.destroy );

// Comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.userRequired, commentController.publish);

module.exports = router;
