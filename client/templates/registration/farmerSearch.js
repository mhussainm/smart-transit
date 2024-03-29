Template.farmerSearch.events({
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
    
  'click [data-action="searchFarmers"]': function(event, template) {
  	event.preventDefault();
    /*
    var cropsGrown = [];  
    $('.pp-search-form ul li.item-checkbox').contents().filter(function() {
            return this.nodeType === 3;
        }).each(function() {
            var txt = $(this).text().trim();
            if(txt !== '')
                cropsGrown.push(txt);
    });      
    */
    var searchData = {
        firstName: $('.pp-search-form input[name="firstname"]').val(),
        lastName: $('.pp-search-form input[name="lastname"]').val(),
        phoneNumber: $('.pp-search-form input[name="phonenumber"]').val(),
        state: $('.pp-search-form select[name="state"] option:selected').text(),
        district: $('.pp-search-form select[name="district"] option:selected').text(),
        block: $('.pp-search-form select[name="block"] option:selected').text(),
        village: $('.pp-search-form select[name="village"] option:selected').text(),
        socialCategory: $('.pp-search-form select[name="socialcategory"] option:selected').text(),
        aadharId: $('.pp-search-form input[name="aadharid"]').val() /*,
        cropsGrown: cropsGrown */        
    };
    
     
    console.info('searchData', searchData);
      
    var searchable = {};
    for(prop in searchData) {
        if(searchData[prop] && searchData[prop] !== '' && searchData[prop] !== '- Select -') {
            searchable[prop] = searchData[prop];
        }    
    }
      
    console.info('searchable', searchable);
      
    //console.debug(Farmers.find({ village: "Charminar" }).fetch());
    console.debug(Farmers.find(searchable).fetch());
    Session.set('farmersSearchResult', Farmers.find(searchable).fetch())  
    
    Router.go('/sms');
  }
});