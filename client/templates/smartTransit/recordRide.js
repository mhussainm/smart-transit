var MAP_ZOOM = 15;
var gmap;
var rideInfo = {};
var geoLocations = [];

Meteor.startup(function() {  
  GoogleMaps.load({libraries: 'places'});
});

Template.recordRide.onCreated(function() {
  var self = this;

  GoogleMaps.ready('map', function(map) {
    var marker;
    var poly;
    gmap = map.instance;  
    // Create and move the marker when latLng changes.
    self.autorun(function() {
      var latLng = Geolocation.latLng();
      if (! latLng)
        return;

      geoLocations.push({
          lat: latLng.lat,
          lng: latLng.lng
      });
        
      // If the marker doesn't yet exist, create it.
      if (! marker) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(latLng.lat, latLng.lng),
          map: map.instance
        });
      }
      // The marker already exists, so we'll just change its position.
      else {
        marker.setPosition(latLng);
      }
        
      // If the poly doesn't yet exist, create it.
      if (! poly) {
          poly = new google.maps.Polyline({
            strokeColor: '#4285F4',
            strokeOpacity: 1.0,
            strokeWeight: 3,
            map: map.instance  
          });
      }
      // The poly already exists, so we'll just plot path.
      else { 
        var path = poly.getPath();
        path.push(new google.maps.LatLng(latLng.lat, latLng.lng));
      }     
        
      // Center and zoom the map view onto the current position.
      //map.instance.setCenter(marker.getPosition());
      //map.instance.setZoom(MAP_ZOOM);
    });
  });
});

Template.recordRide.events({
  
    'click [data-action="rr-start"]': function(event, template) {
  	     event.preventDefault();
         console.info('In [data-action="rr-start"]');
        
         var latlng = Geolocation.latLng();
        
         var placeSearch = new google.maps.places.PlacesService(gmap);
         placeSearch.nearbySearch({
                location: latlng,
                radius: 200//,
                //types: ['locality']
             }, 
             function(result, status) {
                 console.debug('placeSearch result \n', result);
                 console.debug('placeSearch status \n', status);
                /*
                if(result[0]) {
                    placeSearch.getDetails({placeId: result[0].place_id}, function(plResult, plStatus) {
                         console.debug('placeSearch plResult \n', plResult);
                         console.debug('placeSearch plStatus \n', plStatus);                        
                    });                    
                }
                */
                if(result[1]) {
                    
                    rideInfo.startPoint = {
                        place_id: result[1].place_id,
                        name: result[1].name,
                        vicinity: result[1].vicinity,
                        coords: {
                            lat: latlng.lat,
                            lng: latlng.lng
                        }
                    }
                    
                    var dt = new Date();                    
                    rideInfo.startTS = {
                        year: dt.getUTCFullYear(),
                        month: dt.getUTCMonth(),
                        date: dt.getUTCDate(),
                        hour: dt.getUTCHours(),
                        minute: dt.getUTCMinutes(),
                        second: dt.getUTCSeconds()
                    }                    
                }
             
                console.debug('After START rideInfo', rideInfo);
         });
        
         $(event.target).removeClass('start');
        
         $('#rr-duration').css('visibility', 'visible');                 
         $('#rr-duration').timer({
             format: '%H:%M:%S'
         });
        
        /*
        Meteor.call('smsSend', {text: smsText, phNumbers: phoneNumbers}, function(error, result) {
            console.info('After call to smsSend() \n', result);
            IonPopup.alert({
              title: 'SMSes Sent',
              template: 'Number of SMSes delivered: ?',
              okText: 'Close',
              onOk: function(event, template) {
                Router.go('/');
              }
            });            
        });
        */
    }, 
    
    'click [data-action="rr-stop"]': function(event, template) {
  	     event.preventDefault();
         console.info('In [data-action="rr-stop"]');
        
         $('#rr-duration').timer('pause');
         rideInfo.duration = {
            display:  $('#rr-duration').html(),
            seconds: $('#rr-duration').data('seconds')
         };
        
         var latlng = Geolocation.latLng();
        
         var placeSearch = new google.maps.places.PlacesService(gmap);
         placeSearch.nearbySearch({
                location: latlng,
                radius: 200//,
                //types: ['locality']
             }, 
             function(result, status) {
                 console.debug('placeSearch result \n', result);
                 console.debug('placeSearch status \n', status);
                /*
                if(result[0]) {
                    placeSearch.getDetails({placeId: result[0].place_id}, function(plResult, plStatus) {
                         console.debug('placeSearch plResult \n', plResult);
                         console.debug('placeSearch plStatus \n', plStatus);                        
                    });                    
                }
                */
                if(result[1]) {
                    
                    rideInfo.endPoint = {
                        place_id: result[1].place_id,
                        name: result[1].name,
                        vicinity: result[1].vicinity,
                        coords: {
                            lat: latlng.lat,
                            lng: latlng.lng
                        }
                    }
                    
                    var dt = new Date();                    
                    rideInfo.endTS = {
                        year: dt.getUTCFullYear(),
                        month: dt.getUTCMonth(),
                        date: dt.getUTCDate(),
                        hour: dt.getUTCHours(),
                        minute: dt.getUTCMinutes(),
                        second: dt.getUTCSeconds()
                    }                    
                    
                    rideInfo.geoLocations = geoLocations;                    
                    
                    rideInfo.transportType = $('#trans-type-button a.activated').data('val');
                    
                    Session.set('rideInfo', rideInfo);                    
                }
             
                console.debug('After STOP rideInfo', rideInfo);
             
                Router.go('/submitRide');
         });        
     },
    
     'click [data-action="rr-trantype"]': function(event, template) {
         //console.log($(event.target).data('val'));
         $(event.target).parent().find('a.button').removeClass('activated');
         $(event.target).addClass('activated');
         
         var buttons = $('.button-container').find('button');
         buttons.eq(0).addClass('start');
         buttons.eq(1).addClass('stop');
     }
});

Template.recordRide.helpers({
    
  geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
  },
  mapOptions: function() {
    var latLng = Geolocation.latLng();
    // Initialize the map once we have the latLng.
    if (GoogleMaps.loaded() && latLng) {
      return {
        center: new google.maps.LatLng(latLng.lat, latLng.lng),
        zoom: MAP_ZOOM
      };
    }
  }
    
});