/**
 * 取得使用者待驗證資訊
 * 
 * @param accountName 使用者帳號
 * @param password 使用者密碼
 * @return 使用者待驗證資訊
 */
function _getAuthData(accountName, password) {
	var key = _getHashKey(_hashCode(accountName));
	var authData = _getAuthDataBeforeEncrypt(accountName, password)
	return _encryptByDES(key, authData);
}


/**
 * 取得處理後的待加密字串
 * 
 * @param accountName 使用者帳號
 * @param password 使用者密碼
 * @return 處理後的待加密字串
 */
function _getAuthDataBeforeEncrypt(accountName, password) {
	// 待驗證資訊AuthData組成 : password + 分隔符號(accountName的hash code取右邊8碼) + 系統14位時間值 + uuid
	var key = _getHashKey(_hashCode(accountName));

	function pad2(n) {
		return n < 10 ? '0' + n : n
	}
	var date = new Date();
	var datetime = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
	return password + key + datetime + _getRandomUUID();
}

/**
 * 取得random UUID
 *
 * @return random UUID
 */
function _getRandomUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});
}

/**
 * 算出字串的hash code
 * 
 * @param str 字串
 * @return Hash後的字串
 */
var _hashCode = function(str) {
	return str.split("").reduce(function(a, b) {
		a = ((a << 5) - a) + b.charCodeAt(0);
		return a & a
	}, 0);
}

/**
 * key的hash code取右邊8碼,不足8碼左邊補0
 * 
 * @param str key
 * @return hash key
 */
var _getHashKey = function(str) {
	str = "" + str;
	// 去除負號
	str = str.replace("-", "");
	if (str.length > 8) {
		str = str.substring(str.length - 8, str.length);
	} else {
		while (str.length < 8) {
			str = "0" + str;
		}
	}
	return str;
}

/**
 * DES加密
 * 
 * @param key key字串
 * @param authData 待加密字串
 * @return 加密後再經Base64處理後之字串
 */
function _encryptByDES(key, authData) {
	var keyHex = CryptoJS.enc.Utf8.parse(key);
	var encrypted = CryptoJS.DES.encrypt(authData, keyHex, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return encrypted.toString();
}