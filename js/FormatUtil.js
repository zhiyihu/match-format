var FormatUtil = function() {}

FormatUtil.getFormatStr = function(text) {
	text = text.replace(new RegExp(nulStr, "g"), "");
	for (var key in RepObj) {
		text = text.replace(new RegExp(key, "g"), RepObj[key]);
	}
	text = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9，。！？、…—：；‘“”’·《》（）\.\%\*\+-=~\/\\]/g, "");
	text = FormatUtil.replacePoint(text);
	return text;
}

FormatUtil.getEnChCount = function(text) {
	return (text.match(/[0-9a-zA-Z\.]/g) || []).length;
}

FormatUtil.exchangeNum = function(num, type){
	type = type || 0;
	num = num + '';
	var res = '';
	var numStr = '零一二三四五六七八九';
	var step = '个十百千万亿';
	if(type == 0){
		for(var c of num){
			res += numStr[c] || '';
		}
	}else if(type == 1){
		if(num == 2){
			return '两';
		}else{
			return FormatUtil.exchangeNumQuantity(num);
		}
	}

	return res;
}

FormatUtil.exchangeNumQuantity = function(num){
	var numStr = '零一二三四五六七八九十';
	var step = '个十百千万亿';
	var res = '';
	num = num - 0;
	numStrType = num + '';
	if(num <= 10){
		res = numStr[num];
	}else if(num < 20){
		res = '十' + numStr[num % 10];
	}else if(num < 100){
		res = numStr[Math.floor(num / 10)] + '十' + numStr[num % 10];
	}else if(num < 1000){
		res = numStr[Math.floor(num / 100)] + '百';
		if(num % 100 > 0){
			if(numStrType[1] == 0){
				res += '零';
			}else if(numStrType[1] == 1){
				res += '一';
			}
			res += FormatUtil.exchangeNumQuantity(num % 100);
		}
	}else if(num < 10000){
		res = numStr[Math.floor(num / 1000)] + '千';
		if(num % 1000 > 0){
			if(num % 1000 < 100){
				res += '零';
				if(Math.floor((num % 1000)/10) == 1){
					res += '一';
				}
			}
			res += FormatUtil.exchangeNumQuantity(num % 1000);
		}
	}else if(num < 100000000){
		res = FormatUtil.exchangeNumQuantity(Math.floor(num / 10000)) + '万';
		if(num % 10000 > 0){
			if(num % 10000 < 1000){
				res += '零';
				if(Math.floor((num % 1000)/10) == 1){
					res += '一';
				}
			}
			res += FormatUtil.exchangeNumQuantity(num % 1000);
		}
	}
	return res;
}


FormatUtil.getCutStr = function (fmtStr, cutNum) {
	let pureStr = fmtStr;
	let punc = '。？！…';
	let quote = '”';
	let cutArr = new Array();
	while (true) {
		if (fmtStr.length <= cutNum) {
			cutArr.push(fmtStr);
			break;
		}
		let puncArr = new Array();
		let startIndex = Math.max(0, cutNum - 250);
		for (let i = startIndex; i < fmtStr.length && i < cutNum; i++) {
			let ch = fmtStr[i];
			if (punc.includes(ch)) {
				puncArr.push(i);
			}
			if (quote == ch && punc.includes(fmtStr[i - 1])) {
				puncArr.push(i);
			}
		}

		let subIndex = cutNum;
		if(puncArr.length > 0){
			let cutArrLen = cutArr.length;
			for(let i = puncArr.length - 1; i >= 0; i--){
				subIndex = puncArr[i] + 1;
				let cutStr = fmtStr.substr(0, subIndex);
				let matchArr = cutStr.match(/[“”]/g) || [];
				if(matchArr.length % 2 == 0){
					cutArr.push(cutStr);
					fmtStr = fmtStr.substr(subIndex);
					break;
				}
			}
			if(cutArrLen == cutArr.length){
				wx.showToast({
					title: '引号切断错误',
					icon: 'none'
				});
				return pureStr;
			}
		}else{
			return pureStr;
		}
		
	}
	
	return cutArr.join("\r\n\r\n\r\n");
}


FormatUtil.getOUT3500 = function(fmtStr) {
	var res = "";
	var gbkStr = "";
	var out3500 = "";
	for (var i = 0; i < fmtStr.length; i++) {
		var ch = fmtStr.charAt(i);
		if (FormatUtil.isGbk(ch) && gbkStr.indexOf(ch) < 0) {
			gbkStr += ch;
		} else if (gb2312.indexOf(ch) > 3500 && out3500.indexOf(ch) < 0) {
			out3500 += ch;
		}
	}

	res = (gbkStr ? "【" + gbkStr + "】" : "") + out3500;

	if (res.length > 30) {
		res = res.substr(0, 30) + "……";
	}
	return (res ? res : "0");
}

FormatUtil.isGbk = function(ch) {
	return !!(ch.match(/[\u4e00-\u9fa5]/g) && gb2312.indexOf(ch) < 0);
}

FormatUtil.getStatusHTML = function(text) {
	var statusStr = FormatUtil.checkQuote(text);
	if (statusStr) {
		return "<span style='color:#ff0000'>" + statusStr + "<span>"
	}
	return "Normal";
}

/**
 * 替换英文点号，点号前是非数字则替换，点号在结尾也进行替换
 */
FormatUtil.replacePoint = function(str) {
	var result = "";
	var len = str.length;
	for (var i = 0; i < len; i++) {
		if (i > 0 && str.charAt(i) == '.' && (!str.charAt(i - 1).match(/[0-9]/g) || i == len - 1)) {
			result += '。';
		} else {
			result += str.charAt(i);
		}
	}
	return result;
}

FormatUtil.getDisorderSingleWord = function(type, num) {
	var typeArr = [
		[0, 500],
		[500, 1000],
		[1000, 1500],
		[0, 1500]
	];
	var words = gb2312.substring(typeArr[type][0], typeArr[type][1]);
	return FormatUtil.shuffle(words.split("")).join("").substr(0, num);
}

/**
 * 洗牌算法，将数组内元素乱序
 * @param {Object} arr
 */
FormatUtil.shuffle = function(arr) {
	var j, x, i;
	for (i = arr.length; i; i--) {
		j = Math.floor(Math.random() * i);
		x = arr[i - 1];
		arr[i - 1] = arr[j];
		arr[j] = x;
	}
	return arr;
}

FormatUtil.checkQuote = function(text) {
	var checkChArr = ["“”", "‘’", "《》", "（）"];
	var res = "";
	for (var i = 0; i < checkChArr.length; i++) {
		var quoteStr = checkChArr[i];
		res = FormatUtil.checkChDouble(quoteStr, text);
		if (res) {
			return res;
		}
	}
	res = res || FormatUtil.checkSingleQuote("—", text, "破折号") || FormatUtil.checkSingleQuote("…", text, "省略号");
	return res;
}

FormatUtil.checkSingleQuote = function(quoteStr, text, quoteName){
	let pz = text.match(new RegExp(quoteStr, "g")) || [];
	let pz2 = text.match(new RegExp(quoteStr + quoteStr, "g")) || [];
	if(pz.length / 2 != pz2.length){
		res = quoteName + "单个错误";
		return res;
	}
	return "";
}

/**
 * 校验符号是否配对，如双引号，括号等
 * @param {Object} quoteStr 要检测配对的符号字数串，如"()"
 * @param {Object} content 要检测的内容
 */
FormatUtil.checkChDouble = function(quoteStr, content) {
	var leftCh = quoteStr.charAt(0);
	var rightCh = quoteStr.charAt(1);
	var arr = content.match(new RegExp("[" + quoteStr + "]", "g"));
	if (!arr) {
		return "";
	}
	var leftCount = 0;
	var rightCount = 0;
	for (var i = 0; i < arr.length; i++) {
		var ch = arr[i];
		if (i % 2 == 0 && ch != leftCh || i % 2 == 1 && ch != rightCh) {
			return "<span style='font-family:宋体'>" + quoteStr + "</span>配对错误";
		}
		leftCount += (i + 1) % 2;
		rightCount += i % 2;
	}
	if (leftCount != rightCount) {
		return "缺失<span style='font-family:宋体'>" + (leftCount < rightCount ? leftCh : rightCh) + "</span>x" + Math.abs(
			rightCount - leftCount);
	}
	return "";

}
