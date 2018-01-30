// Copyright 2017, University of Colorado Boulder

/**
 * Responsible for the creation of the arrowNodes associated with the masses and visibility panels.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );

  // Constants
  var FORCES_ARROW_LENGTH = 31;
  var SMALLER_ARROW_HEAD_WIDTH = 11;
  var SMALLER_ARROW_TAIL_WIDTH = 3;

  /**
   * @param {Color} color
   * @param {string} tandemID - string name of tandem
   * @param {Tandem} tandem
   * @constructor
   */
  // REVIEW: We are creating different arrows. Should we have to pass in the tandem and tandem ID separately?
  function ForceVectorArrow( color, tandemID, tandem ) {
    ArrowNode.call( this, 5, 0, FORCES_ARROW_LENGTH, 0, {
      fill: color,
      stroke: color,
      centerY: 0,
      tailWidth: SMALLER_ARROW_TAIL_WIDTH,
      headWidth: SMALLER_ARROW_HEAD_WIDTH,
      tandem: tandem.createTandem( tandemID )
    } );

  }

  massesAndSprings.register( 'ForceVectorArrow', ForceVectorArrow );
  return inherit( ArrowNode, ForceVectorArrow );
} );
