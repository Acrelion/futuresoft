const Invariant = ( message, ...conds ) => {
	for ( let cond of conds )
		if ( !cond )
			throw Error ( message );
}

const Expects = ( ...conds ) => Invariant( "Precondition not met", ...conds ); 
const Ensures = ( ...conds ) => Invariant( "Postcondition not met", ...conds );
