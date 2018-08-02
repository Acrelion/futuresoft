MSJS.namespace( "MSJS.UI.pipeline" );

MSJS.UI.view = ( function () {

	"use strict"

	return {

		renderers: MSJS.utils.pipeline.get(),

		render: function ( selector, handler ) {
			this.renderers.add( handler, $( selector ));
		},

		event: function ( selector, event, handler ) {
			$( selector ).on( event, ( event ) => { handler.call( event.target, event, this.renderers.argument ); } );
		},
		
		extend: function ( child ) {
			return $.extend( true, child, this );
		}

	}

} ) ();
