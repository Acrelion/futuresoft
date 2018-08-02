var MSJS = MSJS || {};

MSJS.namespace = function ( namespace ) {

	var parts = namespace.split( "." ),
		parent = MSJS,
		i;

	if ( parts[0] === "MSJS" )
		parts = parts.slice( 1 );

	for ( i = 0, i < parts.length, ++i )
		if (typeof parent[ parts[i] ] === "undefined") 
			parent[ parts[i] ] = {}

		parent = parent[ parts[i] ];

	return parent;

}
	
