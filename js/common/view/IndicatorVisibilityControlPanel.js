// Copyright 2016, University of Colorado Boulder

/**
 * @author Denzell Barnett
 *
 * Panel that gives manages options for visible tools.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  // constants
  var equilibriumPositionString = require( 'string!MASSES_AND_SPRINGS/equilibriumPosition' );
  var movableLineString = require( 'string!MASSES_AND_SPRINGS/movableLine' );
  var naturalLengthString = require( 'string!MASSES_AND_SPRINGS/naturalLength' );
  var FONT = new PhetFont( 12 );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Object} options
   * @constructor
   */
  function IndicatorVisibilityControlPanel( model, options ) {
    Node.call( this );

    // TODO: Decouple the checkBoxGroup
    var indicatorVisibilityCheckBoxGroup = new VerticalCheckBoxGroup( [
      {
        content: new Text( naturalLengthString, FONT ),
        property: model.naturalLengthVisibleProperty,
        label: naturalLengthString
      },
      {
        content: new Text( equilibriumPositionString, FONT ),
        property: model.equilibriumPositionVisibleProperty,
        label: equilibriumPositionString
      },
      {
        content: new Text( movableLineString, FONT ),
        property: model.movableLineVisibleProperty,
        label: movableLineString
      }
    ], { boxWidth: 15, spacing: 5 } );
    var titleToControlsVerticalSpace = 2;
    var indicatorVisibilityControlsVBox = new VBox( {
      children: [
        new VStrut( titleToControlsVerticalSpace ),
        new HBox(
          {
            children: [
              indicatorVisibilityCheckBoxGroup,
              new HStrut( 40 )
            ]
          } )
      ],
      align: 'left'
      }
    );
    this.indicatorVisibilityControlPanel = new Panel(
      indicatorVisibilityControlsVBox,
      {
        xMargin: 10,
        fill: 'rgb( 240, 240, 240 )'
      }
    );
    this.addChild( this.indicatorVisibilityControlPanel );
    this.mutate( options );

  }

  massesAndSprings.register( 'IndicatorVisibilityControlPanel', IndicatorVisibilityControlPanel );

  return inherit( Node, IndicatorVisibilityControlPanel );
} );