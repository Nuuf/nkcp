( function ()
{
    "use strict";
    var private_static_selected = null;
    function CommandList( _options )
    {
        if ( this instanceof CommandList )
        {
            _options = _options || {};
            this.splitter = ( typeof _options.splitter === 'string' ) ? _options.splitter : ' ';
            this.infoOptionId = ( typeof _options.infoOptionId === 'string' ) ? _options.splitter : '?';
            this.optionPrefix = ( typeof _options.optionPrefix === 'string' ) ? _options.optionPrefix : '';
            this.commands = [];
            if ( _options.selected === true ) private_static_selected = this;
        }
        else return new CommandList( _options );
    }
    CommandList.prototype =
        {
            constructor: CommandList,
            Get: function ( _id )
            {
                var i = 0, l = this.commands.length, command;
                for ( i; i < l; ++i )
                {
                    command = this.commands[ i ];
                    if ( command )
                    {
                        var j = 0, jl = command.id.length;
                        for ( j; j < jl; ++j )
                        {
                            if ( command.id[ j ] === _id ) return command;
                        }
                    }
                }
                return null;
            },
            Parse: function ( _msg, _data )
            {
                var strs = _msg.split( this.splitter );
                var command = this.Get( strs.shift() );
                if ( command )
                {
                    command.Execute( strs, _data );
                    return true;
                }
                return false;
            },
            Add: function ( _command, _options )
            {
                _command.infoOptionId = _command.infoOptionId || this.infoOptionId;
                _command.optionPrefix = _command.optionPrefix || this.optionPrefix;
                _options = _options || {};
                if ( _options.breakOnOption === true || _options.breakOnOption === false ) _command.breakOnOption = _options.breakOnOption;
                if ( _options.multipleOptions === true || _options.multipleOptions === false ) _command.multipleOptions = _options.multipleOptions;
                if ( _options.optionRedundancy === true || _options.optionRedundancy === false ) _command.optionRedundancy = _options.optionRedundancy;
                if ( _options.breakOnInfo === true || _options.breakOnInfo === false ) _command.breakOnInfo = _options.breakOnInfo;
                if ( _options.optionPriority === 0 || _options.optionPriority === 1 ) _command.optionPriority = _options.optionPriority;
                this.commands.push( _command );
                return _command;
            },
            Remove: function ( _command )
            {
                var index = this.commands.indexOf( _command );
                if ( index !== -1 ) this.commands.splice( index, 1 );
            }
        };
    CommandList.prototype.parse = CommandList.prototype.Parse;
    CommandList.prototype.get = CommandList.prototype.Get;
    CommandList.prototype.add = CommandList.prototype.Add;
    CommandList.prototype.remove = CommandList.prototype.Remove;
    CommandList.ParseSelected = CommandList.parseSelected = function ( _msg, _data )
    {
        private_static_selected.Parse( _msg, _data );
    };
    CommandList.Select = CommandList.select = function ( _commandList )
    {
        if ( _commandList instanceof CommandList ) private_static_selected = _commandList;
    };

    module.exports = CommandList;
} () );