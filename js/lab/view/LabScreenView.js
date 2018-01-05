// Copyright 2016-2017, University of Colorado Boulder

/**
 * Screen view used for lab screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var GravityAndDampingControlPanel = require( 'MASSES_AND_SPRINGS/common/view/GravityAndDampingControlPanel' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var OneSpringView = require( 'MASSES_AND_SPRINGS/common/view/OneSpringView' );
  var VectorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/vectors/view/VectorVisibilityControlPanel' );
  var Panel = require( 'SUN/Panel' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function LabScreenView( model, tandem ) {

    // Calls common spring view
    OneSpringView.call( this, model, tandem );
    var self = this;

    this.massNodes.forEach( function( massNode ) {
      massNode.vectorViewEnabled = true;
    } );

    var vectorVisibilityControlPanel = new VectorVisibilityControlPanel(
      model,
      tandem.createTandem( 'vectorVisibilityControlPanel' ),
      {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        xMargin: 0,
        yMargin: 0,
        stroke: null,
        showForces: false
      }
    );

    // Gravity Control Panel
    var gravityAndDampingControlPanel = new GravityAndDampingControlPanel(
      model, this, tandem.createTandem( 'gravityAndDampingControlPanel' ), {
        minWidth: 1,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        dampingVisible: false,
        xMargin: 0,
        yMargin: 0,
        stroke: null
      } );

    // VBox that contains all of the panel's content
    var optionsVBox = new VBox( {
      spacing: 10,
      children: [
        this.referenceLinePanel,
        MassesAndSpringsConstants.LINE_SEPARATOR(),
        gravityAndDampingControlPanel,
        MassesAndSpringsConstants.LINE_SEPARATOR(),
        vectorVisibilityControlPanel,
        MassesAndSpringsConstants.LINE_SEPARATOR(),
        this.toolboxPanel
      ]
    } );

    // Panel that will display all the toggleable options.
    var optionsPanel = new Panel(
      optionsVBox,
      {
        xMargin: 10,
        fill: MassesAndSpringsConstants.PANEL_FILL,
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        tandem: tandem.createTandem( 'ReferenceLinePanel' ),
        minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH
      } );

    this.addChild( optionsPanel );
    optionsPanel.moveToBack();

    // Adjust the floating panels to the visibleBounds of the screen.
    this.visibleBoundsProperty.link( function( visibleBounds ) {
      optionsPanel.top = visibleBounds.top + self.spacing;
      optionsPanel.right = visibleBounds.right - self.spacing;
    } );
    this.gravityAndDampingControlPanel.options.hSliderTweakersEnabled = 0.5;

  }

  massesAndSprings.register( 'LabScreenView', LabScreenView );

  return inherit( OneSpringView, LabScreenView );
} );