/*
	常用的jquery validate 驗證條件
	(不足的部份就要自已寫在下面)
	
	required：必填欄位
    email：格式要符合E-Mail格式
    url：格式要符合網址格式，如：http://www.minwt.com
	number：數字格包含小數點
	digits：數字為正整數
	date：日期格式
	dateISO：日期格式，格式必需為YYYY/MM/DD、YYYY-MM-DD、YYYYMMDD
	equalTo：與某一欄位值相同

	minValue：最小字元長度
	maxValue：最大字元長度
	rangeValue：字元長度區間長度

	minLength：最小字元長度(漢字算一個字符)
	maxLength：最大字元長度(漢字算一個字符)
	rangeLength：字元長度區間長度(漢字算一個字符)

	一般輸入框若沒有特別的狀況用此驗證，並設最長長度為15字
		vDefaultInputFormatChecker(以英文開頭並只能輸入英數字底線)
		
*/
//禁止輸入全型空白
jQuery.validator.addMethod('InputFullSpaceChecker', function(value) {
    var input = "　";        
    return !value.match(input);
});
//預設輸入框的格式檢查(以英文開頭並只能輸入英數字底線)
jQuery.validator.addMethod( "vDefaultInputFormatChecker",function(value,element){
	var v_regex  = /^[a-zA-Z][a-zA-Z0-9_]*$/;		
	if (value == '') 
		return true;
	else if(value.match(v_regex)==null)
		return false; 
	else
		return true;
},"Please enter only word-digital.");
//預設帳號的格式檢查(以英文開頭並只能輸入英數字底線@.)
jQuery.validator.addMethod( "vDefaultAccountChecker",function(value,element){
	var v_regex  = /^[a-zA-Z][a-zA-Z0-9_@.]*$/;		
	if (value == '') 
		return true;
	else if(value.match(v_regex)==null)
		return false; 
	else
		return true;
},"Please enter only word-digital.");
//預設密碼的格式檢查(只能輸入英數字及_!@#$%&)
jQuery.validator.addMethod( "vDefaultPasswordChecker",function(value,element){
	var v_regex  = /^[a-zA-Z][a-zA-Z0-9_!@#$%&]*$/;		
	if (value == '') 
		return true;
	else if (value.match(v_regex)==null)
		return false; 
	else
		return true;
},"Please enter the correct password format.");
//IP格式
jQuery.validator.addMethod( "vIP",function(value,element){
	var v_regex  = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
	if (value == '') 
		return true;
	else if(value.match(v_regex)==null)
		return false; 
	else
		return true;
},"Please enter only IP");
//至少3個字元
jQuery.validator.addMethod( "vMinLength3",function(value,element){
	if (value.length > 2)
		return true;
	else
		return false;
},"Please enter at least 3 characters.");
//至少5個字元
jQuery.validator.addMethod( "vMinLength5",function(value,element){
	if (value.length > 4) 
		return true; 
	else
		return false;
},"Please enter at least 5 characters.");
//最多15個字元
jQuery.validator.addMethod( "vMaxLength15",function(value,element){
	if (value.length < 16) 
		return true; 
	else
		return false;
},"Please enter at most 15 characters.");
//至少5個字元
jQuery.validator.addMethod( "vTimeout",function(value,element){
	if (parseInt(value) >= 0 && parseInt(value) <= 60) 
		return true; 
	else
		return false;
},"Please enter value within 0~60");
//值等於userpassword input
jQuery.validator.addMethod( "vEqual-userpassword",function(value,element){
	if (value !== $("#userpassword").val())
		return false; 
	else
		return true;
},"Please enter the same password.");