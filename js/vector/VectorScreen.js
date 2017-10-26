// Copyright 2016-2017, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var TColor = require( 'SCENERY/util/TColor' );
  var VectorScreenView = require( 'MASSES_AND_SPRINGS/vector/view/VectorScreenView' );

  // strings
  var vectorString = require( 'string!MASSES_AND_SPRINGS/vector' );

  // image
  var vectorHomeScreenImage = require( 'image!MASSES_AND_SPRINGS/vectors_screen_icon.png' );

  /**
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function VectorScreen( tandem ) {

    var options = {
      name: vectorString,
      backgroundColorProperty: new Property( new Color( 'white' ), {
        tandem: tandem.createTandem( 'backgroundColorProperty' ),
        phetioValueType: TColor,
        maxDT: 1
      } ),
      homeScreenIcon: new Image( vectorHomeScreenImage ),
      navigationBarIcon: new Image( vectorHomeScreenImage ),
      tandem: tandem
    };

    Screen.call( this,
      function() {
        var modelTandem = tandem.createTandem( 'model' );
        var model = new MassesAndSpringsModel( modelTandem, { vectorViewEnabled: true } );
        model.addDefaultSprings( modelTandem );
        model.addDefaultMasses( modelTandem );
        return model;
      },
      function( model ) { return new VectorScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }

  massesAndSprings.register( 'VectorScreen', VectorScreen );

  return inherit( Screen, VectorScreen );
} );
