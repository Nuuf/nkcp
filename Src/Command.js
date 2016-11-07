( function ()
{
    "use strict";
    function Command( _id, _handle, _info )
    {
        if ( this instanceof Command )
        {
            if ( typeof _id !== 'string' ) throw new TypeError( 'Given Command id was no String' );

            if ( typeof _handle !== 'function' ) throw new TypeError( 'Missing handle' );

            this.info = ( typeof _info === 'string' ) ? _info : 'No info';

            this.id = _id.split( ' ' );
            this.options = [];
            this.handle = _handle;
            this.breakOnOption = true;
            this.multipleOptions = true;
            this.optionRedundancy = false;
            this.breakOnInfo = true;
            this.infoFound = false;
            this.optionPriority = 1;
            this.infoOptionId = null;
            this.optionPrefix = null;
        }
        else return new Command( _id, _handle, _info );
    }
    Command.prototype =
        {
            constructor: Command,
            Execute: function ( _dataStrs, _data )
            {
                this.infoFound = false;
                _data = _data || {};
                if ( this.breakOnOption === false )
                {
                    this.HandleOptions( _dataStrs, _data );
                    if ( this.infoFound === true && this.breakOnInfo === true ) { }
                    else this.handle( _dataStrs, _data );
                }
                else if ( this.HandleOptions( _dataStrs, _data ) === false )
                {
                    if ( this.infoFound === true && this.breakOnInfo === true ) { }
                    else this.handle( _dataStrs, _data );
                }
            },
            HandleOptions: function ( _dataStrs, _data )
            {
                var dsCopy = _dataStrs.slice();
                var i = 0, l = this.options.length, option, str, index, found = false;
                var options = [], optionStrs = [];
                for ( i; i < l; ++i )
                {
                    option = this.options[ i ];
                    if ( option ) options = options.concat( option.id );
                }
                i = 0; l = _dataStrs.length;
                for ( i; i < l; ++i )
                {
                    str = _dataStrs[ i ];
                    if ( options.indexOf( str ) !== -1 || str === this.infoOptionId ) optionStrs.push( str );
                }
                i = 0; l = optionStrs.length;
                for ( i; i < l; ++i )
                {
                    str = optionStrs[ i ];
                    if ( str )
                    {
                        index = _dataStrs.indexOf( str );
                        if ( index !== -1 ) _dataStrs.splice( index, 1 );
                    }
                }
                if ( optionStrs.indexOf( this.infoOptionId ) !== -1 )
                {
                    this.onInfo( _dataStrs, _data );
                    this.infoFound = true;
                    if ( this.breakOnInfo === true ) return false;
                }
                if ( this.optionPriority === 0 )
                {
                    i = 0; l = this.options.length, options = [];
                    for ( i; i < l; ++i )
                    {
                        option = this.options[ i ];
                        if ( option )
                        {
                            var j = 0, jl = optionStrs.length;
                            for ( j; j < jl; ++j )
                            {
                                str = optionStrs[ j ];
                                if ( str )
                                {
                                    if ( option.id.indexOf( str ) !== -1 )
                                    {
                                        if ( this.optionRedundancy === false )
                                        {
                                            if ( options.indexOf( option ) === -1 )
                                            {
                                                option.handle( _dataStrs, _data );
                                                options.push( option );
                                            }
                                        }
                                        else option.handle( _dataStrs, _data );
                                        found = true;
                                        if ( this.multipleOptions === false ) return true;
                                    }
                                }
                            }
                        }
                    }
                }
                else if ( this.optionPriority === 1 )
                {
                    i = 0; l = optionStrs.length, options = [];
                    for ( i; i < l; ++i )
                    {
                        str = optionStrs[ i ];
                        if ( str )
                        {
                            var j = 0, jl = this.options.length;
                            for ( j; j < jl; ++j )
                            {
                                option = this.options[ j ];
                                if ( option )
                                {
                                    if ( option.id.indexOf( str ) !== -1 )
                                    {
                                        if ( this.optionRedundancy === false )
                                        {
                                            if ( options.indexOf( option ) === -1 )
                                            {
                                                option.handle( _dataStrs, _data );
                                                options.push( option );
                                            }
                                        }
                                        else option.handle( _dataStrs, _data );
                                        found = true;
                                        if ( this.multipleOptions === false ) return true;
                                    }
                                }
                            }
                        }
                    }
                }
                return found;
            },
            AddOption: function ( _id, _handle, _info )
            {
                if ( _id instanceof Command ) this.options.push( _id );
                else
                {
                    if (typeof this.optionPrefix === 'string') _id = _id.replace( /([A-Za-z]+)/g, this.optionPrefix + '$1' );
                    this.options.push( new Command( _id, _handle, _info ) );
                }
                return this;
            },
            GetInfoString: function ( _excludeMain )
            {
                var info = '';
                if ( !_excludeMain ) info += 'COMMAND: ' + this.id.join( ', ' ) + ' -> ' + this.info + '\n';
                var i = 0, l = this.options.length, option;
                for ( i; i < l; ++i )
                {
                    option = this.options[ i ];
                    if ( option )
                    {
                        info += 'OPTION: ' + option.id.join( ', ' ) + ' -> ' + option.info + '\n';
                    }
                }
                return info;
            },
            onInfo: function ( _dataStrs, _data )
            {
                console.log( this.GetInfoString() );
            }
        };
    Command.prototype.AddSubcommand = Command.prototype.addSubcommand = Command.prototype.addOption = Command.prototype.AddOption;

    module.exports = Command;
} () );