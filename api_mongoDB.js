const express 		= require('express');
const MongoClient 	= require('mongodb').MongoClient;
const ObjectID		= require('mongodb').ObjectID; 
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

var db;
MongoClient.connect('mongodb://miton:mdmiton321@ds239930.mlab.com:39930/n_api', (err, client) => {
	if(err) console.log(err);
	db = client.db('n_api');
});

app.get('/', (err, res) => {
	// db.createCollection('student', (err, res) => {
	// 	if(err) console.log(err)
	// 	console.log('DB Collection Created');
	// });
	res.render('index');
});

app.get('/student', (req, res) => {
	db.collection('student').find().sort({_id:-1}).toArray((err, results) => {
		if(err) console.log(err);
		res.render('student', {data:results});
	});
});

// Test Token
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
			db.collection('student').find().sort({_id:-1}).toArray((err, results) => {
				if(err) console.log(err);
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
				db.collection('student').findOneAndUpdate({_id:ObjectID(req.body.id)}, {$set:data}, (err, results) => {
					if(err) console.log(err);
					res.json({text:'Your Data Update Successfull', type:'success'});
				});
			} else {
				db.collection('student').save(data, (err, results) => {
					if(err) console.log(err);
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
				db.collection('student').findOneAndDelete({_id:ObjectID(req.body.id)}, (err, results) => {
					if(err) console.log(err);
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