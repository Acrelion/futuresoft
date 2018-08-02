$( document ).ready( function () {
	"use strict";

	var events = undefined;

	var view = MSJS.UI.view.extend( {} );
	var model = MSJS.UI.model.extend( { view: view } );

	view.render( "#dates-off", MSJS.renderers.mustache );

	view.render( "#dates-off-content", function( state, next ) {
		
		var index = 0;

		$( ".dates-remove" ).click( function ( event ) {
			$( this ).parent().slideUp();
			var index = $( this ).parent().index();
			model.send( "/vacations/remove", { id: state.days[index].id } );
		} );
 
		for ( let item of state.days ) {
			var btn = $( "#dates-off-content" ).children().eq( index ).children( ".dates-remove" );

			if ( item.status === "pending" )
				continue;

			if ( item.status === "rejected" )
				$( "#dates-off-content" ).children().eq( index ).attr( "class", "rejected" ); 	
		
			if ( item.status === "accepted" )
				$( "#dates-off-content" ).children().eq( index ).attr( "class", "accepted" );

			btn.remove();	

			++index;	
		}
		next();

	} );

	view.render( "#intro-text", MSJS.renderers.mustache );
	view.render( "#calendar", function ( state, next ) {
		
		this.fullCalendar( {
			height: "parent",
			events: state.events,
			eventRender: function ( event, element, view ) {
				if ( event.end.isBefore( moment() ) ) {
					element.css( "background-color", "#9f9f9f" );
					return;
				}
				if ( event.user_id === state.id )
					element.css( "background-color", "#8eb209" );
				else
					element.css( "background-color", "#0055cc" );
			},

			eventAfterAllRender: function ( view ) {
				$( "#loader-wrapper" ).fadeOut();
			}

		} );

	} );

	view.event( "#date-submit", "click", function ( event, state ) {
	
		const from = $( "#date-from" ).val();
		const to = $( "#date-to" ).val();
		const comment = $( "#date-comment" ).val();

		var event_overlap = [];
		var num_overlap = 0;
		
		for ( let event of state.events )
			if ( check_overlap ( event, { start: from, end: to } ) ) {

				if ( event.user_id === state.id )
					return message_popup.add( "Your selected dates overlap... please choose different ones.", "#ff1c00" );

				if ( num_overlap === 0 ) {
					++num_overlap;
					event_overlap.push( event );
				} else for ( let overlap of event_overlap ) {
					if ( check_overlap ( event, overlap ) ) {
						++num_overlap;
						event_overlap.push( event );
					}
					if ( num_overlap === 2 )
						return message_popup.add( "Sorry... your dates are overlapping with two or more of your collegues.", "#ff1c00" );
				}

			}

		$.ajax( {

			url: "/vacations",
			type: "post",

			data: {
				from: from,
				to: to,
				comment: comment
			},

			success: function ( response ) {
	
				let event= {
					start: from,
					end: to,
					status: "pending",
					id: response.id,
					user_id: state.id
				};

				state.events.push( event );
				var date = $( "<div>" );
				var remove = $( "<div>", { "class": "dates-remove" } );
				remove.click( function ( event ) {
					$( this ).parent().slideUp();
					model.send( "/vacations/remove", { id: response.id } );
				} );
				date.html( "From: " + from + ", To:" + to + "</br>" + "<small>pending</small>" );
				date.append( remove );
				$( "#dates-off-content" ).append( date );	

			}
		
		} );

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

	const check_overlap = function ( one, two ) {
		if ( ( moment( one.start ).isBefore( two.end ) 
			|| moment( one.start ).isSame( two.start ) ) &&
			( moment( two.start ).isBefore( one.end ) 
			||  moment( two.end ).isSame( one.end )  ) ) return true;

		return false;
	} 

	$( "[data-toggle='datepicker']" ).datepicker();

	$ ( "#date-from" ).datepicker( "setStartDate", new Date() );

	$( "#date-from" ).on( "pick.datepicker", ( event ) => {
		$ ( "#date-to" ).datepicker( "setStartDate", event.date );
	} );

	$( "#date-to" ).on( "pick.datepicker", ( event ) => {
		$ ( "#date-from" ).datepicker( "setEndDate", event.date );
	} );			


} );
