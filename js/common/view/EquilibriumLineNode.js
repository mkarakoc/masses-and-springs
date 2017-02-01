// Copyright 2016, University of Colorado Boulder

/**
 * @author Denzell Barnett
 *
 * Node for the equilibrium line.
 */

define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {ModelViewTransform2} mvt
   * @param {Vector2} initialPosition - of the center of line
   * @param {number} length - in view coordinates
   * @param {number} springNumber - determines which spring is being referenced
   * @param {boolean} visibleProperty
   * @constructor
   */
  // TODO: Pass in only minimum (spring, visibleProperty, mvt )
  function EquilibriumLineNode( model, mvt, initialPosition, length, springNumber, visibleProperty ) {
    var self = this;
    Node.call( this );

    this.initialPosition = initialPosition;

    var line = new Line( 0, 0, length, 0, {
      stroke: 'rgb(93, 191, 142)',
      lineDash: [ 12, 8 ],
      lineWidth: 1.5,
      cursor: 'pointer'
    } );
    line.mouseArea = line.localBounds.dilated( 10 );
    line.touchArea = line.localBounds.dilated( 10 );

    this.addChild( line );

    // @private
    //TODO: refactor equilibriumProperty -> equilibriumYPositionProperty
    this.centerX = mvt.modelToViewX( model.springs[ springNumber ].positionProperty.get().x );
    model.springs[ springNumber ].equilibriumProperty.link( function( equilibriumPosition ) {
      self.centerY = mvt.modelToViewY( equilibriumPosition );
      console.log( self.centerY );
    } );

    visibleProperty.linkAttribute( self, 'visible' );
  }

  massesAndSprings.register( 'EquilibriumLineNode', EquilibriumLineNode );

  return inherit( Node, EquilibriumLineNode, {
    reset: function() {
      this.positionProperty.reset();
    }
  } );

} );