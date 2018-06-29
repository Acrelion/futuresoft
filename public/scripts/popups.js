const message_popup = {
	queue: [],

	$element: $( "#error" ),

	timeout: 4000,

	default_color: "#9f9f9f",


	add: function ( message, color ) {
		Expects ( typeof message === "string" );

		let _message = message || "",
			_color = color || this.default_color;

		this.queue.push ( { message: _message, color: _color } );
		if ( this.queue.length === 1 ) this.display();
	},

	active: false,
	
	display: function () {

		if ( !this.active && this.queue.length > 0 ) {
			this.$element.html( this.queue[0].message );
			this.$element.css( "background-color", this.queue[0].color );
			this.$element.slideDown();
			setTimeout( () => {
				this.$element.slideUp();
				this.queue.shift();
				if ( this.queue.length > 0 )
					setTimeout( () => this.display(), 1000 );
			}, this.timeout );
		}

	}

};
