MSJS.namespace( "MSJS.renderers.mustache" );

MSJS.renderers.mustache = function ( state, next ) {
	console.log( state );
	var template = this.html();
	Mustache.parse( template );
	this.html( Mustache.render( template, state ) );
	next();

}
