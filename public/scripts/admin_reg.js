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
