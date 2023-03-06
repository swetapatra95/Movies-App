var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var sessions = require('express-session');


// Import path module, to work with file and directory paths
var path = require('path');
//Add Express-Handlebars (template engine) to the project
const exphbs = require('express-handlebars');
const bcrypt = require('bcryptjs')
//const jwt = require('jsonwebtoken');
//Set root folder for serving static assets
app.use(express.static(path.join(__dirname, 'public')));
// Initialize built-in middleware for urlencoding and json
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(sessions({
    secret: process.env.SESSION_SECRET_KEY,
    saveUninitialized:true,
    resave: false,
	maxAge: Date.now() + (30 * 86400 * 1000)
}));


const fetch = require('cross-fetch');


var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.engine('.hbs', exphbs.engine({ extname: '.hbs'}));
app.set('view engine', 'hbs');
 

mongoose.connect(database.url)
.then(() => {
	app.listen(port);
	console.log("App listening on port : " + port);
})
.catch((err) => {console.log(err)})

var Movie = require('./models/movie');
var User = require('./models/user');

//var accessToken = "";

const { title } = require('process');

/*
//Middleware to let user login
function login(req, res, next) {

	User.findOne({email : loginCredentials.email}, async (err, user) => {
		
		if (user) {
			if( await bcrypt.compare(loginCredentials.password, user.password)) {
				
				accessToken = jwt.sign({name : user.name, email: user.email, password: user.password}, process.env.ACCESS_TOKEN_SECRET);
				
				next();
			}
			else {
				res.render('error', {title: "Error", message: "Incorrect Password"});
			}
		}
		else {
			res.render('error', {title: "Error", message: "User not found!"});
		}
	})
}

//Middleware to Authenticate the token
function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(token == null) return res.render('error', {title: "Error", message: "Access Forbidden!"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

        if(err) return res.render('error', {title: "Error", message: "Access Forbidden!"});
        req.user = user
        next()
    })
}
*/

//Middleware that checks if user is logged in
function authorizeUser(req, res, next) {

	if(req.session.user)
		next();
	else 
		res.redirect("/login");
}

 
//get all movies data from db
app.get('/api/movies', function(req, res) {

	Movie.find().count((err, count) => {
		
		let perPage = count;
		let page = 0;
		let filter = {};

		if(req.query.page && req.query.page > 0)
			page = req.query.page;
		
		if(req.query.perPage && req.query.perPage > 0)
			perPage = req.query.perPage;
		
		let skip = page * perPage;

		if(req.query.title) {
			let title = req.query.title;
			let regex = new RegExp(title, "i");

		filter = {title: regex};
		}
		
		Movie.find(filter, {},  {skip: skip, limit: perPage, sort: {_id: 1}}, (err, movies) => {
			if (err)
				res.send(err)
 
			res.json(movies);
		});
	});

	
});

// get a movie from db by its id
app.get('/api/movies/:id', function(req, res) {
	let id = req.params.id;
	Movie.findById(id, function(err, movie) {
		if (err)
			res.send(err)
 
		res.json(movie);
	});
 
});

//Insert a new movie to the db
app.post('/api/movies',  function(req, res) {
	
	let genres, cast, languages, countries, directors, writers;

	if(req.body.genres)
		genres = req.body.genres.split(",");

	if(req.body.cast)
		cast = req.body.cast.split(",");

	if(req.body.languages)
		languages = req.body.languages.split(",");

	if(req.body.countries)
		countries = req.body.countries.split(",");
	
	if(req.body.directors)
		directors = req.body.directors.split(",");

	if(req.body.writers)
		writers = req.body.writers.split(",");

	Movie.create({
		plot: req.body.plot,
		genres: genres,
		runtime: req.body.runtime,
		rated: req.body.rated,
		cast: cast,
		num_mflix_comments: req.body.num_mflix_comments,
		poster: req.body.poster,
		title: req.body.title,
		metacritic: req.body.metacritic,
		fullplot: req.body.fullplot,
		languages: languages,
		countries: countries,
		released: req.body.released,
		directors: directors,
		writers: writers,
		awards: {
		  wins: req.body.awards_wins,
		  nominations: req.body.awards_nominations,
		  text: req.body.awards_text
		},
		lastupdated: req.body.lastUpdated,
		year: req.body.year,
		imdb: {
		  rating: req.body.imdb_rating,
		  votes: req.body.imdb_votes,
		  id: req.body.imdb_id
		},
		type: req.body.type,
		tomatoes: {
		  viewer: {
			rating: req.body.tomatoes_viewer_rating,
			numReviews: req.body.tomatoes_viewer_numReviews,
			meter: req.body.tomatoes_viewer_meter
		  },
		  dvd: req.body.tomatoes_dvd,
		  critic: {
			rating: req.body.tomatoes_critic_rating,
			numReviews: req.body.tomatoes_critic_numReviews,
			meter: req.body.tomatoes_critic_meter
		  },
		  lastUpdated: req.body.tomatoes_lastUpdated,
		  boxOffice: req.body.tomatoes_boxOffice,
		  website: req.body.tomatoes_website,
		  consensus: req.body.tomatoes_consensus,
		  rotten: req.body.tomatoes_rotten,
		  production: req.body.tomatoes_production,
		  fresh: req.body.tomatoes_fresh
		}
	}, function(err, movies) {
		if (err)
			res.render('error', { title: 'Error', message:'Something went wrong! Please try again later' });
		res.redirect('/');
	});
});

//Create mongose method to update an existing record into collection
app.put('/api/movies/:Id', function(req, res) {
	
	let genres, cast, languages, countries, directors, writers;

	if(req.body.genres)
		genres = req.body.genres.split(",");

	if(req.body.cast)
		cast = req.body.cast.split(",");

	if(req.body.languages)
		languages = req.body.languages.split(",");

	if(req.body.countries)
		countries = req.body.countries.split(",");
	
	if(req.body.directors)
		directors = req.body.directors.split(",");

	if(req.body.writers)
		writers = req.body.writers.split(",");

	let data = 
	{plot: req.body.plot,
	genres: genres,
	runtime: req.body.runtime,
	rated: req.body.rated,
	cast: cast,
	num_mflix_comments: req.body.num_mflix_comments,
	poster: req.body.poster,
	title: req.body.title,
	metacritic: req.body.metacritic,
	fullplot: req.body.fullplot,
	languages: languages,
	countries: countries,
	released: req.body.released,
	directors: directors,
	writers: writers,
	awards: {
	  wins: req.body.awards_wins,
	  nominations: req.body.awards_nominations,
	  text: req.body.awards_text
	},
	lastupdated: req.body.lastUpdated,
	year: req.body.year,
	imdb: {
	  rating: req.body.imdb_rating,
	  votes: req.body.imdb_votes,
	  id: req.body.imdb_id
	},
	type: req.body.type,
	tomatoes: {
	  viewer: {
		rating: req.body.tomatoes_viewer_rating,
		numReviews: req.body.tomatoes_viewer_numReviews,
		meter: req.body.tomatoes_viewer_meter
	  },
	  dvd: req.body.tomatoes_dvd,
	  critic: {
		rating: req.body.tomatoes_critic_rating,
		numReviews: req.body.tomatoes_critic_numReviews,
		meter: req.body.tomatoes_critic_meter
	  },
	  lastUpdated: req.body.tomatoes_lastUpdated,
	  boxOffice: req.body.tomatoes_boxOffice,
	  website: req.body.tomatoes_website,
	  consensus: req.body.tomatoes_consensus,
	  rotten: req.body.tomatoes_rotten,
	  production: req.body.tomatoes_production,
	  fresh: req.body.tomatoes_fresh
	}
}

	// save the movie
	Movie.findByIdAndUpdate({_id:req.params.Id}, data).then(function(err, movie) {
	

	res.send('Successful! Movie has been Updated.');
	}).catch((err) => res.send(err));
});


//Delete record
app.delete('/api/movies/:Id', function(req,res)
{
    Movie.findByIdAndRemove({_id:req.params.Id}).then(function(result)
    {
        console.log(result.toString());
        res.send('Successful! Movie has been Deleted.');
    })
    .catch((err) => res.send(err));

});






//Render Insert Movie Form
app.get('/addMovie', authorizeUser, (req, res) => {

	res.render('addMovieForm', {title: "Movies App - Add Movie", loggedIn: req.session.user});
});

//Render Update Movie Form
app.get('/updateMovie/:id', (req, res) => {
	let id = req.params.id;
	Movie.findById(id, function(err, movie) {
		if (err)
			res.render('error', { title: 'Error', message:'Something went wrong! Please try again later' });
 
		res.render('updateMovieForm', {title: "Movies App - Update Movie", data: JSON.parse(JSON.stringify(movie)), loggedIn: req.session.user});
	});
});

//Render Show Movies Page
app.get('/', function(req, res) {
	
	let page = req.query.page;
	let perPage = req.query.perPage;
	let title = req.query.title;
	
	if(!page) {
		page = 0;
	}

	if(!perPage) {
		perPage = 10;
	}

	if(!title) {
		title = "";
	}

	let regex = new RegExp(title, "i");

	let filter = {title: regex};

	Movie.find(filter).count((err, count) => {

		let url = "://" + req.headers.host + "/api/movies?perPage=" 
				+ perPage + "&page=" + page + "&title=" + title;

		if(req.headers.host == "localhost:" + port)
			url = "http" + url;
		else 
			url = "https" + url;
		
		/*
		//Headers with the JWT
		let myHeaders =  new fetch.Headers()
		myHeaders.append('Content-Type','application/json; charset=utf-8');
		myHeaders.append('Authorization', 'Bearer ' + accessToken);
		*/
		
		fetch(url)	//Sending JWT with the fetch request
		.then((response) => response.json())
		.then((jsonData) => {
			
			res.render('showMovies', {data: jsonData, totalPages: (Math.ceil(count/perPage) - 1), loggedIn: req.session.user});
		})
		.catch(function (err) {
			console.log("Unable to fetch -", err);
			res.render('error', { title: 'Error', message: "Access Denied!" });
		});
	});

});

//Render Movie Details Page
app.get('/movieDetails/:id', (req, res) => {
	let id = req.params.id;
	Movie.findById(id, function(err, movie) {
		if (err)
			res.render('error.hbs', { title: 'Error', message:'Something went wrong! Please try again later' } );
 
		res.render('movieDetails', {title: "Movies App - Movie Details", data: JSON.parse(JSON.stringify(movie)), loggedIn: req.session.user});
	});
});

//Render Login Page
app.get('/login', function(req, res) {
	res.render('login', {layout: false, loggedIn: req.session.user});   //Render login.hbs
});

app.post('/loginUser', function(req, res) {

	let email = req.body.email;
	let password = req.body.password;


	User.findOne({email : email}, async (err, user) => {
		
		if (user) {
			if( await bcrypt.compare(password, user.password)) {
				
				//accessToken = jwt.sign({name : user.name, email: user.email, password: user.password}, process.env.ACCESS_TOKEN_SECRET);
				req.session.user = user;
				res.redirect("/");
			}
			else {
				res.render('error', {title: "Error", message: "Incorrect Password"});
			}
		}
		else {
			res.render('error', {title: "Error", message: "User not found!"});
		}
	})

});

app.get('/logout', function(req, res) {

	req.session.destroy();
	res.redirect("/");
});


//Wrong route
app.get('*', function(req, res) {
	res.status(404).render('error', { title: 'Error', message:'Wrong Route' });   //Render error.hbs
});



