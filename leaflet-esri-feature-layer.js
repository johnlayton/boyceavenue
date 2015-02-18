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
                //details.push( { dt: prop, dd: text } );
                details.push( prop + "</dt><dd>" + text );
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
          }).bindPopup( "<div><dl class='multiple-table'><dt>" + details.join("</dd><dt>") +"</dd></dl><div>" );
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
