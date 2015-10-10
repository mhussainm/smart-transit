var MAP_ZOOM = 15;

Meteor.startup(function() {  
  GoogleMaps.load();
});

Template.recordRide.onCreated(function() {  
  GoogleMaps.ready('map', function(map) {
    var latLng = Geolocation.latLng();

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(latLng.lat, latLng.lng),
      map: map.instance
    });
  });
});

Template.recordRide.events({
  
    'click [data-action="rr-start"]': function(event, template) {
  	     event.preventDefault();
         console.info('In [data-action="rr-start"]');
        
         $(event.target).removeClass('start').addClass('start-disabled');
        
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