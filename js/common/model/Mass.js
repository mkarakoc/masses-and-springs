// Copyright 2016-2017, University of Colorado Boulder

/**
 * Responsible for the model associated with each mass.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Easing = require( 'TWIXT/Easing' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var HEIGHT_RATIO = 2.5;
  var HOOK_HEIGHT_RATIO = 0.75;
  var DENSITY = 80; // Constant used to keep all of our masses consistent in the model.
  var SCALING_FACTOR = 4; // scales the radius to desired size

  // phet-io modules
  var TSpring = require( 'MASSES_AND_SPRINGS/common/model/TSpring' );
  var TVector2 = require( 'DOT/TVector2' );

  /**
   * @param {number} massValue:  mass in kg
   * @param {Vector2} initialPosition: initial coordinates of the mass
   * @param {boolean} isLabeled: determines if the mass is labeled in the view
   * @param {string} color: color of shown mass
   * @param {Property.<number>} gravityProperty - the gravity property from the model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function Mass( massValue, initialPosition, isLabeled, color, gravityProperty, tandem, options ) {

    assert && assert( massValue > 0, 'Mass must be greater than 0' ); // To prevent divide by 0 errors

    var self = this;

    this.options = _.extend( {
      adjustable: false,
      isLabeled: isLabeled,
      mysteryLabel: false,
      color: new Color( color ),
      zeroReferencePoint: 0 // Height of the mass when it is resting on the shelf
    }, options );

    // @public (read-only) {Property.<number>} mass of mass object in kg
    this.massProperty = new NumberProperty( massValue );

    // @public {Property.<number>} (read-write) radius of the massNode dependent its mass value
    this.radiusProperty = new DerivedProperty( [ this.massProperty ], function( massValue ) {
      return Math.pow( ( massValue - .01 ) / ( DENSITY * HEIGHT_RATIO * Math.PI ), 1 / 2 ) * SCALING_FACTOR;
    } );

    // @public {number}
    this.mass = massValue;

    // @public {string}
    this.color = color;

    // @public {Property.<number>} height in m
    this.cylinderHeightProperty = new DerivedProperty( [ this.radiusProperty ],
      function( radius ) {
        return radius * HEIGHT_RATIO;
      } );

    this.cylinderHeightProperty.link( function( cylinderHeight ) {
      self.options.zeroReferencePoint = -cylinderHeight / 2;
    } );

    // @public {number} hook height in m
    this.hookHeight = this.radiusProperty.value * HOOK_HEIGHT_RATIO;

    // @public {Property.<number>} total height of the mass, including its hook
    this.heightProperty = new DerivedProperty( [ this.cylinderHeightProperty ], function( cylinderHeight ) {
      return cylinderHeight + self.hookHeight;
    } );

    // @private {Vector2}
    this.initialPosition = initialPosition;

    // @public (read-only) Used for constructing tandems for corresponding view nodes.
    this.tandem = tandem;

    // @public {Property.<Vector2>} the position of a mass is the center top of the model object.
    this.positionProperty = new Property( this.initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioValueType: TVector2
    } );

    // @public {Property.<boolean>} indicates whether this mass is currently user controlled
    this.userControlledProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'userControlledProperty' )
    } );

    // @private {Property.<boolean>} indicates whether the mass is animating after being released
    this.isAnimatingProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isAnimatingProperty' )
    } );

    // @public {Property.<number>} vertical velocity of mass
    this.verticalVelocityProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'verticalVelocityProperty' ),
      units: 'meters/second',
      range: new RangeWithValue( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0 )
    } );

    // @public {Property.<number>} vertical acceleration of the mass
    this.accelerationProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'accelerationProperty' ),
      units: 'meters/second/second',
      range: new RangeWithValue( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 9.8 )
    } );

    // @public {Property.<number>} vertical acceleration of the mass
    this.gravityProperty = gravityProperty;

    // @public {Property.<Spring|null>}  spring that the mass is attached to
    this.springProperty = new Property( null, {
      tandem: tandem.createTandem( 'springProperty' ),
      phetioValueType: TSpring
    } );

    // @public {Property.<number>} The force of the attached spring or 0 if unattached
    this.springForceProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'springForceProperty' ),
      units: 'newtons/meters',
      range: new RangeWithValue( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0.0 )
    } );

    // Forward the value from the attached spring through to the mass's springForceProperty
    var springForceListener = this.springForceProperty.set.bind( this.springForceProperty );
    this.springProperty.link( function( spring, oldSpring ) {
      oldSpring && oldSpring.springForceProperty.unlink( springForceListener );
      spring && spring.springForceProperty.link( springForceListener );
      if ( !spring ) {
        self.springForceProperty.reset();
      }
    } );

    // @public {Property.<number>} Net force applied to mass
    this.netForceProperty = new DerivedProperty( [ this.springForceProperty, this.gravityProperty ],
      function( springForce, gravity ) {
        return springForce - self.mass * gravity;
      } );

    // Link that sets the acceleration property of the mass
    this.netForceProperty.link( function( netForce ) {
      self.accelerationProperty.set( netForce / self.mass );
    } );

    // @public {Property.<number>} Kinetic energy of the mass
    this.kineticEnergyProperty = new DerivedProperty( [ this.massProperty, this.verticalVelocityProperty, this.userControlledProperty ],
      function( mass, velocity, userControlled ) {
        return userControlled ? 0 : 0.5 * mass * Math.pow( velocity, 2 );
      } );

    // @public {Property.<number>} Gravitational potential energy of the mass
    this.gravitationalPotentialEnergyProperty = new DerivedProperty(
      [ this.massProperty, this.gravityProperty, this.positionProperty ],
      function( mass, gravity, position ) {

        // The height used is determined based on the height of the shelf the masses rest on.
        var heightFromZero = position.y - self.options.zeroReferencePoint - self.heightProperty.value;
        return ( mass * gravity * ( heightFromZero ) );
      } );

    // @public {Property.<number>} Kinetic energy of the mass
    this.elasticPotentialEnergyProperty = new DynamicProperty( this.springProperty, {
      derive: 'elasticPotentialEnergyProperty',
      defaultValue: 0
    } );

    // @public {Property.<number>} Thermal energy of the mass
    this.thermalEnergyProperty = new NumberProperty( 0 );

    // @public (read-only) Total energy of the mass
    this.totalEnergyProperty = new DerivedProperty( [
        this.kineticEnergyProperty,
        this.gravitationalPotentialEnergyProperty,
        this.elasticPotentialEnergyProperty
      ],
      function( kineticEnergy, gravitationalPotentialEnergy, elasticPotentialEnergy ) {
        return kineticEnergy + gravitationalPotentialEnergy + elasticPotentialEnergy;
      }
    );

    // @public {number}
    this.initialTotalEnergy = 0;

    this.userControlledProperty.link( function( userControlled ) {
      if ( !userControlled && self.springProperty.get() ) {

        // When a user drags an attached mass it is as if they are restarting the spring system
        self.initialTotalEnergy = self.kineticEnergyProperty.get() +
                                  self.gravitationalPotentialEnergyProperty.get() +
                                  self.elasticPotentialEnergyProperty.get();
      }
      if ( userControlled ) {
        self.verticalVelocityProperty.reset();
      }
    } );

    // As the total energy changes we can derive the thermal energy as being the energy lost from the system
    this.totalEnergyProperty.link( function( totalEnergy ) {
      if ( self.userControlledProperty.get() ) {
        // TODO: why are we not setting initialTotalEnergy here?

        //If a user is dragging the mass we remove the thermal energy.
        return self.thermalEnergyProperty.set( 0 );
      }
      // console.log( 'self.initialTotalEnergy = ' + self.initialTotalEnergy + '\t' + 'totalEnergy = ' + totalEnergy );
    } );

    // TODO: Can thermalEnergyProperty be a derivedProperty based on initialTotalEnegry (Property it) and totalEnergyProperty?
    Property.multilink( [ this.positionProperty, this.userControlledProperty ], function( position, userControlled ) {
      if ( !userControlled ) {
        self.thermalEnergyProperty.set( self.initialTotalEnergy - self.totalEnergyProperty.get() );
      }
    } );

    // Used for animating the motion of a mass being released and not attached to the spring
    this.animationStartPosition = null; // {Vector2|null}
    this.animationEndPosition = null; // {Vector2|null}
    this.animationProgress = 0; // {number} Valid values 0 <= x <= 1. Used to adjust rate of animation completion.

    // Responsible for animating the mass back to its initial position
    Property.lazyMultilink( [ this.userControlledProperty, this.springProperty ], function( userControlled, spring ) {
      if ( !userControlled && spring === null ) {
        self.animationProgress = 0;
        self.animationStartPosition = self.positionProperty.value;
        self.animationEndPosition = new Vector2( self.initialPosition.x, self.positionProperty.value.y );
        self.isAnimatingProperty.set( true );
      }
      else {
        self.isAnimatingProperty.set( false );
      }
    } );

  }

  massesAndSprings.register( 'Mass', Mass );

  return inherit( Object, Mass, {

    /**
     * Responsible for mass falling or animating without being attached to spring.
     * @param {number} gravity
     * @param {number} floorY
     * @param {number} dt
     *
     * @public
     */
    step: function( gravity, floorY, dt ) {
      if ( this.isAnimatingProperty.value ) {

        // Responsible for animating a horizontal motion when the mass is released and not attached to a spring.
        this.animationProgress = Math.min( 1, this.animationProgress + dt * 2 );
        var ratio = Easing.CUBIC_IN_OUT.value( this.animationProgress );

        // TODO: Go over with design team.
        // Diagonal animation. Remember to remove the else in the next if clause.
        // this.positionProperty.set(new Vector2 (this.animationStartPosition.blend(this.animationEndPosition,ratio).x, this.positionProperty.value.y));

        this.positionProperty.set( this.animationStartPosition.blend( this.animationEndPosition, ratio ) );
        if ( this.animationProgress === 1 ) {
          this.isAnimatingProperty.set( false );
        }
      }
      // If we're not animating/controlled or attached to a spring, we'll fall due to gravity
      else if ( this.springProperty.get() === null && !this.userControlledProperty.get() ) {
        var floorPosition = floorY + this.heightProperty.value;
        var oldY = this.positionProperty.get().y;
        if ( oldY !== floorPosition ) {
          var newVerticalVelocity = this.verticalVelocityProperty.get() - gravity * dt;
          var newY = oldY + ( this.verticalVelocityProperty.get() + newVerticalVelocity ) * dt / 2;
          if ( newY < floorPosition ) {
            // if we hit the ground stop falling
            this.positionProperty.set( new Vector2( this.positionProperty.get().x, floorPosition ) );
            this.verticalVelocityProperty.set( 0 );
          }
          else {
            this.verticalVelocityProperty.set( newVerticalVelocity );
            this.positionProperty.set( new Vector2( this.positionProperty.get().x, newY ) );
          }
        }
      }
    },

    /**
     * Detaches the mass from the spring.
     *
     * @public
     */
    detach: function() {
      this.verticalVelocityProperty.set( 0 );
      this.springProperty.set( null );
    },

    /**
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
      this.userControlledProperty.reset();
      this.springProperty.reset();
      this.verticalVelocityProperty.reset();
      this.massProperty.reset();
    },

    /**
     * @public
     */
    zeroThermalEnergy: function() {
      this.initialTotalEnergy = this.kineticEnergyProperty.get() +
                                this.gravitationalPotentialEnergyProperty.get() +
                                this.elasticPotentialEnergyProperty.get();
      this.thermalEnergyProperty.set( this.initialTotalEnergy - this.totalEnergyProperty.get() );


    }
  } );
} );