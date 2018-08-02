
console.log( MSJS.utils.pipeline );
var pipe = MSJS.utils.pipeline.get();


pipe.add( function ( state, next ) {

	console.log( "1" );
	console.log( state );
	state.hello = "hellot";
	next();

} );

pipe.add( function ( state, next ) {

	console.log( "2" );
	console.log( state );
	next();

} );

pipe.add( function ( state, next ) {

	console.log( "3" );
	console.log( state );
	next();

} );

pipe.start( { martin: "margin:" } );

