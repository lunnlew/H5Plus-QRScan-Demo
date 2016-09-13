requirejs.config({
	baseUrl: '../js/lib',
	paths: {
		"app": '../app',
		"define": '../define',
		"jquery": "../lib/jquery",
		"mui": "../lib/mui"
	},
	shim: {
		"define/app": {
			exports: "app"
		},
		"mui/mui.min": {
			exports: "mui"
		},
		"mui/mui.enterfocus": {
			deps: ['mui/mui.min']
		}
	}
});

// Start the main app logic.
requirejs(['define/app', 'mui/mui.min', 'mui/mui.enterfocus' /*, 'define/bughd', 'define/bugtags'*/ ], function(app, mui) {

	mui.init({
		statusBarBackground: '#f7f7f7'
	});
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");

		// 创建支持
		var filter = [plus.barcode.QR,plus.barcode.AZTEC];
		var scan = new plus.barcode.Barcode('bcid',filter);
		scan.onmarked = function(type, result) {
			var text = '未知: ';
			switch(type) {
				case plus.barcode.QR:
					text = 'QR: ';
					break;
				case plus.barcode.AZTEC:
					text = 'AZTEC：';
					break;
			}
			//scan.cancel();
			//scan.close();
			//scan.start();
			app.util.log(text + result);
		}
		
		scan.start();

		var backButtonPress = 0;
		mui.back = function(event) {
			backButtonPress++;
			if(backButtonPress > 1) {
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 1000);
			return false;
		};
	});
});