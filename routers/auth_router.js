const express = require( "express" );
const router = express.Router();
const user = require( "../models/user" );
const auth = require( "../authentication" );
const path = require( "path" );


router.get( "/", function ( req, res, next ) {
	return res.sendFile( path.join( __dirname + "/../public/login.html" ) );
} );

router.use( "/profile", auth.set_permission( ( user ) => user !== undefined ) );

router.get( "/profile", function (req, res, next) {

	if ( req.user.role === "admin" )
		res.redirect( "/admin" )
	else
		res.sendFile( path.join( __dirname + "/../public/vacations.html" ) );
			
} );

router.get( "/logout", function (req, res, next) {

	if ( !req.session ) return;

	req.session.destroy( ( error ) => {
		if ( error )
			return next( error );

		res.redirect("/");

	} );

} );

module.exports = router;
