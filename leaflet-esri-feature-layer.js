"user strict"

Polymer( 'leaflet-esri-feature-layer', {

  cache : false,
  size : [ 32, 32 ],

  observe: {
    'container storage': 'containerChanged'
  },

  created : function () {
  },

  ready : function () {
  },

  add : function( key, data ) {
    this.storage.add( key, data );
  },

  get : function( key, callback, fallback ) {
    this.storage.get( key, function( value ) {
      if ( value ) {
        callback( value );
      }
      else {
        fallback();
      }
    }, function() {
      fallback();
    } );
  },

  requestFeatures : function( context ) {
    var original = context._requestFeatures;
    return function( bounds, coords, requestCallback ) {
      var args = arguments;
      this.get( JSON.stringify( coords ), function( value ) {
        var featureCollection = value;
        if ( featureCollection.features.length ) {
          context._addFeatures( featureCollection.features, coords );
        }
        if ( requestCallback ) {
          requestCallback.call( context, error, featureCollection );
        }
      }.bind( this ), function() {
        original.apply( context, [ bounds, coords, function( err, value ) {
          this.add( JSON.stringify( coords ), value );
        }.bind( this ) ] );
      }.bind( this ) )
    }.bind( this );
  },

  containerChanged : function () {

    if ( this.container ) {
      var icon = this.icon;
      var size = this.size;
      var url = this.url;

      this.layer = L.esri.featureLayer( url, {
        pointToLayer: function (geojson, latlng) {
          function trim( text ) {
            return text && ( text = text.toString() )  && text.toLowerCase() != 'null' ? text : '';
          }
          var details = [];
          for( var prop in geojson.properties ) {
            if ( geojson.properties.hasOwnProperty( prop ) ) {
              var text = trim( geojson.properties[prop] );
              if ( text && text.length > 0 ) {
                //details.push( { dt: prop, dd: text } );
                details.push( prop + "</dt><dd>" + text );
              }
            }
          }
          return L.marker(latlng, {
            icon: L.icon({
                           iconUrl: icon,
                           iconRetinaUrl: icon,
                           iconSize: size,
                           iconAnchor: [0, 0],
                           popupAnchor: [0, 0]
                         })
          }).bindPopup( "<div><dl class='multiple-table'><dt>" + details.join("</dd><dt>") +"</dd></dl><div>" );
        }
      });
      if ( this.storage && this.cache ) {
        this.layer._requestFeatures = this.requestFeatures( this.layer );
      }
      this.container.addLayer( this.layer );
    }
  },

  detached : function () {
    if ( this.container && this.layer ) {
      this.container.removeLayer( this.layer );
    }
  }
} );
