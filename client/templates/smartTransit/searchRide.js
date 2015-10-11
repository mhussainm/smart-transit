
Template.searchRide.events({
  
    'click [data-action="rr-submit"]': function(event, template) {
  	     event.preventDefault();
   
        console.info('In [data-action="rr-submit"]');
        
        if(! rideInfo) {
            rideInfo = Session.get('rideInfo');
        }  
        
        rideInfo.farePaid = $('#rr-fare-paid').val();
        
        console.log(btoa('mhmanashia@gmail.com:rockies')); // bWhtYW5hc2hpYUBnbWFpbC5jb206cm9ja2llcw==
        
        /*
        $.ajax({
            url       : 'https://api-eu.clusterpoint.com/v4/2531/SmartTransRideInfo',
            type      : 'POST',
            dataType  : 'json',
            data      : rideInfo,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + btoa('mhmanashia@gmail.com:rockies'));
            },
            success   : function (data) {
                console.info('success', data);
            },
            fail      : function (data) {
                console.error('error', data.error);
            }
        });        
        */
        
        console.log(JSON.stringify(rideInfo));
        
        Meteor.call('insertRideInfo', rideInfo, function(error, result) {
            console.info('After call to insertRideInfo() \n', result);
            IonPopup.alert({
              title: 'Ride Details',
              template: 'Thank you for sharing the ride information!',
              okText: 'Close',
              onOk: function(event, template) {
                Router.go('/');
              }
            });            
        });
        
    }    
});

Template.searchRide.helpers({
  
  transportType: function() {
    if(! rideInfo) {
        rideInfo = Session.get('rideInfo');
    }
    return rideInfo.transportType.substring(0, 1).toUpperCase() + rideInfo.transportType.substring(1);
  }                            
});