const express 		= require('express');
const mysql 		= require('mysql'); 
const bodyParser 	= require('body-parser');
const exphbs		= require('express-handlebars');

const JWT 			= require('jsonwebtoken');
const JWT_SECRET 	= require('./config');

const app 			= express();
const port 			= 3200;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Handlebars Middleware
app.engine('.hbs', exphbs({
	defaultLayout:'main',
	extname:'.hbs',
	helpers:{
    // Function to do basic mathematical operation in handlebar
    math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    }
}}));

app.set('view engine', '.hbs');

app.use(express.static('public'));

app.listen(port, () => {
	console.log('Server is runing - http://localhost:'+port);
});

apiToken = () => {
	return token = JWT.sign({
		sub:"apiAuthentication",
		name:"Mehediul Hassan Miton",
		iat:new Date().getTime()
	}, JWT_SECRET);
}

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "node_api"
});

con.connect(function(err) {
  if (err) console.log(err);
  console.log("Connected mysql!");
});

app.get('/', (err, res) => {
	// db.createCollection('student', (err, res) => {
	// 	if(err) console.log(err)
	// 	console.log('DB Collection Created');
	// });
	res.render('index', {token:apiToken()});
});

app.get('/student', (req, res) => {
	con.query("SELECT * FROM student ORDER BY id DESC", (err, results) => {
		if(err) console.log(err);
		res.render('student', {data:results, token:apiToken()});
	});
});

//Test Token
app.post('/token', (req, res) => {
	if(req.body.token)
	{
		JWT.verify(req.body.token, JWT_SECRET, (err, decoded) => {
			if(err) res.json({err:err, text:'Your Token Is Invalid', type:'error', token:apiToken()});
			res.json({text:'Your Token Is Valid', type:'success', token:apiToken()});
		});
	} else {
		res.json({text:'Your Have No Token', type:'error', token:apiToken()});
	}
});

app.post('/data_list', (req, res) => {
	if(req.body.token)
	{
		JWT.verify(req.body.token, JWT_SECRET, (err, decoded) => {
			if(err) res.json({err:err, text:'Your Token Is Invalid', type:'error', token:apiToken()});
			con.query("SELECT * FROM student ORDER BY id DESC", (err, results) => {
				if (err) console.log(err);
				res.json(results);
			});
		});
	} else {
		res.json({text:'Your Have No Token', type:'error', token:apiToken()});
	}
});

app.post('/save', (req, res) => {
	if(req.body.token)
	{
		JWT.verify(req.body.token, JWT_SECRET, (err, decoded) => {
			if(err) res.json({err:err, text:'Your Token Is Invalid', type:'error', token:apiToken()});
			var data = {
				name:req.body.name,
				mobile:req.body.mobile,
				email:req.body.email,
				address:req.body.address,
			}

			if(req.body.id)
			{
				con.query("UPDATE student SET ? WHERE id = ?", [data,req.body.id], (err, results) => {
					if (err) console.log(err);
					res.json({text:'Your Data Update Successfull', type:'success'});
				});
			} else {
				con.query("INSERT INTO student set ?", data, (err, results) => {
					if (err) console.log(err);
					res.json({text:'Your Data Save Successfull', type:'success'});
				});
			}
		});
	} else {
		res.json({text:'Your Have No Token', type:'error', token:apiToken()});
	}
});

app.delete('/destroy', (req, res) => {
	if(req.body.token)
	{
		JWT.verify(req.body.token, JWT_SECRET, (err, decoded) => {
			if(err) res.json({err:err, text:'Your Token Is Invalid', type:'error', token:apiToken()});
			if(req.body.id)
			{
				con.query("DELETE FROM student WHERE id = ?",req.body.id,(err, results) => {
					if (err) console.log(err);
					res.json({text:'Your Data Delete Successfull', type:'success'});
				});
			} else {
				res.json({text:'Your ID Not Found !!!', type:'error'});
			}
		});
	} else {
		res.json({text:'Your Have No Token', type:'error', token:apiToken()});
	}
});

app.post('/edit_data', (req, res) => {
	if(req.body.token)
	{
		JWT.verify(req.body.token, JWT_SECRET, (err, decoded) => {
			if(err) res.json({err:err, text:'Your Token Is Invalid', type:'error', token:apiToken()});
			con.query("SELECT * FROM student WHERE id = ?",req.body.id,(err, results) => {
				if (err) console.log(err);
				res.json(results);
			});
		});
	} else {
		res.json({text:'Your Have No Token', type:'error', token:apiToken()});
	}
});