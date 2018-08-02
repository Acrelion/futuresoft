MSJS.namespace( "MSJS.utils.pipeline" );

MSJS.utils.pipeline = ( function () {

	return {
		
		pipeline: [],

		at: 0,

		argument: {},

		add: function ( handler ) {

			pipeline.push( handler );

		},

		start: function () {

			var next = () => { pipeline[ at++ ]( argument, next ) };
			pipeline[ at ]( argument, next );
			++at;

		},

		get: () => { this.clone() };

	}

} );
