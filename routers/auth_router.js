const express = require( "express" );
const router = express.Router();
const user = require( "../models/user" );
const path = require( "path" );


router.get( "/", function ( req, res, next ) {
	return res.sendFile( path.join( __dirname + "/../public/login.html" ) );
} );

router.post( "/", function( req, res, next ) {

	// REGISTRATION

	if ( req.body.type === "reg" ) {

		let error_msg = undefined;

		if ( ! ( req.body.name && req.body.password && req.body.password_conf ) )
			error_msg = "Insufficient data"; 

		if ( req.body.reg_password != req.body.reg_password_conf )
			error_msg = "Passwords don't match";

		if( req.body.name === "" || req.body.password === "" || req.body.password_conf === "" )
			error_msg = "Incorrect data";

		if ( error_msg ) {
			let error = new Error( error_msg );
			error.status = 400;
			res.sendStatus( 400 );
			return next( error );
		}

		// Everything all right by this point

		res.sendStatus( 200 );

		let user_data = {
			name: req.body.name,
			password: req.body.password
		}

		user.create( user_data, ( error, user ) => {
			
			if ( error )
				return next ( error );

		} );
		
		return next();	
		
	}

	// LOG IN

	if ( req.body.type === "log" ) {

		let error_msg = undefined;

		if ( ! ( req.body.name && req.body.password ) )
			error_msg = "Insufficient data"; 

		if( req.body.name === "" || req.body.password === "" )
			error_msg = "Incorrect data";

		if ( error_msg ) {
			let error = new Error( error_msg );
			error.status = 400;
			res.sendStatus( 400 );
			return next( error );
		}

		// Everything all right by this point

	    user.authenticate( req.body.name, req.body.password, ( error, user ) => {
			
			if ( error || !user ) {
				res.sendStatus( 400 );
				return next();
			}

			req.session.userId = user._id;
			res.sendStatus( 200 );
			return next();

		} );
	
	}	
	
} );

router.get( "/profile", function (req, res, next) {

	user.findById( req.session.userId ).exec( ( error, user ) => {
		
		if ( error )
			return next( error );

		if ( user === null )
			return next( new Error( "Not authorized" ) );

		res.sendFile( path.join( __dirname + "/../public/vacations.html" ) );
			
	} );

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
