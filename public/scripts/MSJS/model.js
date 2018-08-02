MSJS.UI.model = MSJS.namespace( "MSJS.UI.model" );

MSJS.UI.model = ( function () {

	return {
		
		view: MSJS.UI.view.extend( {} ),

		state: {},

		pending: 0,

		request: function ( path, handler, opts ) {

			++this.pending;
			
			var opts = ( opts ) ? opts :{ data: {}, method: "get" };

			console.log( opts );

			$.ajax( {
	
				url: path,
				type: opts.method,
				data: opts.data,
				success: ( response ) => { 
					handler( this.state, response );
					--this.pending;
					if ( this.pending == 0 ) this.view.renderers.start( this.state );
				}

			} );

		},

		send: function( path, data ) {
			
			$.ajax( {
				
				url: path,
				type: "post",
				data: data

			} );
	
		},

		extend: function ( child ) {
			return $.extend( true, child, this );
		} 

	}	

} ) ();
