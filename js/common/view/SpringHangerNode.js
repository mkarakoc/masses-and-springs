// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 * @author Denzell Barnett
 *
 * Object that creates the grey bar that the springs hang from and their respective numerical label.
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );


  // constants
  var SPRING_HANGER_FONT = new PhetFont( { size: 16, weight: 'bold' } );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function SpringHangerNode( model, mvt ) {
    // derived from x positions of springs.
    Node.call( this );

    var springsSeparation =
      mvt.modelToViewDeltaX( Math.abs( model.springs[ 0 ].positionProperty.get().x - model.springs[ 1 ].positionProperty.get().x ) );
    var springHangerNodeWidth = springsSeparation * 1.4;

    // X coordinate of middle of springs
    var middleOfSprings = mvt.modelToViewX( (model.springs[ 0 ].positionProperty.get().x + model.springs[ 1 ].positionProperty.get().x) / 2 );

    // Node for hanger text label
    var springHangerLabelNode = new Node();
    springHangerLabelNode.addChild( new Text( '1', { font: SPRING_HANGER_FONT } ) );
    springHangerLabelNode.addChild( new Text( '2', { font: SPRING_HANGER_FONT, centerX: springsSeparation } ) );
    this.springHangerNode = new Rectangle( 0, 0, springHangerNodeWidth, 20, 8, 8, {
      fill: 'rgb( 180, 180, 180 )',
      stroke: 'grey',
      centerX: middleOfSprings,
      top: mvt.modelToViewY( model.ceilingY )
    } );
    springHangerLabelNode.centerX = this.springHangerNode.width / 2;
    springHangerLabelNode.centerY = this.springHangerNode.height / 2;
    this.springHangerNode.addChild( springHangerLabelNode );
    this.addChild( this.springHangerNode );
  }

  massesAndSprings.register( 'SpringHangerNode', SpringHangerNode );

  return inherit( Node, SpringHangerNode );
} );