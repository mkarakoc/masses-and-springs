// Copyright 2017, University of Colorado Boulder

/**
 * IO type for Mass.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * @param {Mass} mass
   * @param {string} phetioID
   * @constructor
   */
  function MassIO( mass, phetioID ) {
    assert && assertInstanceOf( mass, phet.massesAndSprings.Mass );
    ObjectIO.call( this, mass, phetioID );
  }

  phetioInherit( ObjectIO, 'MassIO', MassIO, {}, {
    toStateObject: function( mass ) {
      assert && assertInstanceOf( mass, phet.massesAndSprings.Mass );
      if ( mass === null ) {
        return null;
      }
      return {
        mass: mass.mass,
        color: mass.color
      };
    }
  } );

  massesAndSprings.register( 'MassIO', MassIO );

  return MassIO;
} );