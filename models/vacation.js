const mongoose = require( "mongoose" );

const VacationSchema = new mongoose.Schema( {

	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},

	from: {
		type: String,
		required: true
	},

	to: {
		type: String,
		required: true
	},

	comment: String

} );

const Vacation = mongoose.model( "Vacation", VacationSchema );
module.exports = Vacation;
