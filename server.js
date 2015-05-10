var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/tareas');

var TareaSchema = new mongoose.Schema({
  tarea: String,
  completada: Boolean,
  prioridad: String,
  tipo: String,
  actualizada_en: { type: Date, default: Date.now },
}, {versionKey : false});
 

var Tarea = mongoose.model('Tarea', TareaSchema);
var jsonParser = bodyParser.json();
var app = express();
var opciones = {
	root : __dirname + '/'
}
app.use(express.static(__dirname + '/'));
app.set('port', process.env.PORT || 8080);
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride());


app.listen(app.get('port'), function(){
	console.log('express escuchando en port ' + app.get('port'));
});

app.get('/', function(req, res){
		res.sendFile('./index.html', opciones, function(err){
			if (err) res.send('Error al enviar el fichero');
		});
});

app.get('/tareas', function(req, res){
	Tarea.find(function(err, tareas){
		if (err) res.send(err);
		res.json(tareas);
	});
});
app.get('/tareas/:id_tarea', function(req, res){
	var id_tarea = req.params.id_tarea;
	Tarea.findById(id_tarea, function(err, tarea){
		if (err) res.send(err);
		res.json(tarea);
	});
});


app.post('/tareas', jsonParser, function(req, res){
	var tarea = req.body.tarea;
	var prioridad = req.body.prioridad;
	var tipo = req.body.tipo;
	var nueva_tarea = {
		"tarea" : tarea,
		"completada" : false,
		"prioridad" : prioridad,
		"tipo" : tipo
	};

	Tarea.create(nueva_tarea, function (err, tareas){
		if (err) res.send(err);
		Tarea.find(function (err, tareas) {
			if (err) res.send(err);
			res.json(tareas);
		});
	});
});

app.delete('/tareas/:id_tarea', function(req, res){
	Tarea.findByIdAndRemove(req.params.id_tarea, function(err, tareas){
		if (err) res.send(err);
		Tarea.find(function (err, tareas) {
			if (err) res.send(err);
			res.json(tareas);
		});
	}); 
});

app.get('*', function(req, res){
	res.sendFile('./index.html', opciones, function(err){
		if (err) res.send(err);
	});
});