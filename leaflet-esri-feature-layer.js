"user strict"

Polymer( 'leaflet-esri-feature-layer', {

  created : function () {
  },

  ready : function () {
  },

  containerChanged : function () {
    if ( this.container ) {
      var icon = this.icon;
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
                details.push( text );
              }
            }
          }
          return L.marker(latlng, {
            icon: L.icon({
                           iconUrl: icon,
                           iconRetinaUrl: icon,
                           iconSize: [32, 32],
                           iconAnchor: [0, 0],
                           popupAnchor: [0, 0]
                         })
          }).bindPopup( "<div><ul><li>" + details.join("</li><li>") +"</li></ul><div>" );
        }
      });
      this.container.addLayer( this.layer );
    }
  },

  detached : function () {
    if ( this.container && this.layer ) {
      this.container.removeLayer( this.layer );
    }
  }
} );
