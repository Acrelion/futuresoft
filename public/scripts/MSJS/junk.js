const dates_display = {

		$element: $( "#dates-off-content" ),
		event_num: 0,

		render: function ( events ) {

			var own_events = false;
			
			
			for ( let event of events )
				if ( event.title.startsWith( name ) ) {
					this.add( event.start, event.end, event.status, event.id );
					own_events = true
				}
				
		},
		
		add: function ( from , to, status, id ) {
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

			el.html( "From: " + from + " To: " + to + "</br><small>status: " + status + "</small>" );
			el.append( button );
			this.$element.append( el );	

		}

	};
