var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var app = express();

mongoose.connect("mongodb://localhost/mitur");

app.set("view engine","jade");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//DataBase
var empresaSchema = {
	usuario:String,
	nombre:String,
	slogan:String,
	imagen:String,
	descripcion:String,
	telefono:String,
	direccion:String,
	correo:String,
	web:String,
	tipo:String,
	latitud:String,
	longitud:String
}

var usuarioSchema = {
	username:String,
	contraseña:String,
	correo:String,
	tipo:String,
	estado:Boolean
}

var votoSchema = {
	usuario:String,
	empresa:String,
	voto:String
}

var productoSchema = {
	nombre:String,
	foto:String,
	descripcion:String,
	precio:Number
}

var imagenSchema = {
	producto:String,
	imagen:String
}

var Empresa = mongoose.model("Empresa",empresaSchema);

var Usuario = mongoose.model("Usuario",usuarioSchema);

var Voto = mongoose.model("Voto",votoSchema);

var Producto = mongoose.model("Producto",productoSchema);

var Imgen = mongoose.model("imagen", imagenSchema);

app.get("/",function (solicitud, respuesta) {
	/*var data={
		nombre:"mitur",
		slogan:"Encuentra lo mejor",
		imagen:"logo.png",
		descripcion:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum dolor, excepturi alias eius quidem reprehenderit dicta dolores hic quibusdam eveniet in ipsa, animi accusamus obcaecati iste corrupti quia officia consectetur?",
		telefono:"3175227672",
		direccion:"Calle 1 # 11-30",
		correo:"edwaramayadiaz@gmail.com",
		web:"mitur.co"
	}
	var empresa = new Empresa(data);
	empresa.save(function(err){
		console.log(empresa);
	});*/
	respuesta.render("frontend/index");
});

//Empresas
app.get("/empresa/new",function (solicitud, respuesta) {
	respuesta.render("backend/empresa");
});

app.post("/empresa",function (solicitud, respuesta) {
	//Logica para guardar el registro
	var data={
		nombre:solicitud.body.nombre,
		slogan:solicitud.body.slogan,
		imagen:solicitud.body.imagen,
		descripcion:solicitud.body.descripcion,
		telefono:solicitud.body.telefono,
		direccion:solicitud.body.direccion,
		correo:solicitud.body.correo,
		web:solicitud.body.web,
		latitud:solicitud.body.latitud,
		longitud:solicitud.body.longitud
	}
	var empresa = new Empresa(data);
	empresa.save(function(err){
		console.log(empresa);
		respuesta.render("backend/empresas");
	});
});

app.get("/empresas",function (solicitud, respuesta) {
	respuesta.render("backend/empresas");
});

//Productos
app.get("/producto/new",function (solicitud, respuesta) {
	respuesta.render("backend/producto");
});

app.post("/producto",function (solicitud, respuesta) {
	//Logica para guardar el registro
	var data={
		nombre:solicitud.body.nombre,
		foto:solicitud.body.slogan,
		descripcion:solicitud.body.imagen,
		precio:solicitud.body.descripcion
	}
	var producto = new Producto(data);
	producto.save(function(err){
		console.log(producto);
		respuesta.render("backend/productos");
	});
});

app.get("/productos",function (solicitud, respuesta) {
	respuesta.render("backend/productos");
});

//imagenes
app.get("/imagen/new",function (solicitud, respuesta) {
	respuesta.render("backend/imagen");
});

app.post("/imagen",function (solicitud, respuesta) {
	//Logica para guardar el registro
	respuesta.render("backend/imagenes");
});

app.get("/imagenes",function (solicitud, respuesta) {
	respuesta.render("backend/imagenes");
});

//gets del frontend

//Historia
app.get("/historia",function (solicitud, respuesta) {
	respuesta.render("frontend/historia");
});

//Misión
app.get("/mision",function (solicitud, respuesta) {
	respuesta.render("frontend/mision");
});

//Visión
app.get("/vision",function (solicitud, respuesta) {
	respuesta.render("frontend/vision");
});

//Usuario new
app.get("/usuario/new",function (solicitud, respuesta) {
	respuesta.render("frontend/usuario");
});

//Usuarios
app.get("/usuarios",function (solicitud, respuesta) {
	respuesta.render("frontend/usuarios");
});

//Posts del frontend

app.post("/usuario",function (solicitud, respuesta) {
	//Logica para guardar el registro
	var data={
		username:solicitud.body.usuario,
		contraseña:solicitud.body.contraseña,
		correo:solicitud.body.correo,
		tipo:solicitud.body.tipo,
		estado:solicitud.body.estado
	}
	var usuario = new Usuario(data);
	usuario.save(function(err){
		console.log(usuario);
		respuesta.render("index");
	});
	respuesta.render("frontend/usuarios");
});

app.post("/login",function (solicitud, respuesta) {
	respuesta.render("frontend/index");
});

app.post("/contactanos",function (solicitud, respuesta) {
	respuesta.render("frontend/index");
});

app.post("/buscar",function (solicitud, respuesta) {

	respuesta.render("frontend/buscar");
});

app.listen(8080);