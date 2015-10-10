Template.registration.events({
	'change [data-action="changeState"]': function(event, template) {
        var items = ['Adilabad', 'Hyderabad', 'Karimnagar', 'Khammam'];
        $.each(items, function (i, item) {
            $('select[name="district"]').append($('<option>', { 
                value: item,
                text : item 
            }));
        });		
	},

	'change [data-action="changeDistrict"]': function(event, template) {
        var items = ['Amberpet', 'Asifnagar', 'Bahadurpura', 'Bandlaguda'];
        $.each(items, function (i, item) {
            $('select[name="block"]').append($('<option>', { 
                value: item,
                text : item 
            }));
        });		
	},    

	'change [data-action="changeBlock"]': function(event, template) {
        var items = ['Charminar', 'Golconda', 'Himayathnagar', 'Shaikpet'];
        $.each(items, function (i, item) {
            $('select[name="village"]').append($('<option>', { 
                value: item,
                text : item 
            }));
        });		
	},    
    
  'click [data-action="submitRegistration"]': function(event, template) {
  	event.preventDefault();
    
    var cropsGrown = [];  
    $('.pp-cash-form ul li.item-checkbox').contents().filter(function() {
            return this.nodeType === 3;
        }).each(function() {
            var txt = $(this).text().trim();
            if(txt !== "")
                cropsGrown.push(txt);
    });      

    var formData = {
        firstName: $('.pp-cash-form input[name="firstname"]').val(),
        lastName: $('.pp-cash-form input[name="lastname"]').val(),
        phoneNumber: $('.pp-cash-form input[name="phonenumber"]').val(),
        state: $('.pp-cash-form select[name="state"] option:selected').text(),
        district: $('.pp-cash-form select[name="district"] option:selected').text(),
        block: $('.pp-cash-form select[name="block"] option:selected').text(),
        village: $('.pp-cash-form select[name="village"] option:selected').text(),
        socialCategory: $('.pp-cash-form select[name="socialcategory"] option:selected').text(),
        aadharId: $('.pp-cash-form input[name="aadharid"]').val(),
        cropsGrown: cropsGrown
    };
    
    console.info(formData);  
      
	Meteor.call('insertRegistration', formData, function(error, result) {
		if(result && result.farmerId && result.farmerId !== "") {
			IonPopup.alert({
			  title: 'Farmer Registered',
			  template: 'Farmer ID is ' + result.farmerId,
			  okText: 'Close',
			  onOk: function(event, template) {
				Router.go('/');
			  }
			});			
		}
	});
  }
});