const express = require( "express" );
const app = express();
const mongoose = require( "mongoose" );
const session = require( "express-session" );

mongoose.connect ( "mongodb://localhost/vacation" );


app.use( express.static( "public" ) );

app.use( express.json() );
app.use( express.urlencoded() );

app.use( session ( {
	secret: "hello world",
	resave: true,
	saveUninitialized: false
} ) );

const auth = require( "./routers/auth_router" );
app.use( "/", auth );

const vac = require( "./routers/vacation_router.js" );
app.use("/vacations", vac );


app.listen( 8080, () => console.log( "Listening on port 8080" ) );
