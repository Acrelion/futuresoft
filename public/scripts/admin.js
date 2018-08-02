$( document ).ready( function () {
	"use strict"

	var view = MSJS.UI.view.extend( {} );
	var model = MSJS.UI.model.extend( { view: view } );

	view.render( "#pending_approval", MSJS.renderers.mustache );
	view.render( "#intro-text", MSJS.renderers.mustache );

	const stats_mst = $( "#stats-content" ).html();
	view.render( "#stats-content", MSJS.renderers.mustache );

	view.render( "#pending_approval", function ( state, next ) {

		console.log( state );
		
		view.event( ".pending_agree", "click", function ( event ) {

			const index = $( this ).parent().parent().index();

			model.send( "/admin/pending", { _id: state.pending[ index ]._id, status: "accepted" } );

			$( this ).parent().parent().slideUp();  
		
		} );


		view.event( ".pending_reject", "click", function ( event ) {									

			const index = $( this ).parent().parent().index();

			model.send( "/admin/pending", { _id: state.pending[ index ]._id, status: "rejected" } );  

			$( this ).parent().parent().slideUp();
		
		} );

		next();

	} );

	 view.event( "#register_btn", "click", function ( event ) {

		const password = $( "#reg_password" ).val();
		const name = $( "#reg_name" ).val();
		const password_conf = $( "#reg_password_conf" ).val();

		if( !validate_info( name, password, password_conf ) ) return;

		$.ajax( {
			url: "/",
			type: "post",
			data: {
				type: "reg",
				name: name,
				password: password,
				password_conf: password_conf
			},
			success: function ( response ) {
				message_popup.add( "Registration completed successfully." , "#8eb209" );
			},
			
		} );

	} );

	const validate_info = function ( name, password, password_conf ) {

		if ( !name || name === "" ) {
			message_popup.add( "Plase fill in your name.", "#ff1c209" );
			return false;
		}
		
		if ( !password || password === "" ) {
			message_popup.add( "Please fill in a password.", "#ff1c209" );
			return false;
		}

		if ( !password_conf || password_conf === "" ) {
			message_popup.add( "Please confirm your password.", "#ff1c209" );
			return false;
		}

		if ( password != password_conf ) {
			message_popup.add( "Passwords don't match" , "#ff1c209" );
			return false;
		}

		return true;

	}

	view.render( "#calendar", function ( state, next ) {
		
		this.fullCalendar( {
			height: "parent",
			events: state.events,
			eventRender: function ( event, element, view ) {
				if ( event.end.isBefore( moment() ) ) {
					element.css( "background-color", "#9f9f9f" );
					return;
				}
				element.css( "background-color", "#0055cc" );
			},

			eventAfterAllRender: function ( view ) {
				$( "#loader-wrapper" ).fadeOut();
			}

		} );

		next();

	} );
	
	view.render( "#stats-content", function ( state, next ) {

		console.log( "here" );

	} );
	
	model.request( "/admin/pending", function ( state, response ) {
		
		state.pending = response;	

	} );

	model.request( "/vacations", function ( state, response ) {

		state.name = response.name;
		state.events = [];
		for ( let event of response.events )
			if ( event.status === "accepted" )
				state.events.push( event );
		state.id = response.id;
		state.days = [];
		for ( let event of response.events )
			if ( event.user_id === state.id && moment( event.end ).isAfter( moment() ) )
				state.days.push( event );

		
	} );

	const stats_func = function ( state, response ) {
		console.log( response );		
	}	
	
	const stats_data = { data: { from: $( "#date-from" ).val(), to: $( "#date-to" ).val() }, method: "post" };  


	$( "[data-toggle='datepicker']" ).datepicker();

	$( "#date-to" ).datepicker( "setDate", moment().endOf( "year" ).format( "MM/DD/YYYY" ) );
	$( "#date-from" ).datepicker( "setDate", moment().startOf( "year" ).format( "MM/DD/YYYY" ) );

	$ ( "#date-from" ).datepicker( "setStartDate", new Date() );

	$( "#date-from" ).on( "pick.datepicker", ( event ) => {
		$ ( "#date-to" ).datepicker( "setStartDate", event.date );
		model.request( "/admin/stats", stats_func, stats_data );
	} );

	$( "#date-to" ).on( "pick.datepicker", ( event ) => {
		$ ( "#date-from" ).datepicker( "setEndDate", event.date );
	} );

	model.request( "/admin/stats", function ( state, response ) {
		state.stats = response;
	}, stats_data); 

} );
