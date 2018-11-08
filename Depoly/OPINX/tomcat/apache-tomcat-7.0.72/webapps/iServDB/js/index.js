var loginPath = "./DB_APIUserLogin",
	logoutPath = "./DB_APIUserLogout",
	UserConfigPath = "./DB_UserConfig",
	tmpHTTP = null,
	ConfigData = new HashMap(),
	loginRole = "",
	role = "",
	htmlProjectIcon = '<b style="margin-left: 5px;font-size: 20px;"><i class="fa fa-database" aria-hidden="true"></i> iServDB</b>',
    frontend_revision =  "$Rev: 17208 $".replace(/\$/g, ""),
    backend_revision = "";

function GetBackEndVer() {	
	var strURL = "OPINX/OPINXGetData";
	var restobj = new rest();
	var data = {
		"_restAPI": "getV?"
	};		
	restobj._async(strURL, data, function(response_result){
		if (response_result.RESULT == 1) { //正確回傳回來
			if(response_result.DATA.status){
				backend_revision = response_result.DATA.version.replace(/\$/g, "");
				$("#release_version").html("FrontEnd "+frontend_revision+"　BackEnd "+backend_revision);
			}
			else{
				apiTokenExpired(response_result.DATA.err_msg);
			}
		} else {
			showMsg(response_result.MESSAGE);
			sessionExpired(response_result.MESSAGE);
		}
	}, "POST");
}

function apiTokenExpired(mes){
	if(mes.match("the API token is invalid") != null){
		showMsg("API token expired", "Please try to login again");
		logout();
	}
}

function sessionExpired(mes){
//	if(mes.match("未登入") != null){
//		$(".ui-pnotify").empty();
//		logout();
//	}
}

/**
 * Login
 * @author Luphia
 * @version 1.0 2012/05/15
 * @param account User Account
 * @param password User Password
 * @return Boolean
 */

function login(formData, rt) 
{
	var myConfig = getJson('config/license.json');
	var account = formData.account,
		password = formData.password,
		loginRole = myConfig["DATA"]["loginRole"],
		title = myConfig["DATA"]["title"],
		titleIcon = myConfig["DATA"]["titleIcon"];
	
	var restLogin = new rest();
	
	Highcharts.setOptions({
        global: {
            timezoneOffset: new Date().getTimezoneOffset()
        }
    });

	$(".login-title").html('<i class="'+titleIcon+'" aria-hidden="true"></i> '+title+'</div>');
	
	if(!rt) {
		var data = new Array();
		data["account"] = account;
		data["password"] = md5(account+password);
		data["loginRole"] = loginRole;
		userAccount = account;
		
//		var rs = restLogin.post(loginPath, data);//檢查帳號真偽
		var rs = [];
		rs["RESULT"] = 1;
		rs["DATA"] = {};
		rs.DATA["role"] = "admin";
		
		var rt = rs["RESULT"] == 1;
		role = rs.DATA.role;
		setCookie("role", role);
		
		if(!rt){
			if(rs["RESULT"] == -2){
				$("#login_section .admin-form").effect("shake");
			}else{
				$("#login-modal modal-tital").html("<h3>此帳號不存在或停用中</h3>");
				$("#login-modal modal-content").html("請至註冊頁面註冊帳號或聯絡您的管理員來啟用帳號");
				$("#login-modal").modal();
			}
		}
		else{
			setCookie("account", account);
			setCookie("loginRole", loginRole);
		}
	}
	if(rt) {
		var restUserConfig = new rest();
//		var rsUserConfig = restUserConfig.file(UserConfigPath);
		var rsUserConfig = {};
		rsUserConfig["RESULT"] = 1;
		if(rsUserConfig["RESULT"] == -1) {
			$("#workArea").hide();
			$("#login_section").show();
		} else {
			role = getCookie("role");
			if(role == "admin" && loginRole == "OPINX"){
				var accountObj = {
					"icon": "glyphicon glyphicon-user",
					"name": "Account Management",
					"widget": "AccountManagement"
				}
				var wordObj = {
					"icon": "glyphicon glyphicon-book",
					"name": "Word Management",
					"widget": "WordManagement"	
				}
				myConfig["DATA"].menu.push(accountObj);
				myConfig["DATA"].menu.push(wordObj);
			}
			
			$(".dashboard-page").removeClass("external-page");
			loadRoleCSS(myConfig["DATA"]["role"]);
			ConfigData.put("user", myConfig["DATA"]);
			
			var widgetPath = "widgets/Basic/";
			var wHtml = widgetPath + "main.htm";
	
			var data = '';
			$.get(wHtml, data, function(html) {
				var reg=/\{\$[^\{\}]+\}/g;
				html = html.replace(reg, function(word) {
					var myKey = word.substr(2, (word.length - 3));
					return i18n._(myKey);
				});
				$(html).appendTo('body');
				loadJS("Basic");
				loadCSS("Basic");
				$("#workArea").show();
				$("#login_section").hide();
				loadWidgetMenu(myConfig["DATA"]);
				$(".navbar-nav").find(".nav-username").html(getCookie("account"));
			});
			
			htmlProjectIcon = '<b style="margin-left: 5px;font-size: 20px;"><i class="'+titleIcon+'" aria-hidden="true"></i> '+title+'</b>';
			if(loginRole == "OPINX"){
				GetBackEndVer();
			}
		}
	}
	
	return rt;
}

function loadRoleCSS(role_name){
	if(role_name == "Business" || role_name == "SubBusiness"){
		$("#role_business").removeAttr("disabled");
		$("#role_admin").attr("disabled", "disabled");
		$("#role_client").attr("disabled", "disabled");
		
	}else if(role_name == "Admin" || role_name == "SubAdmin"){
		$("#role_admin").removeAttr("disabled");
		$("#role_client").attr("disabled", "disabled");
		$("#role_business").attr("disabled", "disabled");
	}else{
		$("#role_client").removeAttr("disabled");
		$("#role_admin").attr("disabled", "disabled");
		
		$("#role_business").attr("disabled", "disabled");
	}
}

/**
 * Logout (-- Test Mode)
 * @author Luphia
 * @version 1.0 2012/02/27
 * @return Boolean
 */
function logout() 
{
	$("#workArea").remove();
	$(".modal:not(#login-modal)").remove();
	var restLogout = new rest;
	var rs = restLogout.get(logoutPath);
	afterLogout();
	$("#login_section").show();
	loginBindEnter();
	delCookie("account");
	delCookie("loginRole");
	delCookie("role");
	return true;
}

/**
 * do something after Logout
 * @author Luphia
 * @version 1.0 2012/06/05
 * @return no return
 */
function afterLogout()
{
	$(".dashboard-page").addClass("external-page");
	removeSystemListen();
	destroyAllWidget();
}

/**
 * Load Login Features
 * @author nino
 * @version 1.0 2015/11/02
 * @return no return
 */
function loadLogin(){
	//show forget password page
	$(".login-bottom").find("span").eq(0).click(function() {
		$(".login_div").hide();
		$(".login-bottom").hide();
		$(".forgetpassword_div").show();
		$(".register-bottom").show();
	});
	//show regist password page
	$(".login-bottom").find("span").eq(1).click(function() {
		$(".login_div").hide();
		$(".login-bottom").hide();
		$(".register_div").show();
		$(".register-bottom").show();
	});
	//show login page
	$(".register-bottom").find("span").eq(0).click(function() {
		$("#register_form")[0].reset();
		$("#register_form").validate().resetForm();
		$("#forgetpassword_form")[0].reset();
		$("#forgetpassword_form").validate().resetForm();
		$(".register_div").hide();
		$(".forgetpassword_div").hide();
		$(".register-bottom").hide();
		$(".login_div").show();
		$(".login-bottom").show();
	});
	//sign in action
	$("#loginButton").click(function() {
		$("#login_form .panel-footer .s-loading").show();
		
		var account = $("#login_form input[name=account]").val();
		var password = $("#login_form input[name=password]").val();
		var server = $("#login form #loginServer").val();			
		var subClient = false;
		var	tanentAccount = "tanentAccount";		
		var formData = 
		{
			"account":account,
			"password":password,
			"subClient":subClient,
			"tanentAccount":tanentAccount
		}	
		$("#login form [name=password]").attr("value", "");
		login(formData);
	});
	//regist action
	$("#register_form .registaccount").click(function() {
		if($("#register_form").valid()) {
			RegistUser();
		}	
	});
	//send password action
	$("#forgetpassword_form .sendpassowrd").click(function() {
		if($("#forgetpassword_form").valid()) {
			console.log("just console");
		}	
	});
}
function RegistUser() {
	var strURL = "./SignUp"; 
    var restobj = new rest();
    var data = {
    	"username":$("#register_form #username").val(),
		"useridentity":$("#register_form #useridentity").val(),
		"userphone":$("#register_form #userphone").val(),
		"usermobile":$("#register_form #usermobile").val(),
		"useremail":$("#register_form #useremail").val(),
		"useraccount":$("#register_form #useraccount").val(),
		"userpassword":$("#register_form #userpassword").val(),
		"userlanguage":$("#register_form #userlanguage").val()
    };
    
    var responseJSON = restobj.post(strURL,data);
    if (responseJSON.RESULT == 1) {
		$("#login-modal .title").html("<h3>註冊成功</h3>");
		$("#login-modal .content").html("管員者審核後會寄發電子郵件通知使用");
		$("#login-modal").modal();   	
    } else {
		$("#login-modal .title").html("<h3>註冊失敗</h3>");
		$("#login-modal .content").html(i18n._(responseJSON.MESSAGE));
		$("#login-modal").modal();
    }
}

/**
 * 監聽Enter輸入為login事件
 * @author kevinchang01
 * @param 無
 * @return 無
 */
function loginBindEnter(){
	if($("#login_section").css("display") != "none"){
		$(document).keypress(function(event) {
		    var keycode = (event.keyCode ? event.keyCode : event.which);
		    if (keycode == '13') {
		        $('#loginButton').click();
		    }
		});
	}
}


// Initial Function or test something
$(document).ready(function() {
	//首頁桌面特效
	CanvasBG.init({
      Loc: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 3.3
      },
    });
	loadLogin();
	// CheckLogin
	var data = {"account":"","password":""};
	login(data, true);
	loginBindEnter();
});