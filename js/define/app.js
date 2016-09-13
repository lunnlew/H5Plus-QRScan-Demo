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
			exports: "app",
			deps: ['mui/mui.min']
		},
		"mui/mui.min": {
			exports: "mui"
		},
		"mui/mui.enterfocus": {
			deps: ['mui/mui.min']
		},
		"mui/mui.view": {
			deps: ['mui/mui.min']
		},
		"mui/mui.locker": {
			deps: ['mui/mui.min']
		}
	}
});

define(['mui/mui.min', 'mui/mui.enterfocus' /*, 'define/bughd', 'define/bugtags'*/ ], function(mui) {
	(function($, owner, document, window) {
		//工具函数
		var util = owner.util = {};

		util.showWaiting = function(txt, option) {
			// option = option || {
			//     //width: 64,
			//     //height: 64,
			//     //color:'#fff',
			//     //size:'14px',
			//     //textalign:'center',
			//     padding: '0px',
			//     //background: '#0A0',
			//     padlock: true,
			//     loading: {
			//         display: 'inline',
			//         icon: '../images/loading.png',
			//     }
			// };
			plus.nativeUI.showWaiting(txt, option);
		}
		util.closeWaiting = function() {
			plus.nativeUI.closeWaiting();
		}
		util.checkEmail = function(email) {
			email = email || '';
			return(email.length > 3 && email.indexOf('@') > -1);
		};
		util.checkUpdate = function() {
			var app = {};
			plus.runtime.getProperty(plus.runtime.appid, function(inf) {
				app.version = inf.version;
			});
			var server = "http://www.dcloud.io/check/update"; //获取升级描述文件服务器地址
			mui.getJSON(server, {
				"appid": plus.runtime.appid,
				"version": app.version,
				//"imei": plus.device.imei
			}, function(data) {
				if(data.status) {
					util.log('update type:' + data.type);
					// data.url="http://demo.dcloud.net.cn/helloh5/update/HelloH5.wgtu";
					// data.type =1;
					// data.note = '1.修正更新';
					// data.title = '资源更新';
					plus.ui.confirm(data.note, function(btn) {
						if(0 == btn.index) {
							switch(data.type) {
								case 3:
									util.updateByApp(data.url);
									break;
								case 2:
									util.updateBywgt(data.url);
									break;
								case 1:
								default:
									util.updateBywgtu(data.url);
									break;
							}
						}
					}, data.title, ["立即更新", "取　　消"]);
				} else {
					mui.toast('佰商汇已是最新版本~')
				}
			});
		};
		/**
		 *整体更新
		 */
		util.updateByApp = function(url) {

		};
		/**
		 *资源整体更新
		 */
		util.updateBywgt = function(url) {

		};
		/**
		 *资源差量更新
		 */
		util.updateBywgtu = function(url) {
			plus.nativeUI.showWaiting("升级中...");
			var dtask = plus.downloader.createDownload(url, {
				filename: "_doc/update/"
			}, function(d, status) {
				util.log(status);
				if(status == 200) {
					util.log("下载wgt成功:" + d.filename);
					plus.runtime.install(d.filename, {
						force: true
					}, function() {
						plus.nativeUI.closeWaiting();
						util.log("安装wgt文件成功！");
						plus.nativeUI.alert("更新完成，立即重启！", function() {
							plus.runtime.restart();
						});
					}, function(e) {
						plus.nativeUI.closeWaiting();
						util.log("安装wgt文件失败[" + e.code + "]：" + e.message);
					});
				} else {
					plus.nativeUI.closeWaiting();
					util.log("下载wgt失败！");
				}
			});
			dtask.addEventListener('statechanged', function(d, status) {
				util.log("statechanged: " + d.state);
			});
			dtask.start();

		};
		/**
		 * 请求 短信验证码
		 */
		util.sendCode = function(mobile, callback) {
			mui.ajax(API_URL + '/Api/Index/sendVerifyCode.json', {
				data: {
					mobile: mobile,
					pt: 'app'
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					if(data.code != CODE.SUCCESS) {
						return callback(data.msg);
					} else {
						return callback(data.msg);
					}
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					return callback('网络异常，发送失败!');
				}
			});
		};

		/**
		 * 手机存在性检查
		 */
		util.phoneVerify = function(mobile, callback) {
			mui.ajax(API_URL + '/Api/Index/phoneVerify', {
				data: {
					mobile: mobile,
					pt: 'app'
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					return callback(data.code, data.msg, data.data);
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					return callback('网络异常!!');
				}
			});
		};

		util.log = function(message, args, code, module) {
			try {
				throw new Error();
			} catch(e) {
				var loc = e.stack.replace(/Error\n/).split(/\n/)[1].replace(/^\s+|\s+$/, "");
				console.log('Location:' + loc);
				console.log('[{0}][{1}]{2} {3} {4}'.format(module || 'app', (new Date()).format('MM-dd hh:mm:ss'), message || '', JSON.stringify(args) || '', code || 0));

			}
		}

		util.getParams = function(params) {
			var t = owner.getState();
			var data = jsonMerge(t, params, true);
			util.log('post data ', data);
			return data;
		}

		util.ajax = function(url, params) {
			mui.ajax(API_URL + url, params);
		}

		util.uploader = function(url, options, workerCB, completedCB) {
			var task = plus.uploader.createUpload(url, options, completedCB);
			workerCB(task);
			return task;
		}
		util.getGEOStatus = function() {
			var context = plus.android.importClass("android.content.Context");
			var locationManager = plus.android.importClass("android.location.LocationManager");
			var main = plus.android.runtimeMainActivity();
			var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
			return mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER);
		}
		//====能力扩展====
		String.prototype.format = function() {
			if(arguments.length == 0) return this;
			for(var s = this, i = 0; i < arguments.length; i++)　 s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
			return s;
		};
		Date.prototype.format = function(format) {
			var o = {
				"M+": this.getMonth() + 1,
				// month
				"d+": this.getDate(),
				// day
				"h+": this.getHours(),
				// hour
				"m+": this.getMinutes(),
				// minute
				"s+": this.getSeconds(),
				// second
				"q+": Math.floor((this.getMonth() + 3) / 3),
				// quarter
				"S": this.getMilliseconds()
					// millisecond
			};
			if(/(y+)/.test(format) || /(Y+)/.test(format)) {
				format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			for(var k in o) {
				if(new RegExp("(" + k + ")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
				}
			}
			return format;
		};

		function jsonMerge(des, src, override) {
			if(src instanceof Array) {
				for(var i = 0, len = src.length; i < len; i++)
					jsonMerge(des, src[i], override);
			}
			for(var i in src) {
				if(override || !(i in des)) {
					des[i] = src[i];
				}
			}
			return des;
		}

	}(mui, window.app = {}, document, window));

	return window.app;
});