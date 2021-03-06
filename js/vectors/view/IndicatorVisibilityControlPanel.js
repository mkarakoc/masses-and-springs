// Copyright 2017-2018, University of Colorado Boulder

/**
 * Panel that manages options for visibility of reference lines on vector screen.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DisplacementArrowNode = require( 'MASSES_AND_SPRINGS/vectors/view/DisplacementArrowNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  // strings
  var massEquilibriumString = require( 'string!MASSES_AND_SPRINGS/massEquilibrium' );
  var movableLineString = require( 'string!MASSES_AND_SPRINGS/movableLine' );
  var displacementString = require( 'string!MASSES_AND_SPRINGS/displacement' );

  // constants
  var LINE_LENGTH = 25;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function IndicatorVisibilityControlPanel( model, tandem, options ) {
    options = _.extend( {
      xMargin: 10,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      tandem: tandem.createTandem( 'indicatorVisibilityControlPanel' ),
      minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH
    }, options );
    /**
     * Creates line for visual representation within the panel.
     * @param {string} color
     * @param {Tandem} tandem
     * @returns {Line} line object with passed in color.
     */
    var createLine = function( color, tandem ) {
      return new Line( 0, 0, LINE_LENGTH, 0, {
        stroke: color,
        lineDash: [ 6, 2.5 ],
        lineWidth: 2.0,
        cursor: 'pointer',
        tandem: tandem
      } );
    };

    // Lines added for reference in panel
    var greenLine = createLine( 'black', tandem.createTandem( 'blackLine' ) );
    var displacementSymbol = new DisplacementArrowNode(
      new Property( 10 ),
      new Property( true ),
      tandem,
      {
        modelViewTransform: this.modelViewTransform,
        symbolRepresentation: true,
      }
    );
    displacementSymbol.scale( .65 );
    var redLine = createLine( 'red', tandem.createTandem( 'redLine' ) );

    var indicatorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
      content: new HBox( {
        children: [ new Text( displacementString, {
          font: MassesAndSpringsConstants.TITLE_FONT, tandem: tandem.createTandem( 'displacementString' )
        } ) ],
        tandem: tandem.createTandem( 'displacementHBox' )
      } ),
      property: model.displacementVisibleProperty,
      label: displacementString
    }, {
      content: new HBox( {
        children: [ new Text( massEquilibriumString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          tandem: tandem.createTandem( 'massEquilibriumString' )
        } ) ],
        tandem: tandem.createTandem( 'massEquilibriumHBox' )
      } ),
      property: model.equilibriumPositionVisibleProperty,
      label: massEquilibriumString
    }, {
      content: new HBox( {
        children: [ new Text( movableLineString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          tandem: tandem.createTandem( 'movableLineString' )
        } ) ],
        tandem: tandem.createTandem( 'movableLineHBox' )
      } ),
      property: model.movableLineVisibleProperty,
      label: movableLineString
    } ], {
      boxWidth: 15,
      spacing: 8,
      tandem: tandem.createTandem( 'indicatorVisibilityCheckboxGroup' )
    } );
    var titleToControlsVerticalSpace = 2;
    var indicatorVisibilityControlsVBox = new VBox( {
      children: [
        new VStrut( titleToControlsVerticalSpace ),
        indicatorVisibilityCheckboxGroup
      ],
      align: 'left',
      tandem: tandem.createTandem( 'indicatorVisibilityControlsVBox' )
      }
    );
    var lineVBox = new VBox( {
      children: [
        displacementSymbol,
        new VStrut( 18 ),
        greenLine,
        new VStrut( 24 ),
        redLine,
      ], yMargin: 0
    } );
    var controlBox = new HBox( {
      children: [
        indicatorVisibilityControlsVBox,
        new HStrut( 25 ),
        lineVBox,
      ]
    } );

    Panel.call( this, controlBox, options );
  }

  massesAndSprings.register( 'IndicatorVisibilityControlPanel', IndicatorVisibilityControlPanel );

  return inherit( Panel, IndicatorVisibilityControlPanel );
} );