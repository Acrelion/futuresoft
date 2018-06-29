$( document ).ready( function () {
	"use strict"

	const switcher = {
		$elements: [],

		activate: () => {},
		deactivate: () => {},

		select: function ( $element ) {

			console.log( this.$elements, $element );
			
			//Expects( this.$elements.includes( $element ) );
			
			for ( let $el of this.$elements )
				this.deactivate( $el );
			this.activate( $element );
			
			return this;
		},

		extend: function ( child ) {
			return $.extend(true, {}, this, child );
		}

	}

	const toggle_group = switcher.extend( {
		activate: ( $element ) => $element.addClass( "active" ),
		deactivate: ( $element ) => $element.removeClass( "active" ),

		add: function ( $element, callback ) {
			this.$elements.push( $element );

			$element.click( () => {
				this.select( $element );
				if( callback ) callback( $element );
			} );

			return this;
		}
	} );

	const form_switcher = switcher.extend( {
		$elements: [ $( "#login-form" ), $( "#register-form" ) ],

		activate: ( $element ) => $element.fadeIn(),
		deactivate: ( $element ) => $element.hide()

	} );

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

	toggle_group.add( $( "#login-link" ), () => form_switcher.select( $( "#login-form" ) ) )
				.add( $( "#register-link" ), () => form_switcher.select( $( "#register-form"  ) ) );


	$( "#register_btn" ).click( function ( event ) {

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
				
				message_popup.add( "Registration completed successfully. Please log in with your new credentials", "#009933" );
				toggle_group.select( $( "#login-link" ) );
				form_switcher.select( $( "#login-form" ) );	

			},
			
		} );

	} );

	$( "#login_btn" ).click( function ( event ) {

		const name = $( "#log_name" ).val();	
		const password = $( "#log_password" ).val();

		if ( !validate_info( name, password, ( password === undefined ) ? " " : password ) ) return;

		$.ajax( {
			url: "/",
			type: "post",
			data: {
				type: "log",
				name: name,
				password: password
			},
			success: function ( response ) {
				window.location.href += "profile";
			},
			error: function ( response ) {
				message_popup.add( "Wrong name or password. Please try again.", "#e60000" );
			}
		} );
			
	} );

	const validate_info = function ( name, password, password_conf ) {

		if ( !name || name === "" ) {
			message_popup.add( "Plase fill in your name.", "#e60000" );
			return false;
		}
		
		if ( !password || password === "" ) {
			message_popup.add( "Please fill in a password.", "#e60000" );
			return false;
		}

		if ( !password_conf || password_conf === "" ) {
			message_popup.add( "Please confirm your password.", "#e60000" );
			return false;
		}

		if ( password != password_conf ) {
			message_popup.add( "Passwords don't match" , "#e60000" );
			return false;
		}

		return true;

	}

} );
