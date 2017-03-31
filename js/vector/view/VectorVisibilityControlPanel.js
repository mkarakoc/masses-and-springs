// Copyright 2016-2017, University of Colorado Boulder

/**
 * Panel that manages options visibility for vectors.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Panel = require( 'SUN/Panel' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  var velocityString = require( 'string!MASSES_AND_SPRINGS/velocity' );
  var accelerationString = require( 'string!MASSES_AND_SPRINGS/acceleration' );
  var forcesString = require( 'string!MASSES_AND_SPRINGS/forces' );
  var netForceString = require( 'string!MASSES_AND_SPRINGS/netForce' );

  var ARROW_LENGTH = 24;
  var ARROW_HEAD_WIDTH = 14;
  var ARROW_TAIL_WIDTH = 8;
  //var TEXT_MARGIN_RIGHT = 5;
  var VELOCITY_ARROW_COLOR = 'rgb( 41, 253, 46 )';
  var ACCELERATION_ARROW_COLOR = 'rgb( 255, 253, 56 )';

  // var PANEL_WIDTH = MassesAndSpringsConstants.LEFT_PANELS_MIN_WIDTH;
  // var MAX_TEXT_WIDTH = PANEL_WIDTH * 0.60;  // allows for 60% of the horizontal space in the panel for text.
  /**
   * @param {VectorModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function VectorVisibilityControlPanel( model, tandem, options ) {
    var self = this;

    var velocityArrow = new ArrowNode( 10, 0, 10 + ARROW_LENGTH, 0, {
      fill: VELOCITY_ARROW_COLOR,
      centerY: 0,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH,
      tandem: tandem.createTandem( 'velocityArrow' )
    } );

    var accelerationArrow = new ArrowNode( 10, 0, 10 + ARROW_LENGTH, 0, {
      fill: ACCELERATION_ARROW_COLOR,
      centerY: 0,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH,
      tandem: tandem.createTandem( 'accelerationArrow' )
    } );
    var vectorVisibilityCheckBoxGroup = new VerticalCheckBoxGroup( [
      {
        content: new HBox( {
          children: [ new Text( velocityString, {
            font: MassesAndSpringsConstants.FONT,
            tandem: tandem.createTandem( 'velocityString' )
          } ), new HStrut( 79 ), velocityArrow ]
        } ),
        property: model.velocityVectorVisibilityProperty,
        label: velocityString
      },
      {
        content: new HBox( {
          children: [ new Text( accelerationString, {
            font: MassesAndSpringsConstants.FONT,
            tandem: tandem.createTandem( 'accelerationString' )
          } ), new HStrut( 57 ), accelerationArrow ]
        } ),
        property: model.accelerationVectorVisibilityProperty,
        label: accelerationString
      }
    ], {
      tandem: tandem.createTandem( 'vectorVisibilityCheckBoxGroup' )
    } );
    var vectorVisibilityRadioButtonGroup = new VerticalAquaRadioButtonGroup( [
      {
        node: new Text( forcesString, {
          font: MassesAndSpringsConstants.FONT,
          tandem: tandem.createTandem( 'forcesString' )
        } ),
        property: model.forcesVectorVisibilityProperty,
        value: true
      },
      {
        node: new Text( netForceString, {
          font: MassesAndSpringsConstants.FONT,
          tandem: tandem.createTandem( 'netForceString' )
        } ),
        property: model.netForceVectorVisibilityProperty,
        value: true
      }
    ], {
      radius: 8,
      spacing: 8
    } );
    var titleToControlsVerticalSpace = 2;
    var vectorVisibilityControlsVBox = new VBox( {
        children: [
          new VStrut( titleToControlsVerticalSpace ),
          vectorVisibilityCheckBoxGroup,
          new VStrut( titleToControlsVerticalSpace ),
          vectorVisibilityRadioButtonGroup
        ],
      align: 'left',

      tandem: tandem.createTandem( 'titleToControlsVerticalSpace' )
      }
    );
    Panel.call( this,
      vectorVisibilityControlsVBox,
      {
        minWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        xMargin: 10,
        fill: 'rgb( 240, 240, 240 )',
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        tandem: tandem.createTandem( 'vectorVisibilityControlPanel' )
      }
    );
    self.mutate( options );
    model.netForceVectorVisibilityProperty.link( function( netForceVisibility ) {
      if ( netForceVisibility === true ) {
        model.forcesVectorVisibilityProperty.set( false );
      }
    } );
    model.forcesVectorVisibilityProperty.link( function( forceVisibility ) {
      if ( forceVisibility === true ) {
        model.netForceVectorVisibilityProperty.set( false );
      }
    } );
  }

  massesAndSprings.register( 'VectorVisibilityControlPanel', VectorVisibilityControlPanel );

  return inherit( Panel, VectorVisibilityControlPanel );
} );