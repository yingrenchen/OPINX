/*! iii.frontend.framework v0.01  */

var useWidget = "",
	useSubWidget = "",
	WidgetListenEvent = new Array(),
	SubWidgetListenEvent = new Array(),
	SystemListenEvent = new Array(),
	useWidgetList = "";
/**
 * Load Javascript
 * @author Luphia
 * @version 1.0 2012/02/08
 * @param String
 * @param Object
 * @return no return
 */
function loadJS(jsname,wdata) {
	var fileUrl = "widgets/" + jsname + "/js.js";
	$.getScript(fileUrl, function(wfn) {
		try {
			eval(jsname)._init(wdata);
		} catch(e) {
			console.log(e);
		}
	}).fail(function(){
		if(arguments[0].readyState==0){
			console.log("script failed to load, widget:"+jsname);
		}else{
			console.log("script failed to parse:"+arguments[2].toString());
		}
	});
}

/**
 * Loading Outer Javascript
 * @author no
 * @param javascript path
 * @param javascript name 
 * @return no return
 */
function loadOuterJS(jspath, jsname){
	var oScript = document.createElement("script");
	var fileUrl = "widgets/" + jspath +  jsname;
	
	oScript.id = jsname + ".js"; 
	oScript.type = "text/javascript"; 
	oScript.src = fileUrl; 

	var scriptTag = document.getElementById(oScript.id);
	var oHead = document.getElementsByTagName('HEAD').item(0);
	
	if (scriptTag) 
	{
		oHead.removeChild(scriptTag);	
	}
	
	oHead.appendChild(oScript);	
}

/**
 * Loading CSS
 * @author Luphia
 * @version 1.0 2012/02/08
 * @param cssname The widget name
 * @return no return
 */
function loadCSS(cssname) {
	var oScript= document.createElement("link");
	var fileUrl = "widgets/" + cssname + "/css.css";
	oScript.id = cssname + ".css";
	oScript.rel = "stylesheet";
	oScript.type = "text/css";
	oScript.href = fileUrl;

	var scriptTag = document.getElementById(oScript.id);
	var oHead = document.getElementsByTagName('HEAD').item(0);
	if (scriptTag) 
	{
	}
	else {
		oHead.appendChild(oScript);
	}
}

/**
 * Loading Widget (Use jQuery)
 * @author Luphia
 * @version 1.1 2012/02/23
 * @param widget The widget you create
 * @return no return
 */
function loadWidget(widget,wdata) {
	
	if(typeof widget == 'undefined') {
		return;
	}
	
	try {
		destroyAllWidget();
	} catch(e) {}
	
	useWidgetList = [{"widget":widget,"layer":0,"timer":[]}];
	
	var widgetTag = document.getElementById("widgetArea");
	var widgetPath = "widgets/" + widget + "/";
	
	var wHtml = widgetPath + "main.htm";
	var wCss = widgetPath + "css.css";
	var wJs = widgetPath + "js.js";

	loadCSS(widget);

	var data = '';
	$.get(wHtml, data, function(html) {
		useWidget = widget;
		
		$("#widgetArea").html("").show();

		var reg=/\{\$[^\{\}]+\}/g;
		
		/* use i18n change html word language*/
		html = html.replace(reg, function(word) {
			var myKey = word.substr(2, (word.length - 3));
			return i18n._(myKey);
		});

		$(html).each(function() {
			$("#widgetArea").append($(this));
		});
		
		/* img tag src process */
		$("#widgetArea").find("img").each(function() {
			var src = widgetPath + $(this).attr("src");
			$(this).attr("src", src);
		});
		
		loadJS(widget,wdata);

	}).then(
		function() { 
			try {
				//breadcrumb
				$("#topbar .breadcrumb .crumb-trail").remove();
				$("#topbar .breadcrumb").append("<li class='crumb-trail back-Master "+widget+"' widget='"+widget+"'>"+i18n._(widget)+"</li>");
				setbreadcrumb_click();
				//menu remove active
				//$("#workArea #sidebar_left .sidebar-menu li").removeClass("active");
			} catch(e) {} 
		},
		function() { showMsg("Load Fail"); }
	);
}

/**
 * Loading Widget (Use jQuery)
 * @author Nino
 * @param widget The widget you create
 * @return no return
 */
//var widget_list = [{"widget":"UserInstance","layer":0,"timer":[244,577]},{"widget":"SubUserInstance","layer":1,"timer":[244,577]}];
//useWidgetList = [{"widget":"UserInstance","layer":0,"timer":[244,577]},{"widget":"SubUserInstance","layer":1,"timer":[244,577]}];
function loadSubWidget(widget,breadcrumb_name,wdata){
	
	//check widget name format
	if(typeof widget == 'undefined' || widget == '') {
		return;
	}
	//check widget repeat
	for (i = 0; i < useWidgetList.length; i++) { 
		if(useWidgetList[i].widget == widget){
			return;
		}
	}
	
	$(".subwidgetArea").hide();
	var widgetTag = $('<div class="subwidgetArea '+widget+' col-lg-12 col-md-12 col-sm-12"></div>').appendTo($(".showWidgetArea"));
	var widgetPath = "widgets/" + widget + "/";

	var wHtml = widgetPath + "main.htm";
	var wCss = widgetPath + "css.css";
	var wJs = widgetPath + "js.js";

	loadCSS(widget);

	var data = '';
	$.get(wHtml, data, function(html) {
		useWidget = widget;

		/* use i18n change html word language*/
		var reg=/\{\$[^\{\}]+\}/g;
		html = html.replace(reg, function(word) {
			var myKey = word.substr(2, (word.length - 3));
			return i18n._(myKey);
		});
		
		$(html).each(function() {
			widgetTag.append($(this));
		});
		
		widgetTag.find("img").each(function() {
			var src = widgetPath + $(this).attr("src");
			$(this).attr("src", src);
		});

		loadJS(widget,wdata);
		
	}).then(
		function() { 
			try {
				$("#widgetArea").hide();
				useWidgetList.push({"widget":widget,"layer":useWidgetList.length,"timer":[]});
				$("#topbar .breadcrumb").append("<li class='crumb-trail back-Master "+widget+"' widget='"+widget+"'>"+i18n._(widget)+"</li>");
				setbreadcrumb_click();
			} catch(e) {} 
		},
		function() { showMsg("Load Fail"); }
	);
}

/**
 * Desoroy All Sub Widget (Use jQuery)
 * @author Nino
 * @param destroy All sub widget
 * @return no return
 */
function destroyAllWidget(){
	$("#widgetArea").children().remove(); //remove html
	$(".subwidgetArea").remove(); //remove html
	for (i = 0; i < useWidgetList.length; i++) { 
		removeWidgetListen(useWidgetList[i].timer); //remove timer
		$("link[href*='"+useWidgetList[i].widget+"/css.css']").remove(); //remove css
		eval(useWidgetList[i].widget)._destroy(); //remove js
	}
	//reseat breadcrumb
	$("#topbar .breadcrumb").html('<li class="crumb-active" style="font-size: 19px;color: #555;"><span class="glyphicon glyphicon-home"></span></li>');
} 

/**
 * Regist Widget Listen Event (Use jQuery)
 * @author Nino
 * @version 1.1 2016/04/18
 * @return IntervalEvent
 */
function registWidgetListen(toDo, time){
	if((typeof time) == 'undefined') {
		time = 10000;
	}
	toDo();
	thisEvent = setInterval(toDo, time);
	useWidgetList[useWidgetList.length-1].timer.push(thisEvent);
}

/**
 * Regist System Listen Event (Use jQuery)
 * @author Nino
 * @version 1.1 2016/04/18
 * @return IntervalEvent
 */
function registSystemListen(toDo, time){
	if((typeof time) == 'undefined') {
		time = 10000;
	}
	toDo();
	thisEvent = setInterval(toDo, time);
	SystemListenEvent.push(thisEvent);
}


/**
 * Erase Widget Listen Event (Use jQuery)
 * @author Nino
 * @version 1.1 2016/04/18
 * @return IntervalEvent
 */
function removeWidgetListen(timerEvent){
	for (j = 0; j < timerEvent.length; j++) { 
		removeListen(timerEvent[j]);
	}
}


/**
 * Erase System Listen Event (Use jQuery)
 * @author Nino
 * @version 1.1 2016/04/18
 * @return IntervalEvent
 */
function removeSystemListen(){
	for (i = 0; i < SystemListenEvent.length; i++) { 
		removeListen(SystemListenEvent[i]);
	}
	SystemListenEvent = new Array();
}

/**
 * Remove Listen (Use jQuery)
 * @author Luphia
 * @version 1.1 2012/06/05
 */
function removeListen(event){
	clearInterval(event);
}

/**
 * 重整網頁並指定要載入的widget
 * @author nino
 * @param widgetname
 * @return 無
 */
function reloadPage(widget){
	document.cookie = "initwidget="+widget;
	window.location.reload(); //重整網頁
}
/**
 * 設定cookies
 * @author nino
 * @param cookie name
 * @return 無
 */
function setCookie(name, data)
{
	document.cookie = name+"="+data;
}
/**
 * 取cookies
 * @author nino
 * @param cookie name
 * @return 無
 */
function getCookie(name)
{
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
     if(arr != null) return unescape(arr[2]); return null;

}
/**
 * 删除cookie
 * @author nino
 * @param cookie name
 * @return 無
 */
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
/**
 * Load Menu Incloud Widget(Use jQuery)
 * @author Nino
 * @version 1.1 2015/11/24
 * @return no return
 */
function loadWidgetMenu(config) 
{
	var InitWidget = config["InitWidget"];
	var InitWidget_name = "";
	$("#workArea #sidebar_left .sidebar-menu").html("");
	$("#workArea #sidebar_left .sidebar-menu").append('<li class="sidebar-label pt15">MENU</li>');
	for(var key in config["menu"]) {
		var key_menu = config["menu"][key];
		if(key_menu.hasOwnProperty('submenu')){
			var submenu_show = "";
			if(key_menu.hasOwnProperty('initOpen') && key_menu.initOpen){
				submenu_show = "menu-open";
			}
			var menu_str = '';
			menu_str += '<li>';
			menu_str += '	<a class="accordion-toggle '+submenu_show+'">';
			menu_str += '		<span class="'+key_menu.icon+'"></span>';
			menu_str += '		<span class="sidebar-title">'+i18n._(key_menu.name)+'</span>';
			menu_str += '		<span class="caret"></span>';
			menu_str += '	</a>';
			menu_str += '	<ul class="nav sub-nav">';
			for (var i = 0; i < key_menu.submenu.length; i++) {
				menu_str += '	<li>';
				menu_str += '		<a widget="'+key_menu.submenu[i].widget+'">'+i18n._(key_menu.submenu[i].name)+'</a>';
				menu_str += '	</li>';
				if(key_menu.submenu[i].widget == InitWidget){
					InitWidget_name = key_menu.submenu[i].name;
				}
			}
			menu_str += '	</ul>';
			menu_str += '</li>';
			$("#workArea #sidebar_left .sidebar-menu").append(menu_str);
		}else{
			var menu_str = '';
			menu_str += '<li>';
			menu_str += '	<a widget="'+key_menu.widget+'">';
			menu_str += '		<span class="'+key_menu.icon+'"></span>';
			menu_str += '		<span class="sidebar-title">'+i18n._(key_menu.name)+'</span>';
			menu_str += '	</a>';
			menu_str += '</li>';
			$("#workArea #sidebar_left .sidebar-menu").append(menu_str);
			
			if(key_menu.widget == InitWidget){
				InitWidget_name = key_menu.name;
			}
		}
	}
	$("#workArea #sidebar_left .sidebar-menu a[widget]").unbind("click");
	$("#workArea #sidebar_left .sidebar-menu a[widget]").click(function() {
		loadWidget($(this).attr("widget"));
		//選擇的widget加上選取中
		$("#workArea #sidebar_left .sidebar-menu li").removeClass("active");
		$(this).parent().addClass("active");
	});
	
	//如果cookie中有指定的話，就load指定的widget
	if(!getCookie("initwidget") ){
		var InitWidget = config["InitWidget"];
		loadWidget(InitWidget);
	}else{
		var InitWidget = getCookie("initwidget"); //取得cookie中預設要載入的widget name
		if(InitWidget == "" || typeof(InitWidget) == 'undefined'){
			var InitWidget = config["InitWidget"];
		}else{
			delCookie("initwidget"); //清空cookie
		}
		loadWidget(InitWidget);
	}
}
function setbreadcrumb_click(){
	$(".breadcrumb .back-Master").unbind("click");
	$(".breadcrumb .back-Master").click(function() {
		var new_useWidgetList = [];
		var clicklayer = -1;
		for (i = 0; i < useWidgetList.length; i++) {
			if(useWidgetList[i].widget == $(this).attr("widget")){
				clicklayer = useWidgetList[i].layer; //點擊的layer
			}
		}
		$("#widgetArea").hide();
		$(".subwidgetArea").hide();
		if(clicklayer == 0){
			$("#widgetArea").show();
			$(window).resize()
		}else{
			$(".subwidgetArea."+$(this).attr("widget")+"").show();
			$(window).resize()
		}
		if(clicklayer >= 0){
			for (i =0; i < useWidgetList.length; i++) {
				if(i<=clicklayer){
					new_useWidgetList.push(useWidgetList[i]);
				}else{
					removeWidgetListen(useWidgetList[i].timer); //remove timer
					$(".subwidgetArea."+useWidgetList[i].widget+"").remove(); //remove html
					$("link[href*='"+useWidgetList[i].widget+"/css.css']").remove(); //remove css
					eval(useWidgetList[i].widget)._destroy(); //remove js
					$(".crumb-trail.back-Master."+useWidgetList[i].widget+"").remove(); //remove breadcrumb
					
				}
			}
			useWidgetList = new_useWidgetList;
		}
	});
}