// Copyright 2016-2017, University of Colorado Boulder

/**
 * PhET-iO wrapper type for Masses-And-Springs built-in Body type.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TBody( instance, phetioID ) {
    assertInstanceOf( instance, phet.massesAndSprings.Body );
    TObject.call( this, instance, phetioID );
  }

  phetioInherit( TObject, 'TBody', TBody, {}, {
    toStateObject: function( body ) {
      if ( body === null ) {
        return null;
      }
      return {
        body: body
      };
    }
  } );

  massesAndSprings.register( 'TBody', TBody );

  return TBody;
} );