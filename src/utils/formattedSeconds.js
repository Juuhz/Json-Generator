export const formattedSeconds = ( sec ) => {
	return Math.floor( sec / 60 ) + ':' + ( '0' + sec % 60 ).slice( -2 );
}