var nkcp = require( './index.js' );

var cl = nkcp.CommandList({selected: true});
cl.add(nkcp.Command('greet', function()
{
    console.log('hello!');
}, 'greets'));

nkcp.parseSelected('greet');