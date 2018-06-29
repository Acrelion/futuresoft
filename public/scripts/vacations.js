$( document ).ready( function () {
	"use strict";

	var name = undefined;
	var events = undefined;

	const dates_display = {

		$element: $( "#dates-off-content" ),
		event_num: 0,

		render: function ( events ) {

			var own_events = false;
			
			
			for ( let event of events )
				if ( event.title.startsWith( name ) ) {
					this.add( event.start, event.end, event.id );
					own_events = true
				}
				
		},
		
		add: function ( from , to, id ) {
			var el = $( "<div>" );
			var button = $( "<div>" );

			if ( this.event_num === 0 )
				this.$element.empty();

			++ this.event_num;

			button.click( ( event ) => {

				$.ajax( {

					url: "/vacations/remove",
					type: "post",

					data: {
						id: id
					},

					success: ( response ) => {
						el.remove();
						-- this.event_num;
						console.log( this.event_num );
						if ( this.event_num === 0 ) {
							this.$element.empty();
							this.$element.append( "No days off planned." );
						}
						console.log( events );
						for ( let event of events )
							if ( event.id === id )
								events.splice( events.indexOf( event ), 1 );
						console.log( events );
						$( "#calendar" ).fullCalendar( "removeEvents", id );
					}

				} );					
	
			} );

			el.text( "From: " + from + " To: " + to );
			el.append( button );
			this.$element.append( el );	

		}

	};

	$.ajax( {

		url: "/vacations",	
		type: "get",

		success: function ( response ) {
			name = response.name;
			events = response.events;

			dates_display.render( response.events );
			$( "#intro-text" ).html( "Hello, <b>" +  response.name + "</b>");
			$( "#calendar" ).fullCalendar( {
				height: "parent",
				events: response.events,
				eventRender: function ( event, element, view ) {
					if ( event.title.startsWith( name ) ) {
						element.css( "background-color", "#009933" );
					} else {
						element.css( "background-color", "#0000cc" );
					}
				}
			} );
		}

	} );

	$( "[data-toggle='datepicker']" ).datepicker();

	$( "#date-submit" ).click( function ( event ) {
		const from = $( "#date-from" ).val();
		const to = $( "#date-to" ).val();
		const comment = $( "#date-comment" ).val();

		var num_overlap = 0;
		var event_overlap = [];

		// !!! isSame bug... basically this whole shit need to be cleaned up

		for ( let event of events ) 
				if ( moment( event.start ).isBefore( to ) &&
					 moment( from ).isBefore( event.end ) ) {

						if ( event.title.startsWith( name ) )
							return message_popup.add( "Your selected dates overlap... please choose different ones.", "#e60000" );

						if ( num_overlap === 0) {

							event_overlap.push( event );
							num_overlap ++;

						} else for ( let overlap of event_overlap )
							if ( moment( event.start ).isBefore( overlap.end ) &&
					 			moment( overlap.start ).isBefore( event.end ) ) 
									return message_popup.add( "Sorry... your dates are overlapping with two or more of your collegues.", "#e60000" );

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
				console.log( response );
	
				let event= {
					title: comment ? name + " (" + comment + ")" : name,
					start: from,
					end: to,
					id: response.id,
					allDay: true
				}

				$( "#calendar" ).fullCalendar( "renderEvent", event, true );

				events.push( event );	

				dates_display.add( from, to, response.id );
					
			}
		
		} );

	} );

	$ ( "#date-from" ).datepicker( "setStartDate", new Date() );

	$( "#date-from" ).on( "pick.datepicker", ( event ) => {
		$ ( "#date-to" ).datepicker( "setStartDate", event.date );
	} );

	$( "#date-to" ).on( "pick.datepicker", ( event ) => {
		$ ( "#date-from" ).datepicker( "setEndDate", event.date );
	} );			


} );
