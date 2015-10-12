
var calcDistance = function (lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var radlon1 = Math.PI * lon1/180
	var radlon2 = Math.PI * lon2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
};

var rideInfo = undefined;

Template.submitRide.events({
  
    'click [data-action="rr-submit"]': function(event, template) {
  	     event.preventDefault();
   
        console.info('In [data-action="rr-submit"]');
        
        if(! rideInfo) {
            rideInfo = Session.get('rideInfo');
        }  
        
        rideInfo.farePaid = $('#rr-fare-paid').val();
        
        console.log(JSON.stringify(rideInfo));
        
        Meteor.call('insertRideInfo', rideInfo, function(error, result) {
            console.info('After call to insertRideInfo() \n', result);

            IonPopup.prompt({
              title: 'Ride Details Submitted',
              template: 'Thank you for sharing the ride information. <strong>Please enter your mobile phone number to create a User ID to track how useful your submission is.</strong>',
              inputType: 'number',
              inputPlaceholder: 'Your Mobile Number',
              okText: 'Submit',                
              onOk: function(event, template) {
                Router.go('/');
              }                
            });            
        });
        
    }    
});

Template.submitRide.helpers({
  
  transportType: function() {
    if(! rideInfo) {
        rideInfo = Session.get('rideInfo');
    }
    return rideInfo.transportType.substring(0, 1).toUpperCase() + rideInfo.transportType.substring(1);
  },  
  startLocation: function() {
    if(! rideInfo) {
        rideInfo = Session.get('rideInfo');
    }
    return rideInfo.startPoint.name;
  },
  endLocation: function() {
    if(! rideInfo) {
        rideInfo = Session.get('rideInfo');
    }
    return rideInfo.endPoint.name;
  },
  timeTaken: function() {
    if(! rideInfo) {
        rideInfo = Session.get('rideInfo');
    }      
    return rideInfo.duration.display;
  }, 
  distance: function() {
    if(! rideInfo) {
        rideInfo = Session.get('rideInfo');
    }
    var start = rideInfo.startPoint.coords;
    var end = rideInfo.endPoint.coords;
    return calcDistance(start.lat, start.lng, end.lat, end.lng, 'K').toFixed(1);
  }                            
});