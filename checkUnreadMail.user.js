// ==UserScript==
// @name       checkUnreadMail
// @namespace  http://ikaritw.logdown.com/
// @version    0.1
// @description  check the unread mail of gigabyte Webmail
// @match      https://webmail.gigabyte.com/owa/
// @match      https://webmail.gigabyte.com/owa/?modurl=0
// @require    http://code.jquery.com/jquery-2.1.1.min.js
// @copyright  2014+, jazz.lin
// @author     jazz.lin@gigabyte.com
// ==/UserScript==

Array.prototype.insert = function(index) {
	index = Math.min(index, this.length);
	arguments.length > 1 && this.splice.apply(this, [index, 0].concat([].pop.call(arguments))) && this.insert.apply(this, arguments);
	return this;
};

UserScript = {
	"name": "checkUnreadMail",
	"version": "0.1"
};

$(function() {
	(function() {
		var checkUnreadSecond = 30;
		var checkUnRead = function() {
			var splitStr = " - ";
			var ur = document.getElementsByClassName('ur');
			var ti = document.title.split(splitStr);
			var unreadMark = ur.length + "則未讀信件";
			if (ti.length == 2) {
				ti.insert(0, unreadMark);
			} else if (ti.length == 3) {
				ti[0] = unreadMark;
			}
			document.title = ti.join(splitStr);
		};
		setTimeout((function() {
			checkUnRead();
			__checkUnReadInt = setInterval(checkUnRead, 1000 * checkUnreadSecond);
		}), 1000);

		var initNotification = function() {
			console.info("initNotification覆寫開始");
			UserScript['showNotifications'] = function(k, h, c) {
				//show('Slack Notification', 'Hey! It works.', {id: 'test_notification'});
				if ("granted" !== window.Notification.permission) {
					console.log("未取得Notification權限:" + k + ":" + h);
					return;
				}
				var f;
				if (window.webkitNotifications) {
					f = window.webkitNotifications.createNotification(k, h);
				} else if (window.Notification) {
					f = new Notification(k, {
						body: h,
						icon: "http://10.1.100.174/sprites-email-lg.png",
						tag: "tag_" + (c ? c.id || c.ts || new Date().getTime() : new Date().getTime())
					});
				}

				if (!f) {
					console.error("Browser不支援Notification");
					return;
				}
				try {
					f.onclick = function() {
						window.focus();
						if (this.cancel) {
							this.cancel();
						} else if (this.close) {
							this.close();
						}
					}
				} catch (d) {}

				function a() {
					setTimeout(function() {
						if (f.cancel) {
							f.cancel();
						} else if (f.close) {
							f.close();
						}
					}, 1000 * 30)
				}

				if (f) {
					try {
						f.onshow = a;
						setTimeout(a, 1000 * 1);
					} catch (d) {
						a();
					}

					if (f.show) {
						f.show();
					}
				}
			};

			if (shwNwItmDlg) {
				__shwNwItmDlg = shwNwItmDlg;
				shwNwItmDlg = function(c, e, a, d) {
					//shwNwItmDlg("寄件者", "主旨", "lnkNwMl", "");
					__shwNwItmDlg(c, e, a, d);
					UserScript['showNotifications']("from " + c, e, null);
					checkUnRead();
				};
				console.info("showNotifications覆寫完成");
			} else {
				console.error("查無函數:shwNwItmDlg");
			}
		};

		var NotificationPermission = window.Notification.permission;
		if ("granted" === NotificationPermission) {
			console.info("準備覆寫shwNwItmDlg");
			__initNotificationInt = setTimeout(initNotification, 1000 * 1);
		} else {
			//default|denied
			console.warn("權限為" + NotificationPermission + ",新增取得權限的按鈕");
			var $getPermitButton = $('<span id="getPermit" class="userTileTxt">取得權限</span>').on('click', function() {
				Notification.requestPermission(function(status) {
					console.log("Notification.permission:" + status);
					if ("granted" === status) {
						console.info("準備覆寫shwNwItmDlg");
						__initNotificationInt = setTimeout(initNotification, 1000 * 1);
					} else {
						console.warn("取得權限失敗");
					}
					$getPermitButton.remove(); //移除權限按鈕
				});
			}).appendTo($('#aUserTile')).css({
				'color': 'red'
			});
		}
	})();
});