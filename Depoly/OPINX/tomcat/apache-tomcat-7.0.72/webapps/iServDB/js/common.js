/**
 * 讀取一般文字檔案
 * @author kevinchang01
 * @version 1.0
 * @param url  json url
 * @param data url參數
 * @param callback 讀取成功後的callback
 * @return json object
 */
function getFile(url,data,callback){
	if ( jQuery.isFunction( data ) ) {
		callback = data;
		data = null;
	}

	var res = jQuery.ajax({
		type: "GET",
		url: url,
		data: data,
		success: callback,
		async: false
	});

	if(res.status == "200"){			
		return res.responseText;		
	}else{
		return null;
	}
}

/**
 * 讀取Json檔案
 * @author shine
 * @version 1.0
 * @param url  json url
 * @param data url參數
 * @param callback 讀取成功後的callback
 * @return json object
 */
function getJson(url,data,callback){
	if ( jQuery.isFunction( data ) ) {
		callback = data;
		data = null;
	}

	var res = jQuery.ajax({
		type: "GET",
		url: url,
		data: data,
		success: callback,
		async: false
	});

	if(res.status == "200"){			
		var obj = {};
		try{
			obj = JSON.parse(res.responseText);	
		}catch(e){
			console.log("getJson parse json error! ", res);
		}	
		return obj;		
	}else{
		return null;
	}
}

/**
 * Second to Time
 * @author Luphia
 * @version 1.0 2012/03/08
 * @param sec Int
 * @return String 00:00:00
 */
var secToTime = function(sec) {
	var zn = 2;

	var h = Math.floor(sec / 3600);
	var m = Math.floor((sec % 3600) / 60);
	var s = sec % 60;
	h = h.toString();
	m = m.toString();
	s = s.toString();
	for(var i = h.length; i < zn; i++)
	{
		h = "0" + h;
	}
	for(var i = m.length; i < zn; i++)
	{
		m = "0" + m;
	}
	for(var i = s.length; i < zn; i++)
	{
		s = "0" + s;
	}
	
	return h + ":" + m + ":" + s;
}

/**
 * Display Byte
 * @author Luphia
 * @version 1.0 2012/03/19
 * @param myByte
 * @return size Byte, KB, MB, GB, TB, EB, ZB, YB
 */
function displayByte(myByte, unit) {
	var ua = ["Byte", "KB", "MB", "GB", "TB", "EB", "ZB", "YB"];

	if(typeof(unit) == 'undefined') 
	{
		unit = 0;
	}
	
	if(isArray(myByte)) 
	{

		while(true) 
		{
			tmpcheck = false;
			for(var key in myByte) 
			{
				if(myByte[key] >= 10000) 
				{
					tmpcheck = true;
				}
			}

			if(tmpcheck) 
			{
				for(var key in myByte) 
				{
					myByte[key] = Math.round(myByte[key] / 1024);
				}
				unit++;
			}
			else 
			{
				break;
			}
		}
	}
	else 
	{
		while(myByte > 1024)
		{
			myByte = Math.round(myByte / 1024 * 100) / 100;
			unit ++;
		}
	}

	var data = [myByte, ua[unit], data = myByte + " " + ua[unit]];
	
	return data;
}

/**
 * Check Is Array
 * @author Luphia
 * @version 1.0 2012/02/13
 * @param input Array or Not Array
 * @return Boolean
 */
function isArray(input) {
	return input instanceof Array || input instanceof Object;
}

/**
 * Convert array to JSON String
 * @author Luphia
 * @version 1.0 2012/04/20
 * @param Array
 * @return String
 */
function arrayToJSON(data) {
	var s = "";
	if( isArray(data) ){
		var isObj = 0;
		var size = 0;
		
		//check value type
		for(key in data) 
		{
			//20140128 shine mod 增加hasOwnProperty判斷
			if (data.hasOwnProperty(key)) 
			{		
				size ++;
				if( isNaN(parseInt(key, 10)) ) 
				{ 
					//key is string
					isObj = 1;
				} 
				else 
				{
					//key is index , check sort
					var na = data.length;
					var tmp = data;
					//hack for ie
					data = Array();

					for(var j = 0; j < na; j++)
					{
						if( typeof(tmp[j]) == "undefined" )
						{
							data[j] = "";
						} 
						else 
						{
							data[j] = tmp[j];
						}
					}
				}

				break;
			}
		}

		for(key in data) {
			//20140128 shine mod 增加hasOwnProperty判斷
			//20140310 Luphia 增加判斷該欄位非 undefined
			if (data.hasOwnProperty(key) && data[key] != "undefined") {				
				var value = data[key];
				if( isObj ){
					if(s) { s += ','; }
					s += '"' + key + '":' + arrayToJSON(value);
				} else {
					if(s) { s += ','; }
					s += arrayToJSON(value);
				}
			}
		}

		if(size == 0) {
			s = '{}';
		} else if(isObj) {
			s = '{' + s + '}';
		} else {
			s = '[' + s + ']';
		}
	} else {
		if(typeof(data) == 'string'){
			// care for the escapes
			s = '"' + data.replace(/"/g, '\\"') + '"';
		} else {
			s = data.toString();
		}
	}
	
	return s;
}

/**
 * Loading XML (!-- jQuery is better)
 * @author Luphia
 * @version 1.0 2012/02/09
 * @param xmlFile The file name with path
 * @return xml document
 */
function loadXmlFile(xmlFile){
	var xmlDom = null;
	
	if(tmpHTTP) {
		xmlDom = tmpHTTP;
	} else {
	
		if (window.ActiveXObject)
		{
			xmlDom = new ActiveXObject("Microsoft.XMLDOM");
			//xmlDom.loadXML(xmlFile);	// for String
			xmlDom.load(xmlFile);		// for File
		}
		else if (document.implementation && document.implementation.createDocument)
		{
			var xmlhttp = new window.XMLHttpRequest();
			xmlhttp.open("GET", xmlFile, false);
			xmlhttp.send(null);
			xmlDom = xmlhttp.responseXML;
		}
		else
		{
			xmlDom = null;
		}
		
		tmpHTTP = xmlDom;
	}

	return xmlDom;
}
/**
 * 去除陣列中重複的值後回傳
 * @param arr
 * @returns
 */
function arrayUnique(arr) {
    arr.sort( function(a, b) { return a - b; } );
    var copy = arr.slice(0);
    arr.length = 0;

    for (var i = 0, len = copy.length; i < len; ++i) {
        if (i == 0 || copy[i] != copy[i - 1]) {
            arr.push(copy[i]);
        }
    }
    return arr;
}

//20131209 佳誼 add 快速排序法(三個function:swap、quick_sort、partition)
function swap(Data,i,j){
	var tmp = Data[i];
	Data[i] = Data[j];
	Data[j] = tmp;
}
function quick_sort(Data,p,r,valueCol){
    if(p < r){
       var q = partition(Data,p,r,valueCol); 
       quick_sort(Data, p, q-1,valueCol);
       quick_sort(Data, q+1, r,valueCol);
    }
}
function partition(Data,p,r,valueCol){ 
    var x = Data[r][valueCol];//最右邊為支點
    var i = p - 1;
    for(var j = p; j <= r-1; j++){	
		//大到小(如果要改小到大變<=)
        if(parseInt(Data[j][valueCol],10) >= parseInt(x,10)) 
        {
            i = i+1;
            swap(Data,i,j);
        }
    }
    swap(Data,i+1,r);
    return i+1;
}

/**
 * show loading form
 * @author Nino
 * @version 1.0 2015/12/22
 * @return Boolean
 */
function showLoadinForm(show){
	if(show){
		$("body").append('<div class="lock"><div class="spinner"><div class="dot1"></div><div class="dot2"></div></div></div>');
		$("body").css({ overflow: 'hidden' });
	}else{
		$(".lock").remove();
		$("body").css({ overflow: 'inherit' })
	}
}

function showLoadingForm(show) {
	if(show) {
		$("body").append('<div class="lock"><div class="spinner"><div class="dot1"></div><div class="dot2"></div></div></div>');
		$("body").css({ overflow: 'hidden' });
	} else {
		$(".lock").remove();
		$("body").css({ overflow: 'inherit' })
	}
}

//去除換行、tab和左右空白
function removeBreakLineAndTab(value){
	var value = value.replace(/\n/g,"<br>").replace(/\t/g,"").trim();
	return value;
}
/*
* 20160414 remove html tag with regex
*/
function removeHTMLTag(_string) {
	if (typeof _string == "string") {
		var regex = /(<([^>]+)>)/ig
		,   result = _string.replace(regex, "");
		return result;
	} else {
		return _string;
	}
}
//偵測使用瀏覽器及其版本
var BrowserDetect = {
		init: function () {
			this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
			this.version = this.searchVersion(navigator.userAgent)
				|| this.searchVersion(navigator.appVersion)
				|| "an unknown version";
			this.OS = this.searchString(this.dataOS) || "an unknown OS";
		},
		searchString: function (data) {
			for (var i=0;i<data.length;i++)	{
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch || data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1)
						return data[i].identity;
				}
				else if (dataProp)
					return data[i].identity;
			}
		},
		searchVersion: function (dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1) return;
			return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
		},
		dataBrowser: [
			{
				string: navigator.userAgent,
				subString: "Chrome",
				identity: "Chrome"
			},
			{ 	string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			},
			{
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari",
				versionSearch: "Version"
			},
			{
				prop: window.opera,
				identity: "Opera",
				versionSearch: "Version"
			},
			{
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			},
			{
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			},
			{
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			},
			{
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			},
			{		// for newer Netscapes (6+)
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			},
			{
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "Explorer",
				versionSearch: "MSIE"
			},
			{
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			},
			{ 		// for older Netscapes (4-)
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
		],
		dataOS : [
			{
				string: navigator.platform,
				subString: "Win",
				identity: "Windows"
			},
			{
				string: navigator.platform,
				subString: "Mac",
				identity: "Mac"
			},
			{
				   string: navigator.userAgent,
				   subString: "iPhone",
				   identity: "iPhone/iPod"
		    },
			{
				string: navigator.platform,
				subString: "Linux",
				identity: "Linux"
			}
		]

};	
BrowserDetect.init();

/*
 * Gary's function start
 */
function HashMap()
{
     /** Map 大小 **/
     var size = 0;
     /** 对象 **/
     var entry = new Object();
     
     /** 存 **/
     this.put = function (key , value)
     {
         if(!this.containsKey(key))
         {
             size ++ ;
         }
         entry[key] = value;
     };
     
     /** 取 **/
     this.get = function (key)
     {
         return this.containsKey(key) ? entry[key] : null;
     };
     
    /** 删除 **/
     this.remove = function ( key )
     {
         if( this.containsKey(key) && ( delete entry[key] ) )
         {
             size --;
         }
     };
     
     /** 是否包含 Key **/
     this.containsKey = function ( key )
     {
         return (key in entry);
     };
     
     /** 是否包含 Value **/
     this.containsValue = function ( value )
     {
         for(var prop in entry)
         {
            if(entry[prop] == value)
             {
                 return true;
             }
         }
         return false;
     };
     
     /** 所有 Value **/
     this.values = function ()
     {
         var values = new Array();
         for(var prop in entry)
         {
             values.push(entry[prop]);
         }
         return values;
     };
     
     /** 所有 Key **/
     this.keys = function ()
     {
         var keys = new Array();
         for(var prop in entry)
         {
             keys.push(prop);
         }
         return keys;
     };
     
     /** Map Size **/
     this.size = function ()
     {
         return size;
     };
    
     /* 清空 */
     this.clear = function ()
     {
         size = 0;
         entry = new Object();
     };
}

/**
 * Tip related function
 * @author Nino
 * **********Start**********
 */
var Stacks = {
		  stack_top_middle_right: {
	        "dir1": "down",
	        "dir2": "left",
	        "push": "top",
	        "spacing1": 10,
	        "spacing2": 10,
	        "firstpos1": 45,
	        "firstpos2": ($(window).width() / 2) - (Number(PNotify.prototype.options.width.replace(/\D/g, '')) / 2)
	      },
	      stack_top_right: {
	        "dir1": "down",
	        "dir2": "left",
	        "push": "top",
	        "spacing1": 10,
	        "spacing2": 10
	      },
	      stack_top_left: {
	        "dir1": "down",
	        "dir2": "right",
	        "push": "top",
	        "spacing1": 10,
	        "spacing2": 10
	      },
	      stack_bottom_left: {
	        "dir1": "right",
	        "dir2": "up",
	        "push": "top",
	        "spacing1": 10,
	        "spacing2": 10
	      },
	      stack_bottom_right: {
	        "dir1": "left",
	        "dir2": "up",
	        "push": "top",
	        "spacing1": 10,
	        "spacing2": 10
	      },
	      stack_bar_top: {
	        "dir1": "down",
	        "dir2": "right",
	        "push": "top",
	        "spacing1": 0,
	        "spacing2": 0
	      },
	      stack_bar_bottom: {
	        "dir1": "up",
	        "dir2": "right",
	        "spacing1": 0,
	        "spacing2": 0
	      },
	      stack_context: {
	        "dir1": "down",
	        "dir2": "left",
	        "context": $("#stack-context")
	      },
	}
	function showMsg(title, msg, type) {
		if(type == "Success"){
			type = "success";
		}else if(type == "Info"){
			type = "info";
		}else{
			type = "danger";
		}
		$(".ui-pnotify").empty();
		$(window).resize(function(){
			Stacks["stack_top_middle_right"].firstpos2 = ($(window).width() / 2) - (Number(PNotify.prototype.options.width.replace(/\D/g, '')) / 2);
		});
		// Create new Notification
	    new PNotify({
	        title: title,
	        text: msg,
	        shadow: false,
	        opacity: 1,
	        addclass: "stack_top_middle_right",
	        type: type,
	        stack: Stacks["stack_top_middle_right"],
	        width: "290px",
	        delay: 8000
	    });
	}
/**
 * Tip related function
 * @author Nino
 * **********End**********
 */
 
/**
 * REST related function
 * @author Luphia
 * **********Start**********
 */
/**
 * Output Blob to File
 * @author Luphia
 * @version 1.0 2012/06/28
 * @param blob Blob Object
 * @param filename The filename to save
 * @return no return
 */
function saveAs(blob, filename) {
	var type = blob.type;
	var force_saveable_type = 'application/octet-stream';
	if (type && type != force_saveable_type) {
		var slice = blob.slice || blob.webkitSlice || blob.mozSlice;
		blob = slice.call(blob, 0, blob.size, force_saveable_type);
	}
 
	var url = URL.createObjectURL(blob);
	var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
	save_link.href = url;
	save_link.download = filename;
 
	var event = document.createEvent('MouseEvents');
	event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	save_link.dispatchEvent(event);
	URL.revokeObjectURL(url);
}

/**
 * Convert String to Blob
 * @author Luphia
 * @version 1.0 2012/06/28
 * @param data String
 * @return Blob Object
 */
function binaryToBlob(data) {
	var bb = new BlobBuilder();
	var arr = new Uint8Array(data.length);
	for(var i = 0, l = data.length; i < l; i++) {
		arr[i] = data.charCodeAt(i);
	}
	bb.append(arr.buffer);
	return bb.getBlob();
}

/**
 * Output Response to File
 * @author Luphia
 * @version 1.0 2012/06/28
 * @return no return
 */
function fileOutput(xmlhttp, filename) {
	var blob = binaryToBlob(xmlhttp.response);

	saveAs(blob, filename);
}

/**
 * rest object
 * @author Luphia
 * @version 1.0 2012/02/09
 * @return no return
 */
function rest() 
{
	if(tmpHTTP) {
		this.xmlhttp = tmpHTTP;
	} else {

		var XMLHttpFactories = 
		[
			function () { return new XMLHttpRequest() },
			function () { return new ActiveXObject("Msxml2.XMLHTTP") },
			function () { return new ActiveXObject("Msxml3.XMLHTTP") },
			function () { return new ActiveXObject("Microsoft.XMLHTTP") }
		];
	 
		var xmlhttp = false;
		for (var i = 0; i < XMLHttpFactories.length; i++) 
		{
			try 
			{
				xmlhttp = XMLHttpFactories[i]();
			} 
			catch (e) 
			{
				continue;
			}
			break;
		}

		// XMLHttpRequest target
		tmpHTTP = xmlhttp;
		this.xmlhttp = xmlhttp;
	}
}

/** normal get method */
rest.prototype._get = function(url, data) 
{
	var xmlhttp = this.xmlhttp;
	var obj;
	
	try 
	{
		//-- Do not use jQuery, but now I notice the fact there was no time ...
		if(typeof(data) == 'undefined' || data.length == 0) {
			data = "";
		} else {
			data = decodeURIComponent($.param(data));
		}

		xmlhttp.open('GET', url + "&" + data, false);
		xmlhttp.send(null);

		var myHeader = xmlhttp.getAllResponseHeaders();

		var contentStart = myHeader.indexOf('Content-Disposition: ') + 21;
		var contentEnd = myHeader.indexOf(';', contentStart);
		var content = myHeader.substring(contentStart, contentEnd);

		var nameStart = myHeader.indexOf('filename="') + 10;
		var nameEnd = myHeader.indexOf('"', nameStart);
		var filename = myHeader.substring(nameStart, nameEnd);

		if(content == "attachment") {
			fileOutput(xmlhttp, filename);
			obj = {
				"RESULT": 1,
				"MESSAGE": "download " + filename,
				"DATA": {}
			};
		} else {
			obj = JSON.parse(xmlhttp.responseText);
		}
	}
	catch(e) 
	{
		obj = {
			"RESULT": 0,
			"MESSAGE": e,
			"DATA": {}
		};
	}
	
	if(obj["RESULT"] == -1) {
		isLogout();
	}

	return obj;
};

/** normal post method */
rest.prototype._post = function(url, data) 
{
	var xmlhttp = this.xmlhttp;
	var obj;
	
	try 
	{
		xmlhttp.open('POST', url, false);
		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		/* Browser does not like this header
		xmlhttp.setRequestHeader("Content-Length", data.length);
		*/
		
		data = arrayToJSON(data);
		xmlhttp.send(data);

		var myHeader = xmlhttp.getAllResponseHeaders();

		var contentStart = myHeader.indexOf('Content-Disposition: ') + 21;
		var contentEnd = myHeader.indexOf(';', contentStart);
		var content = myHeader.substring(contentStart, contentEnd);

		var nameStart = myHeader.indexOf('filename="') + 10;
		var nameEnd = myHeader.indexOf('"', nameStart);
		var filename = myHeader.substring(nameStart, nameEnd);

		if(content == "attachment") {
			fileOutput(xmlhttp, filename);
			obj = {
				"RESULT": 1,
				"MESSAGE": "download " + filename,
				"DATA": {}
			};
		} else {
			obj = JSON.parse(xmlhttp.responseText);
		}
	}
	catch(e) 
	{
		obj = {
			"RESULT": 0,
			"MESSAGE": e,
			"DATA": {}
		};
	}

	if(obj["RESULT"] == -1) {
		isLogout();
	}

	return obj;
};

/** no auth */
rest.prototype._pass = function(url, data) 
{
	var xmlhttp = this.xmlhttp;
	var obj;
	
	try 
	{
		//-- Do not use jQuery, but now I notice the fact there was no time ...
		if(typeof(data) == 'undefined' || data.length == 0) {
			data = "";
		} else {
			data = decodeURIComponent($.param(data));
		}

		xmlhttp.open('GET', url + "&" + data, false);
		xmlhttp.send(null);

		var myHeader = xmlhttp.getAllResponseHeaders();

		var contentStart = myHeader.indexOf('Content-Disposition: ') + 21;
		var contentEnd = myHeader.indexOf(';', contentStart);
		var content = myHeader.substring(contentStart, contentEnd);

		var nameStart = myHeader.indexOf('filename="') + 10;
		var nameEnd = myHeader.indexOf('"', nameStart);
		var filename = myHeader.substring(nameStart, nameEnd);

		if(content == "attachment") {
			fileOutput(xmlhttp, filename);
			obj = {
				"RESULT": 1,
				"MESSAGE": "download " + filename,
				"DATA": {}
			};
		} else {
			obj = JSON.parse(xmlhttp.responseText);
		}
	}
	catch(e) 
	{
		obj = {
			"RESULT": 0,
			"MESSAGE": e,
			"DATA": {}
		};
	}

	return obj;
};

rest.prototype._async = function(url, data, callback, method) {
	if(typeof(method) == 'undefined') {
		method = "POST";
	}

	if(typeof(data) == 'undefined' || data.length == 0) {
		data = "";
	} else {
		if(method == "POST"){
			data = arrayToJSON(data);
		}else if(method == "GET"){
			data = decodeURIComponent($.param(data));
		}else{
			data = JSON.stringify(data);
			method = "POST";
		}
	}

	$.ajax({
		type: method,
		url: url,
		contentType: 'application/json',
		data: data,
		dataType: "json",
		success: function(_data) {
			callback(_data);
		}
	});
}

/** fake data for debug mode */
rest.prototype._fake = function(url, data) 
{
	var xmlhttp = this.xmlhttp;
	var obj;
	
	try 
	{
		xmlhttp.open('GET', url, false);
		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		/* Browser does not like this header
		xmlhttp.setRequestHeader("Content-Length", data.length);
		*/
		xmlhttp.send(data);

		obj = JSON.parse(xmlhttp.responseText);
		obj["ARGS"] = data;
	}
	catch(e)
	{
		obj = {
			"RESULT": 0,
			"MESSAGE": e,
			"DATA": {}
		};
	}

	return obj;
};

/** list method for rest, use _get */
rest.prototype.list = function(url, data) 
{
	url = url += "?op=list";
	return this._get(url, data);
	// return this._fake(url, data);
}

/** get method for rest, use _get */
rest.prototype.get = function(url, data) 
{
	url = url += "?op=GET";
	return this._get(url, data);
	// return this._fake(url, data);
}

/** post method for rest, use _post */
rest.prototype.post = function(url,  data) 
{
	url = url += "?op=POST";
	return this._post(url, data);
	// return this._fake(url, data);
}

/** put method for rest, use _post */
rest.prototype.put = function(url, data) 
{
	url = url += "?op=PUT";
	return this._post(url, data);
	// return this._fake(url, data);
};

/** del method for rest, use _get */
rest.prototype.del = function(url, data) 
{
	url = url += "?op=DELETE";
	return this._get(url, data);
	// return this._fake(url, data);
};

/** file method for rest, use _pass */
rest.prototype.file = function(url, data) 
{
	url = url += "?op=FILE";
	return this._pass(url, data);
	// return this._fake(url, data);
}
/**
 * REST related function
 * @author Luphia
 * **********End**********
 */
 
 /*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.Dateformat = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

/**
 * 將換行符號取代成<br />
 * @author kevinchang01
 */
function newLineToBr(oriStr){
	return oriStr.replace(/\n/g,"<br>");
}
/**
 * confirmBox
 * @author mengtsang
 */
function confirmBox(_title, _message, _class, _callback) {
	var modal = $("#confirmModal");
	$("#confirmModalLabel", modal).text( i18n._(_title) );
	$("#confirmTip", modal).text( i18n._(_message) );
	switch(_class) {
		case 'btn-default':
		case 'btn-primary':
		case 'btn-success':
		case 'btn-info':
		case 'btn-warning':
		case 'btn-danger':
		case 'btn-alert':
		case 'btn-system':
		case 'btn-dark':
			$("button#confirmButton", modal).removeClass().addClass('btn').addClass(_class);
			$(".modal-header", modal).removeClass().addClass('modal-header').addClass(_class);
			break;
		default:
			$("button#confirmButton", modal).removeClass().addClass('btn').addClass('btn-role');
			$(".modal-header", modal).removeClass().addClass('modal-header').addClass('btn-role');
	}
	$(".modal-dialog", modal).css("margin","90px auto");
	$("#confirmModal").modal();
	$("#confirmButton", modal).unbind();
	$("#confirmButton", modal).bind("click", function() {
		$("#confirmModal").modal('hide');
		_callback();
	});
}
/**
 * deleteBox
 * @author nino
 */
function deleteBox(_title, _rsname, _rsid_list, _callback) {
	var modal = $("#deleteModal");
	$("#deleteModalLabel", modal).text( i18n._(_title) );
	$(".modal-body div:eq(0)", modal).text( i18n._("Delete") + " " + i18n._(_rsname));
	$("button#confirmButton", modal).removeClass().addClass('btn').addClass('btn-danger');
	$(".modal-header", modal).removeClass().addClass('modal-header').addClass('btn-danger');

	modal.modal();
	$(".modal-footer button:eq(1)", modal).unbind();
	$(".modal-footer button:eq(1)", modal).bind("click", function() {
		modal.modal('hide');
		callTerminateResource(_rsid_list, _callback);
	});
}
/**
 * 回傳現在時間 ex:2016/01/26 10:49:38
 * @author Luphia
 */
function getNowDate(){
	var d = new Date();
	return  d.getFullYear() + "/" +padLeft((d.getMonth()+1),2) + "/" + padLeft(d.getDate(),2) + " " + 
	padLeft(d.getHours(),2) + ":" + padLeft(d.getMinutes(),2) +":"+ padLeft(d.getSeconds(), 2);	
}
//日期補零函式
function padLeft(str,lenght){
	str = str.toString();
	if(str.length >= lenght)
		return str;
	else
		return padLeft("0" +str,lenght);
}
function ResourceNumToName(num){
	var ResourceName = "";
	switch (parseInt(num))
	{
		case 1:
		  ResourceName="VirtualMachine";
		  break;
		case 2:
		  ResourceName="BlockStorage";
		  break;
		case 3:
		  ResourceName="ObjectStorage";
		  break;
		case 4:
		  ResourceName="VLAN";
		  break;
		case 5:
		  ResourceName="PhysicalIP";
		  break;
		case 6:
		  ResourceName="VPNServer";
		  break;
		case 7:
		  ResourceName="LoadBalance";
		  break;
		case 8:
		  ResourceName="Machine";
		  break;  
		case 9:
		  ResourceName="Cluster";
		  break;
		case 10:
		  ResourceName="Zone";
		  break;
		case 11:
		  ResourceName="DataCenter";
		  break;
		case 12:
		  ResourceName="Swift";
		  break;
		case 13:
		  ResourceName="NovaVolumn";
		  break;
		case 14:
		  ResourceName="Image";
		  break;
		case 15:
		  ResourceName="FlavorTemplate";
		  break;
		case 16:
		  ResourceName="SnapShot";
		  break;
		case 17:
		  ResourceName="SecurityGroup";
		  break;
		case 18:
		  ResourceName="Keypair";
		  break;
		case 19:
		  ResourceName="SuperFlavor";
		  break;
		case 20:
		  ResourceName="WarningRemind";
		  break;
	    case 21:
		  ResourceName="UserAccount";
		  break;
		case 22:
		  ResourceName="BackupServer";
		  break; 
		case 23:
		  ResourceName="Switch";
		  break;
		case 24:
		  ResourceName="DiscISO";
		  break;
		case 25:
		  ResourceName="QuotaFlavor";
		  break;
		case 26:
		  ResourceName="VMWare";
		  break;
		case 28:
		  ResourceName="iServDB";
		  break;
		case 29:
		  ResourceName="VMTraffic";
		  break;
		case 30:
		  ResourceName="EmergencySetting";
		  break;
		case 31:
		  ResourceName="DefaultSecurityGroup";
		  break;
		case 50:
		  ResourceName="xCATHost";
		  break;
		case 60:
		  ResourceName="VMAutoScaling";
		  break;
		case 61:
		  ResourceName="ScaleOutVM";
		  break;
		case 70:
		  ResourceName="PackageInstance";
		  break;
		default:
		  ResourceName="Not Found"; 
		  break;
	}
	return ResourceName;
}
function StatusNumToName(num){
	var StatusName = "";
	switch (parseInt(num))
	{
		case 0:
			StatusName="Building";
		  break;
		case 1:
			StatusName="Active";
		  break;
		case 2:
			StatusName="Maintaining";
		  break;
		case 3:
			StatusName="Migrating";
		  break;
		case 7:
			StatusName="Terminating";
		  break;
		case 8:
			StatusName="Expired";
		  break;
		case 9:
			StatusName="Removed";
		  break;
		case 10:
			StatusName="Pause";
		  break;
		case 11:
			StatusName="Pausing";
		  break;
		case 12:
			StatusName="Stopped";
		  break;
		case 13:
			StatusName="Stopping";
		  break;
		case 14:
			StatusName="Starting";
		  break;
		case 15:
			StatusName="Snapshot";
		  break;
		case 16:
			StatusName="Rebuilding";
		  break;
		case 17:
			StatusName="Reboot";
		  break;
		case 18:
			StatusName="Changing";
		  break;
		case 19:
			StatusName="Image";
		  break;
		case 21:
			StatusName="Detaching";
		  break;
		case 22:
			StatusName="Attaching";
		  break;
		case 23:
			StatusName="Failed";
		  break;
		case 81:
			StatusName="UserTerminated";
		  break;
		case 82:
			StatusName="AdminTerminated";
		  break;
		case 83:
			StatusName="ExpiredUnrecovered";
		  break;
		case 85:
			StatusName="DirectTerminated";
		  break;
		default:
			StatusName="Not Found"; 
		  break;
	}
	return StatusName;
}
function StepNumToName(num){
	var StepName = "";
	switch (parseInt(num))
	{
		case 0:
			StepName="Review";
		  break;
		case 1:
			StepName="Pass";
		  break;
		case 2:
			StepName="Reject";
		  break;
		case 3:
			StepName="Building";
		  break;
		case 4:
			StepName="Complete";
		  break;
		case 5:
			StepName="Cancel";
		  break;
		case 6:
			StepName="Failed";
		  break;
		default:
			StepName="Not Found"; 
		  break;
	}
	return StepName;
}