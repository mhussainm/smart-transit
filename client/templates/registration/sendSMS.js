Template.sendSMS.events({
  
    'click [data-action="sendSMS"]': function(event, template) {
  	     event.preventDefault();
         console.log('In [data-action="sendSMS"]');
         var phoneNumbers = [];
         $('.farmerslist input:checked').each(function(){
            phoneNumbers.push($(this).val());
         });
         console.debug('phoneNumbers', phoneNumbers);
        
         var smsText = $('textarea[name="smsText"]').val();
         console.debug('smsText', smsText);
        
        IonPopup.alert({
          title: 'SMSes Sent',
          template: 'Number of SMSes delivered: ' + phoneNumbers.length,
          okText: 'Close',
          onOk: function(event, template) {
            Router.go('/');
          }
        });	        
    }
});

Template.sendSMS.helpers({
    
    farmerItems: function() {
        var farmers = Session.get('farmersSearchResult');
        if(farmers) {
            console.info('farmers', farmers);
        }
        else {
            console.warn('Farmers list not found in Session');                    
        }
        return farmers;
    }
});