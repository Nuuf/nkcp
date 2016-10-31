# nkcp (Nenkraft Command Parser)

## Command String Parser Wubwub

## Latest Update info

1.0.1

Added a default/selected option for lists, `parseSelected`, either via `nkcp` or `nkcp.CommandList`, `nkcp.parseSelected`

1.0.0

Added `CommandList` for dynamic parsing.

## Example 1

```js

var nkcp = require( 'nkcp' );

//A command list and a command

var cmdlist = nkcp.CommandList();
var cmd = nkcp.Command('command', function(){}, 'does nothing');
cmdlist.add(cmd);

cmdlist.parse('command ?' /*? is default for info*/);

//Output
/*
COMMAND: command -> does nothing
*/


```

## Example 2

```js

var nkcp = require( 'nkcp' );

const version = '1.0.1';
var v_split = version.split( '.' );
//Some options
var cmdlist = nkcp.CommandList( { optionPrefix: '--' });
cmdlist.add(
    nkcp.Command( 'version v', function ()
    {
        console.log( version )
    }, 'logs current version' ),
    /*only one of each option allowed, more than one option allowed, if ? then break ALL, do not continue to main*/
    { optionRedudancy: false, multipleOptions: true, breakOnInfo: true, breakOnOption: true }).
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

//Output
/*
COMMAND: version, v -> logs current version
OPTION: --major, --ma -> logs major version
OPTION: --minor, --mi -> logs minor version
OPTION: --patch, --pa -> logs patch version

1
0
1
1.0.1
*/

```

## Example 3

```js

var nkcp = require( 'nkcp' );

var cl = nkcp.CommandList({selected: true});
cl.add(nkcp.Command('greet', function()
{
    console.log('hello!');
}, 'greets'));

nkcp.parseSelected('greet');

//Output
/*
hello!
*/

```