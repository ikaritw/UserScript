// ==UserScript==
// @name       Smart-Query Ext
// @namespace  http://ikaritw.logdown.com/
// @version    0.1
// @description  Smart-Query Ext for chrome
// @match      http://10.1.1.110/Smart-Query/*
// @require    http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL  https://github.com/ikaritw/UserScript/raw/master/Smart-Query-Ext.user.js
// @auther     jazz.lin@gigabyte.com
// @copyright  2012+, Jazz
// ==/UserScript==

createPopup = function() {
	var $oPopup = $('<div>').css({
		'position': 'absolute',
		'overflow': 'hidden'
	});
	$oPopup.isOpen = false;
	var body = $('<body>').appendTo($oPopup);
	$oPopup.document = {
		body: body[0]
	};
	$oPopup.blur(function() {
		var $oPopup = $(this);
		$oPopup.hide();
		$oPopup.isOpen = false;
	});
	$oPopup.show = function(x, y, w, h, pElement) {
		var $oPopup = $(this);
		$oPopup.css('left', x + 'px');
		$oPopup.css('top', y + 'px');
		$oPopup.css('width', w + 'px');
		$oPopup.css('height', h + 'px');
		if (pElement) {
			$oPopup.appendTo($(pElement));
		}
		$oPopup.isOpen = true;
		$oPopup.show();
		$oPopup.focus();
	};
	$oPopup.hide = function() {
		var $oPopup = $(this);
		$oPopup.hide();
		$oPopup.isOpen = false;
	};
	return $oPopup;
};

ActiveXObject = function(objectName) {
	if ("Microsoft.XMLHTTP" === objectName) {
		var xmlhttp;
		if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		} else { // code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		return xmlhttp;
	} else {
		return null;
	}
};

HTMLFormElement.prototype.all = function(id) {
	var res = $(this).find('[id="' + id + '"]');
	if(res.length > 0){
		return res[0];
	} else {
		return null;
	}
};

$(function() {
	$('#ColumnXmlObj').hide();
});