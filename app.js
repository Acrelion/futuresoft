const express = require( "express" );
const app = express();
const mongoose = require( "mongoose" );
const session = require( "express-session" );
const auth = require( "./authentication" );
const auth_router = require( "./routers/auth_router" );
const vac_router = require( "./routers/vacation_router" );
const admin_router = require( "./routers/admin_router" );
const path = require( "path" );

mongoose.connect ( "mongodb://localhost:27018/vacation" );

app.use( express.json() );
app.use( express.urlencoded() );

app.use( session ( {
	secret: "hello world",
	resave: true,
	saveUninitialized: false
} ) );

app.use( auth.identify_user );
app.use( "/", auth.set_permission( () => true ) );
app.post( "/", auth.authenticate );

app.use( express.static( "public" ) );

app.use( "/", auth_router );
app.use( "/vacations", vac_router );
app.use( "/admin", admin_router );


app.listen( 8080, () => console.log( "Listening on port 8080" ) );
