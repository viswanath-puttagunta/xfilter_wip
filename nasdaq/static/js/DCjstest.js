var linechart = dc.lineChart("#chart1");
var composite = dc.compositeChart("#chart2");

d3.csv("/static/data/data.csv", function(error, volts) {

	volts.forEach(function(d) {
		d.line0_volts = +d.line0_volts;
		d.line013_time = +d.line013_time;
		d.line1_volts = +d.line1_volts;
		d.line2_volts = +d.line2_volts;
		d.line2_time = +d.line2_time;
		d.line3_volts = +d.line3_volts;
	});
	
	var ndx = crossfilter(volts);	
	var timeDimension = ndx.dimension(function (d) {
		return d.line013_time;
	});
	
	var line0Group = timeDimension.group().reduceSum(function(d) {return d.line0_volts;});
	var line1Group = timeDimension.group().reduceSum(function(d) {return d.line1_volts;});
	var line3Group = timeDimension.group().reduceSum(function(d) {return d.line3_volts;});
	
	linechart
//		.renderArea(true)
		.width(990)
		.height(200)
		.transitionDuration(1000)
		.mouseZoomable(false)
		.dimension(timeDimension)
		.group(line0Group)
		.colors('blue')
		.elasticY(true)
		.x(d3.scale.linear().domain([0,2]));

	composite
		.width(990)
		.height(200)
		.transitionDuration(1000)
		.mouseZoomable(false)
		.rangeChart(linechart)
		.brushOn(false)
		.elasticY(true)
		.x(d3.scale.linear().domain([0,2]))
		.legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
		.compose([
			dc.lineChart(composite)
				.dimension(timeDimension)
				.colors('blue')
				.group(line0Group, "Line 0"),
			dc.lineChart(composite)
				.dimension(timeDimension)
				.colors('red')
				.group(line1Group, "Line 1"),
			dc.lineChart(composite)
				.dimension(timeDimension)
				.colors('green')
				.group(line3Group, "Line 3")
			]);
	
	
	dc.renderAll();
	
});
