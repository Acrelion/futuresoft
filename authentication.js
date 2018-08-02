const express = require( "express" );
const router = express.Router();
const user = require( "./models/user" );
const path = require( "path" );


/**
* Middleware that sets the req.user variable to the current logged in user according to the session,
* or leaves it undefined if there is no such
*/

const identify_user = function ( req, res, next ) {

	if ( req.session.user_id === undefined ) return next();

	user.findById( req.session.user_id ).exec( ( error, user ) => {
		
		if ( error )
			return next( error );

		if ( user === null )
			return next();

		req.user = user;
		next();

	} );

}

/**
* Middle warethat accepts a callback to which it supplies the current user ( can be undefined if there isn't one )
* and calls next if the callback returns true or sends a 401 Not authorized error if callback return false
*/

const set_permission = function ( callback ) { 
	
	return function ( req, res, next ) {
		
		if ( callback ( req.user ) ) 
			return next();

		return next ( new Error( "Not authorized" ) );

	}

}

const registration = function ( req, res, next ) {

	if ( req.body.type !== "reg" ) return next();

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
	
	next();	
}

const login = function ( req, res, next ) {

	if ( req.body.type !== "log" ) return next(); 

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

		req.session.user_id = user._id;
		res.sendStatus( 200 );
		return next();

	} );

};

module.exports = {
	identify_user: identify_user,
	set_permission: set_permission,
	authenticate: [ registration, login ]
};
