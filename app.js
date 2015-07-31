var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');

var app = express();

mongoose.connect("mongodb://localhost/mitur");
app.set('port', process.env.PORT || 8080);
app.set("view engine","jade");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressSession({
	secret:process.env.SESSION_SECRET || 'secret',
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  Usuario.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    // check in mongo if a user with username exists or not
    Usuario.findOne({ 'username' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false);                 
        }
        // User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false);
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
}));

passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    findOrCreateUser = function(){
      // find a user in Mongo with provided username
      Usuario.findOne({'username':username},function(err, user) {
        // In case of any error return
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false);
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new Usuario();
          // set the user's local credentials
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.correo = req.param('correo');
 
          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
            }
            console.log('User Registration succesful');    
            return done(null, newUser);
          });
        }
      });
    };
     
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }));
// Validad contraseña
var isValidPassword = function(user, password){
	return bCrypt.compareSync(password, user.password);
}
// Generates hash using bCrypt
var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


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
	username:{ type: String, required: true, unique: true },
	password:{ type: String, required: true },
	correo:String,
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

app.get("/", function (solicitud, respuesta) {
	console.log(solicitud.isAuthenticated())
	respuesta.render("frontend/index",{isAuthenticated:solicitud.isAuthenticated()});
});

//Empresas
app.get("/empresa/new",function (solicitud, respuesta) {
	respuesta.render("backend/empresa",{isAuthenticated:solicitud.isAuthenticated()});
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
		respuesta.render("backend/empresas",{isAuthenticated:solicitud.isAuthenticated()});
	});
});

app.get("/empresas",function (solicitud, respuesta) {
	respuesta.render("backend/empresas",{isAuthenticated:solicitud.isAuthenticated()});
});

//Productos
app.get("/producto/new",function (solicitud, respuesta) {
	respuesta.render("backend/producto",{isAuthenticated:solicitud.isAuthenticated()});
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
		respuesta.render("backend/productos",{isAuthenticated:solicitud.isAuthenticated()});
	});
});

app.get("/productos",function (solicitud, respuesta) {
	respuesta.render("backend/productos",{isAuthenticated:solicitud.isAuthenticated()});
});

//imagenes
app.get("/imagen/new",function (solicitud, respuesta) {
	respuesta.render("backend/imagen",{isAuthenticated:solicitud.isAuthenticated()});
});

app.post("/imagen",function (solicitud, respuesta) {
	//Logica para guardar el registro
	respuesta.render("backend/imagenes",{isAuthenticated:solicitud.isAuthenticated()});
});

app.get("/imagenes",function (solicitud, respuesta) {
	respuesta.render("backend/imagenes",{isAuthenticated:solicitud.isAuthenticated()});
});

//gets del frontend

//Historia
app.get("/historia",function (solicitud, respuesta) {
	respuesta.render("frontend/historia",{isAuthenticated:solicitud.isAuthenticated()});
});

//Misión
app.get("/mision",function (solicitud, respuesta) {
	respuesta.render("frontend/mision",{isAuthenticated:solicitud.isAuthenticated()});
});

//Visión
app.get("/vision",function (solicitud, respuesta) {
	respuesta.render("frontend/vision",{isAuthenticated:solicitud.isAuthenticated()});
});

//Usuario new
app.get("/usuario/new",function (solicitud, respuesta) {
	respuesta.render("frontend/usuario",{isAuthenticated:solicitud.isAuthenticated()});
});

//Usuarios
app.get("/usuarios",function (solicitud, respuesta) {
	respuesta.render("frontend/usuarios",{isAuthenticated:solicitud.isAuthenticated()});
});

//Posts del frontend

app.post('/usuario/new', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/usuario/new'
  }));

app.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/usuario/new'
  }));

app.post("/contactanos",function (solicitud, respuesta) {
	respuesta.render("frontend/index",{isAuthenticated:solicitud.isAuthenticated()});
});

app.post("/buscar",function (solicitud, respuesta) {

	respuesta.render("frontend/buscar",{isAuthenticated:solicitud.isAuthenticated()});
});

app.post("/enviar",function (solicitud, respuesta){
	// create reusable transporter object using SMTP transport
	var transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: {
	        user: 'miturcolombia@gmail.com',
	        pass: 'controlmitur'
	    }
	});

	// NB! No need to recreate the transporter object. You can use
	// the same transporter object for all e-mails

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: solicitud.body.usuario+' ✔ <'+solicitud.body.remitente+'>', // sender address
	    to: solicitud.body.destinatario, // list of receivers
	    subject: solicitud.body.asunto+' ✔', // Subject line
	    text: solicitud.body.mensaje, // plaintext body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
		var mensage = "";
		var estado = true;
		var post = true;
	    if(error){
	        console.log(error);
	        mensage = "Error al enviar el correo";
	        estado = false;
	    }else{
	        console.log('Message sent: ' + info.response);
	        mensage = "Mensage enviado...";
	    }
	    respuesta.render("frontend/index",{Mensage:mensage,Estado:estado,Post:post})
	});
	});

	app.get('/salir', function(req, res) {
	  req.logout();
	  res.redirect('/');
	});

	app.listen(app.get('port'), function(){
	  console.log(("Express server listening on port " + app.get('port')))
});