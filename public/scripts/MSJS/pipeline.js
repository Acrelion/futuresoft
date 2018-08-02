MSJS.namespace( "MSJS.utils.pipeline" );

MSJS.utils.pipeline = ( function () {

	return {
		
		pipeline: [],

		at: 0,

		argument: {},

		end_func: () => {},

		add: function ( handler, context ) {

			context = context || this;
			this.pipeline.push( { handler: handler, context: context } );

		},

		end: function ( end ) {
			this.end_func = end;
		},

		start: function ( init ) {
		
			this.argument = init;

			console.log( init );

			var next = ( at ) => {
				if ( at === this.pipeline.length ) return this.end_func( this.argument );
				const pipe = this.pipeline[ at ];
				return () => { pipe.handler.call( pipe.context, this.argument, next( ++at ) ) };
			}
			next( 0 )();

		},

		get: function () {
			return $.extend( true, {}, this );
		}

	}

} ) ();
