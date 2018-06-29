const express = require( "express" );
const router = express.Router();
const User = require( "../models/user" );
const Vacation = require( "../models/vacation" );
const path = require( "path" );

router.get( "/", function ( req, res, next ) {
	
	User.findById( req.session.userId ).exec( ( error, current_user ) => {

		if ( error )
			return next( error );

		if ( current_user === null )
			return next( new Error( "Not authorized" ) );

		Vacation.find().exec( ( error, vacations ) => {

			if ( error )
				return next( error );

			if ( vacations.length === 0 )
				return res.send( { name: current_user.name, events: [] } );

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
						title: vacation.comment ? user.name + " (" + vacation.comment + ")" : user.name,
						start: vacation.from,
						end: vacation.to,
						allDay: true
					};

					events.push( event_data );
					if ( index === vacations.length ) {
						res.send( { name: current_user.name, events: events } ); 
					}

				} );
			
			}

		} );
	
	} );

} );

router.post( "/", function ( req, res, next ) {
	
	User.findById( req.session.userId ).exec( ( error, user ) => {

		if ( error )
			return next( error );

		if ( user == null ) 
			return next( new Error( "User not identified" ) );

		let vacation_data = {
			user: user,
			from: req.body.from,
			comment: (req.body.comment != "") ? req.body.comment : undefined,
			to: req.body.to
		}

		Vacation.create( vacation_data, ( error, vacation ) => {
		
			if ( error )
				return next ( error );

			res.send( { id: vacation._id } );

		} );


	} ); 

} );

router.post( "/remove", function ( req, res, next ) {
	
	Vacation.remove( { _id: req.body.id } ).exec( ( error ) => {
			
		if ( error )
			return next( error )
		
		res.sendStatus( 200 );
		

	} );
		
} );
module.exports = router;
