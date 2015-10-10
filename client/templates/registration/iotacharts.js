Template.iotacharts.rendered = function() {
	// Set event listener
	Meteor.call('fetchChartData', function(error, result) {
		if(result && result.chartdata) {
            
            ChartData.upsert(
                { _id: "2000" },
                { 
                    chartDataType: "external",
                    data: result.chartdata
                }
            );            
            
            var chartdata = {
                title: {
                    text: 'Monthly Average Temperature',
                    x: -20 //center
                },
                subtitle: {
                    text: 'Source: iota Agri',
                    x: -20
                },
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '°C'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: []
            };

            ChartData.upsert(
                { _id: "1000" },
                { 
                    chartDataType: "internal",
                    data: chartdata
                }
            );            
            
            chartdata.series = result.chartdata.tempdata;
            
            $(function () {
                $('#chart-container').highcharts(chartdata);
            });            
		}
	});
};

Template.iotacharts.events( {
    
  'click [data-action="changeChart"]': function(event, template) {
        var buttonName = $(event.target).data('name');
        //console.log('In click [data-action="changeChart"] with data("name") = ' + $(event.target).data('name'));         
        
        $('button[data-action="changeChart"]').toggleClass('button-outline');
      
        var chartData = ChartData.findOne("1000").data;
        var externalChartData = ChartData.findOne("2000").data;
      
        if(buttonName === 'humidity') {
            
            if(chartData && externalChartData) {
                console.log('Valid Chart Data');
                chartData.series = externalChartData.humidata;
                chartData.title.text = 'Monthly Average Humidity';
                chartData.yAxis.title.text = 'Humidity (%)';
                chartData.tooltip.valueSuffix = '%';
                
                $('#chart-container').highcharts(chartData);
            }
            
        }
        else if (buttonName === 'temperature') {
            
            if(chartData && externalChartData) {
                chartData.series = externalChartData.tempdata;
                chartData.title.text = 'Monthly Average Temperature';
                chartData.yAxis.title.text = 'Temperature (°C)';
                chartData.tooltip.valueSuffix = '°C';
                
                $('#chart-container').highcharts(chartData);
            }
            
        }

    }
});