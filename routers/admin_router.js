const express = require( "express" );
const router = express.Router();
const Vacation = require( "../models/vacation" );
const User = require( "../models/user" );
const auth = require( "../authentication" );
const moment = require ( "moment" );
const path = require( "path" );

router.use( "/", auth.set_permission( ( user ) => {
	
	if ( user === undefined || user.role !== "admin" ) return false;
	return true;

} ) );

router.get( "/", function (req, res, next ) {
		
	return res.sendFile( path.join( __dirname + "/../html/admin.html" ) );

} );

router.get( "/pending", function ( req, res, next ) {
		
	var result = [];
	
	Vacation.find( { status: "pending" } ).cursor().on( "data", ( vacation ) => {

		result.push( {
			user: vacation.user,
			from: vacation.from,
			to: vacation.to,
			comment: vacation.comment,
			_id: vacation._id
		} );	

	} ).on( "end", () => {

		var counter = 0;

		if ( result.length === 0 )
			return res.send( [] );

		for ( var i = 0, length = result.length; i < length; ++i ) {
			
			( function ( i ) {	

				User.findOne( { _id: result[i].user } ).exec( ( error, user ) => {
					
					if ( error )
						next( error );
					
					result[i].user = user.name;

					counter++;
					if ( counter == result.length) res.send( result );

				} );

			} ) ( i );
		
		}
		
	});
 
} );

router.post( "/pending", function ( req, res, next ) {

	Vacation.update( { _id: req.body._id }, { $set: { status: req.body.status } } ).exec();	

} );

router.post( "/stats", function ( req, res, next ) {

	var result = [];
	
	console.log( req.body );
	
	User.find().exec( ( error, users ) => {

		index = 0;

		if ( users.length <= 1 ) res.send( {} );

		for ( let user of users ) {

			if ( user.role === "admin" ) continue;

			( function () {

				var total = 0;

				Vacation.find( { user: user._id } ).cursor().on( "data", ( vacation ) => {

					console.log( req.body.from, req.body.to );
					
					if ( vacation.status != "accepted" )
						return;

					if ( moment( vacation.to ).isBefore( req.body.from ) ) return;
					if ( moment( vacation.from ).isAfter( req.body.to ) ) return;

					if ( moment( req.body.to ).isBefore( vacation.to ) ) {
						total += moment( req.body.to ).diff( vacation.from, "days" ) + 1;
						return;
					}

					if ( moment( req.body.from ).isAfter( vacation.from ) ) {
						total += moment( vacation.to ).diff( req.body.from, "days" ) + 1;
						return;
					} 

					total += moment( vacation.to ).diff( vacation.from, "days" ) + 1;

				} ).on( "end", () => {
					result.push( { username: user.name, total: total } );
					++ index;
					if ( index === users.length - 1 )
						res.send( result );
				
				} );

			} ) ();

		}

	} ); 

} );

module.exports = router;
