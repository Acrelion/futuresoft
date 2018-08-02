const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 12;

const UserSchema = new mongoose.Schema( {
	
	name: {
		type: String,
		required: true,
	},

	password: {
		type: String,
		required: true
	},

	role: String

} );

UserSchema.statics.authenticate = function ( name, password, callback ) {

	User.findOne( { name: name } ).exec( ( error, user ) => {
		
		if ( error )
			return callback( error );

		if ( !user ) {
			return callback( new Error( "User not found") );
		}
		
		bcrypt.compare( password, user.password, ( error, result ) => {
			
			if ( result === true )
				return callback( null, user )
			return callback( new Error( "Wrong password" ) );

		} );

	} );

}
			

UserSchema.pre( "save", function ( next ) {

	bcrypt.hash( this.password, saltRounds, ( error, hash ) => {

		if ( error )
			return next(error);

		console.log( hash );
		
		this.password = hash;

		next();

	} );

} );

const User = mongoose.model( "User", UserSchema );
module.exports = User;
