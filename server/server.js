Meteor.startup(function () {

  if (Posts.find({}).count() === 0) {
    Posts.insert({
      title: Fake.sentence(),
      body: Fake.paragraph(),
      published: Fake.fromArray([true, false])
    });
  }
	
	ChartData.upsert(
		{ _id: "1000" },
		{ 
			chartDataType: "internal"
		}
	);    
    
	ChartData.upsert(
		{ _id: "2000" },
		{ 
			chartDataType: "external"
		}
	);    
	
	// For Notification
	Triggers.upsert(
		{ trigger: "showDepositAcceptedPopup" },
		{ 
			trigger: "showDepositAcceptedPopup", 
			state: false 
		}
	);


});


Meteor.methods({
    
	"resetDepositAcceptedPopupVar": function() {
		console.log("HUSSAIN - In resetDepositAcceptedPopupVar()");
	
		Triggers.upsert(
			{ trigger: "showDepositAcceptedPopup" },
			{ 
				trigger: "showDepositAcceptedPopup", 
				state: false 
			}
		);
	},
	
    "insertRideInfo": function(data) {
        
        Meteor.http.post(
            "https://api-eu.clusterpoint.com/v4/2531/SmartTransRideInfo", 
              { 
                headers : { 'Authorization':'Basic bWhtYW5hc2hpYUBnbWFpbC5jb206cm9ja2llcw==' },
                data: data
              }, 
              function(error, result) {

                if(!error) {
                    console.log("Successful Insert");
                }
                else {
                    console.log(result.content);
                }
         });        
    },
    
    "fetchChartData": function() {
        console.log("HUSSAIN - In fetchChartData()");    
        
        var response = Meteor.http.get("http://demo5783733.mockable.io/iotaseriesdata");
        if (response && response.statusCode == 200) {
            return JSON.parse(response.content);
        }
        else {
            console.log("Error in fetching chart data");
        }
    },
    
	"insertRegistration": function(data) {
		console.log("HUSSAIN - In insertRegistration()");
        
        var id = Farmers.insert(data);
        
        data.id = id;
        
        Meteor.http.post("https://api-eu.clusterpoint.com/2008/iotahackday.json", 
          { 
            headers : { 'Authorization':'Basic c2FpLnAyM0BnbWFpbC5jb206OTQ5MTUyODU0OQ==' },
            data: data
          }, function(error, result) {

                if(!error) {
                    console.log("Successful Insert");
                }
                else {
                    console.log(result.content);
                }

          });
        
        return { farmerId: (4346 + Math.floor(Math.random() * (200 - 4) + 4))}
	},
    
    "smsSend": function(data) {
        console.log('In sendSMS() ' + JSON.stringify(data));
        
        var js2xmlparser = Meteor.npmRequire("js2xmlparser");
        
        var message = {
            'AUTHKEY': '94408AuNrHSRv56133921',
            'SENDER': 'MHUSNM',
            'ROUTE': '4',
            'COUNTRY': '91',
            'SMS': {
                '@': {
                    'TEXT': 'This is a Test SMS & more >'
                },
                'ADDRESS': {
                    '@': {
                        'TO': '9704084624'
                    }
                }
            }
        };
        
        var options = {
            declaration: {
                include: false
            }    
        };
        
        var xmlString = js2xmlparser("MESSAGE", message);
        
        console.log(xmlString);
                                
        Meteor.http.post("https://control.msg91.com/api/postsms.php", 
                         { content: 'data=' + xmlString }, 
                         function(error, result) {
            
            console.log('Result from MSG91 Send SMS API: ' + JSON.stringify(result));
            
            console.log('Error from MSG91 Send SMS API: ' + error);
        });
    }
});