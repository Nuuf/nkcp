var nkcp = require( './index.js' );

const version = '1.0.5';
var v_split = version.split( '.' );
//Some options
var cmdlist = nkcp.CommandList( { optionPrefix: '--' });
cmdlist.add(
    nkcp.Command( 'version v', function ()
    {
        console.log( version )
    }, 'logs current version' ),
    /*only one of each option allowed, more than one option allowed, if ? then break ALL, do not continue to main*/
    { optionRedundancy: false, multipleOptions: true, breakOnInfo: true, breakOnOption: true }).
    addOption( 'major ma', function ()
    {
        console.log( v_split[ 0 ] );
    }, 'logs major version' ).
    /*alias, addOption === addSubcommand*/
    addSubcommand( 'minor mi', function ()
    {
        console.log( v_split[ 1 ] );
    }, 'logs minor version' ).
    addOption( 'patch pa', function ()
    {
        console.log( v_split[ 2 ] );
    }, 'logs patch version' );

cmdlist.parse( 'version ?' );
cmdlist.parse( 'v --ma --mi --pa' );
cmdlist.parse( 'v' );