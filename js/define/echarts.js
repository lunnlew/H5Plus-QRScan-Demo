requirejs.config({
    baseUrl: '../js/lib',
    paths: {
        "app": '../app',
        "define": '../define',
        "jquery": "../lib/jquery",
        "mui": "../lib/mui"
    },
    shim: {
        "echarts-all": {
            exports: "echarts"
        }
    }
});
define(['echarts-all'], function(echarts) {
	var getOption = function(chartType) {
				var chartOption = {
					legend: {
						data: ['七日收益']
					},
					grid: {
						x: 35,
						x2: 10,
						y: 30,
						y2: 25
					},
					toolbox: {
						show: false,
						feature: {
							mark: {
								show: true
							},
							dataView: {
								show: true,
								readOnly: false
							},
							magicType: {
								show: true,
								type: ['line', 'bar']
							},
							restore: {
								show: true
							},
							saveAsImage: {
								show: true
							}
						}
					},
					calculable: false,
					xAxis: [{
						type: 'category',
						data: ['1', '2', '3', '4', '5', '6', '7']
					}],
					yAxis: [{
						type: 'value',
						splitArea: {
							show: true
						}
					}],
					series: [{
						name: '七日收益',
						type: chartType,
						data: [0.1, 0.15, 0.2, 0.5, 0.3, 0.45, 0.23]
					}]
				};
				return chartOption;
			};
			var byId = function(id) {
				return document.getElementById(id);
			};
			var lineChart = echarts.init(byId('lineChart'));
			lineChart.setOption(getOption('line'));
});
