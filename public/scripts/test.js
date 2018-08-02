
var pipe = MSJS.utils.pipeline.get();

pipe.add( function ( state, next ) {

	console.log( "1" );
	next();

} );

pipe.add( function ( state, next ) {

	console.log( "2" );
	next();

};

