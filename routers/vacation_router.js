const express = require( "express" );
const router = express.Router();
const User = require( "../models/user" );
const Vacation = require( "../models/vacation" );
const auth = require( "../authentication" );
const path = require( "path" );

router.use( "/", auth.set_permission( ( user ) => user !== undefined ) );

router.get( "/", function ( req, res, next ) {

	Vacation.find().exec( ( error, vacations ) => {

		if ( error )
			return next( error );

		if ( vacations.length === 0 )
			return res.send( { name: req.user.name, events: [] } );

		let events = [],
			index = 0;

		for ( let vacation of vacations ) {

			User.findById( vacation.user ).exec( ( error, user ) => {
				++index;
				
				if ( error )
					return next( error );

				if ( !user )
					return next( new Error("Unknown user") );

				let event_data = {
					id: vacation._id,
					user_id: user._id,
					title: vacation.comment ? user.name + " (" + vacation.comment + ")" : user.name,
					start: vacation.from,
					end: vacation.to,
					status: vacation.status,
					allDay: true
				};

				events.push( event_data );
				if ( index === vacations.length ) {
					res.send( { name: req.user.name, id: req.user._id, events: events } ); 
				}

			} );
		
		}

	} );

} );

router.post( "/", function ( req, res, next ) {
	
	let vacation_data = {
		user: req.user,
		from: req.body.from,
		comment: (req.body.comment != "") ? req.body.comment : undefined,
		to: req.body.to,
		status: "pending"
	}

	Vacation.create( vacation_data, ( error, vacation ) => {
	
		if ( error )
			return next ( error );

		res.send( { id: vacation._id } );

	} );

} );

router.post( "/remove", function ( req, res, next ) {

	console.log( req.body );
	
	Vacation.remove( { _id: req.body.id } ).exec( ( error ) => {
			
		if ( error )
			return next( error )
		
		res.sendStatus( 200 );
		

	} );
		
} );
module.exports = router;
